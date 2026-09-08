import { useEffect, useState } from 'react'
import './App.css'
import {
  createCustomerOrder,
  getActiveCustomerOrder,
  getCustomerOrders,
  getRestaurants,
  loginCustomer,
  type Restaurant,
  type CustomerOrderResponse,
} from './api/customerApi'

function BackendConnectivityStatus() {
  const [status, setStatus] = useState<'connected' | 'offline'>('offline')
  const [lastSeen, setLastSeen] = useState('')

  useEffect(() => {
    const pingBackend = async () => {
      try {
        const response = await fetch('/api/health', { cache: 'no-store' })

        if (response.ok) {
          setStatus('connected')
          setLastSeen(new Date().toLocaleString())
        } else {
          setStatus('offline')
        }
      } catch {
        setStatus('offline')
      }
    }

    void pingBackend()
    const intervalId = window.setInterval(() => {
      void pingBackend()
    }, 15000)

    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <div className={status === 'connected' ? 'backend-connection connected' : 'backend-connection'}>
      <div className="backend-indicator" aria-label="backend connectivity status" />
      <div>
        <div className="backend-title">{status === 'connected' ? 'Connected' : 'Offline'}</div>
        <div className="backend-meta">
          {status === 'connected' ? 'buddydrop-backend heartbeat at' : 'waiting for buddydrop-backend heartbeat'}
          {lastSeen ? ` ${lastSeen}` : ''}
        </div>
      </div>
    </div>
  )
}

const serviceOptions = [
  { key: 'food', label: 'Food delivery', price: 22.5 },
  { key: 'pickup', label: 'Pickup & drop', price: 18 },
  { key: 'drop', label: 'Goods transfer', price: 24 },
  { key: 'drinks', label: 'Drinks', price: 12 },
] as const

const fallbackRestaurants: Restaurant[] = [
  {
    id: 1,
    name: 'Urban Bites',
    location: 'Downtown',
    categories: ['food', 'pickup', 'drop'],
    deliveryFee: 4.5,
    eta: '18-25 min',
  },
  {
    id: 2,
    name: 'Green Table',
    location: 'Midtown',
    categories: ['food', 'drinks'],
    deliveryFee: 3.5,
    eta: '21-30 min',
  },
  {
    id: 3,
    name: 'QuickMove',
    location: 'Riverside',
    categories: ['pickup', 'drop'],
    deliveryFee: 5,
    eta: '15-20 min',
  },
]

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authUser, setAuthUser] = useState<{ name: string; email: string } | null>(null)
  const [loginForm, setLoginForm] = useState({ email: 'ava@buddydrop.com', password: 'demo123', location: 'Downtown' })
  const [loginError, setLoginError] = useState('')
  const [location, setLocation] = useState('Downtown')
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null)
  const [selectedService, setSelectedService] = useState<(typeof serviceOptions)[number]['key']>('food')
  const [pickupLocation, setPickupLocation] = useState('Riverside Market')
  const [dropoffLocation, setDropoffLocation] = useState('City Hall')
  const [orders, setOrders] = useState<CustomerOrderResponse[]>([])
  const [activeOrder, setActiveOrder] = useState<CustomerOrderResponse | null>(null)
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(false)

  const selectedRestaurant =
    restaurants.find((restaurant) => restaurant.id === selectedRestaurantId) ?? restaurants[0] ?? null

  const availableCategories = new Set(selectedRestaurant?.categories ?? ['food', 'pickup', 'drop'])

  useEffect(() => {
    const storedToken = localStorage.getItem('buddydrop-token')
    const storedUser = localStorage.getItem('buddydrop-user')

    if (storedToken && storedUser) {
      setIsLoggedIn(true)
      setAuthUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return

    const loadRestaurants = async () => {
      setIsLoadingRestaurants(true)

      try {
        const locationRestaurants = await getRestaurants(location)
        setRestaurants(locationRestaurants.length ? locationRestaurants : fallbackRestaurants.filter((restaurant) => restaurant.location === location || !location))
      } catch {
        const filtered = fallbackRestaurants.filter((restaurant) =>
          restaurant.location.toLowerCase() === location.toLowerCase() || !location,
        )
        setRestaurants(filtered.length ? filtered : fallbackRestaurants)
      } finally {
        setIsLoadingRestaurants(false)
      }
    }

    void loadRestaurants()
  }, [isLoggedIn, location])

  useEffect(() => {
    if (!restaurants.length) return

    if (!selectedRestaurantId || !restaurants.some((restaurant) => restaurant.id === selectedRestaurantId)) {
      setSelectedRestaurantId(restaurants[0].id)
    }
  }, [restaurants, selectedRestaurantId])

  useEffect(() => {
    if (!selectedRestaurant) return

    const firstAvailable = serviceOptions.find((service) => selectedRestaurant.categories.includes(service.key))
    if (!firstAvailable) return

    if (!availableCategories.has(selectedService)) {
      setSelectedService(firstAvailable.key)
    }
  }, [availableCategories, selectedRestaurant, selectedService])

  useEffect(() => {
    if (!isLoggedIn) return

    const loadOrders = async () => {
      try {
        const [list, active] = await Promise.all([getCustomerOrders(), getActiveCustomerOrder()])
        setOrders(list)
        setActiveOrder(active)
      } catch {
        setOrders([])
        setActiveOrder(null)
      }
    }

    void loadOrders()
  }, [isLoggedIn])

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoginError('')

    try {
      const response = await loginCustomer({
        email: loginForm.email,
        password: loginForm.password,
        location: loginForm.location,
      })

      localStorage.setItem('buddydrop-token', response.token)
      localStorage.setItem('buddydrop-user', JSON.stringify(response.user))
      setLocation(loginForm.location || 'Downtown')
      setAuthUser(response.user)
      setIsLoggedIn(true)
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Unable to sign in.')
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const chosen = serviceOptions.find((item) => item.key === selectedService) ?? serviceOptions[0]

    const payload = {
      service: chosen.label,
      pickupLocation,
      dropoffLocation,
      orderDate: new Date().toISOString().slice(0, 10),
      pickupTime: '4:30 PM',
      totalAmount: chosen.price,
    }

    const created = await createCustomerOrder(payload)
    setOrders((current) => [created, ...current])
    setActiveOrder(created)
  }

  if (!isLoggedIn) {
    return (
      <main className="auth-shell">
        <BackendConnectivityStatus />

        <form className="auth-card" onSubmit={handleLogin}>
          <p className="eyebrow">BuddyDrop</p>
          <h1>Welcome back</h1>
          <p className="auth-subtitle">Sign in to discover the best restaurant choices for your area.</p>

          <label>
            Email
            <input
              aria-label="Email"
              type="email"
              value={loginForm.email}
              onChange={(event) => setLoginForm((current) => ({ ...current, email: event.target.value }))}
            />
          </label>

          <label>
            Password
            <input
              aria-label="Password"
              type="password"
              value={loginForm.password}
              onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
            />
          </label>

          <label>
            Location
            <input
              aria-label="Location"
              value={loginForm.location}
              onChange={(event) => setLoginForm((current) => ({ ...current, location: event.target.value }))}
            />
          </label>

          {loginError ? <p className="error-message">{loginError}</p> : null}

          <button type="submit" className="primary-btn">
            Sign in
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="customer-app">
      <BackendConnectivityStatus />

      <section className="hero-panel">
        <div>
          <p className="eyebrow">BuddyDrop customer</p>
          <h1>Food, pickup, and drop services in one place.</h1>
        </div>
        <div className="hero-meta">
          <p>Welcome back, {authUser?.name ?? 'Customer'}.</p>
          <label className="location-field">
            <span>Location</span>
            <input
              aria-label="Location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="restaurant-panel">
        <h2>Available restaurants</h2>
        {isLoadingRestaurants ? <p>Loading restaurants...</p> : null}
        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <button
              key={restaurant.id}
              type="button"
              className={selectedRestaurant?.id === restaurant.id ? 'restaurant-card selected' : 'restaurant-card'}
              onClick={() => setSelectedRestaurantId(restaurant.id)}
            >
              <strong>{restaurant.name}</strong>
              <span>{restaurant.location}</span>
              <small>{restaurant.eta}</small>
              <em>${restaurant.deliveryFee.toFixed(2)} delivery fee</em>
            </button>
          ))}
        </div>
      </section>

      <section className="layout">
        <form className="order-form" onSubmit={handleSubmit}>
          <h2>Place your order</h2>

          <div className="service-grid" aria-label="service selection">
            {serviceOptions.map((service) => {
              const isEnabled = !selectedRestaurant || availableCategories.has(service.key)

              return (
                <button
                  key={service.key}
                  type="button"
                  className={selectedService === service.key ? 'service-option selected' : 'service-option'}
                  disabled={!isEnabled}
                  onClick={() => {
                    if (isEnabled) {
                      setSelectedService(service.key)
                    }
                  }}
                >
                  {service.label}
                </button>
              )
            })}
          </div>

          <label>
            Pickup location
            <input
              aria-label="Pickup location"
              value={pickupLocation}
              onChange={(event) => setPickupLocation(event.target.value)}
            />
          </label>

          <label>
            Drop-off location
            <input
              aria-label="Drop-off location"
              value={dropoffLocation}
              onChange={(event) => setDropoffLocation(event.target.value)}
            />
          </label>

          <div className="summary-row">
            <span>Total</span>
            <strong>
              ${serviceOptions.find((item) => item.key === selectedService)?.price ?? 0}
            </strong>
          </div>

          <button type="submit" className="primary-btn">
            Place order
          </button>
        </form>

        <aside className="status-panel">
          <h2>Live order</h2>
          {activeOrder ? (
            <div className="active-card">
              <p className="service-name">{activeOrder.service}</p>
              <p>{activeOrder.status}</p>
              <div className="meta-grid">
                <span>From</span>
                <strong>{activeOrder.pickupLocation}</strong>
                <span>To</span>
                <strong>{activeOrder.dropoffLocation}</strong>
              </div>
              <div className="progress-bar">
                <span style={{ width: `${activeOrder.progress}%` }} />
              </div>
              <small>{activeOrder.progress}% complete</small>
            </div>
          ) : (
            <p>No active order yet.</p>
          )}
        </aside>
      </section>

      <section className="orders-panel">
        <h2>Recent orders</h2>
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
              <div>
                <p className="service-name">{order.service}</p>
                <small>{order.orderDate}</small>
              </div>
              <div>
                <strong>{order.status}</strong>
                <p>
                  {order.pickupLocation} → {order.dropoffLocation}
                </p>
              </div>
              <span className="amount">${order.totalAmount}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
