import { useEffect, useState } from 'react'
import './App.css'
import {
  createCustomerOrder,
  getActiveCustomerOrder,
  getCustomerOrders,
  type CustomerOrderResponse,
} from './api/customerApi'

const serviceOptions = [
  { key: 'food', label: 'Food delivery', price: 22.5 },
  { key: 'pickup', label: 'Pickup & drop', price: 18 },
  { key: 'drop', label: 'Goods transfer', price: 24 },
] as const

function App() {
  const [selectedService, setSelectedService] = useState<(typeof serviceOptions)[number]['key']>('food')
  const [pickupLocation, setPickupLocation] = useState('Riverside Market')
  const [dropoffLocation, setDropoffLocation] = useState('City Hall')
  const [orders, setOrders] = useState<CustomerOrderResponse[]>([])
  const [activeOrder, setActiveOrder] = useState<CustomerOrderResponse | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      const [list, active] = await Promise.all([
        getCustomerOrders(),
        getActiveCustomerOrder(),
      ])
      setOrders(list)
      setActiveOrder(active)
    }

    void loadOrders()
  }, [])

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

  return (
    <main className="customer-app">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">BuddyDrop customer</p>
          <h1>Food, pickup, and drop services in one place.</h1>
        </div>
      </section>

      <section className="layout">
        <form className="order-form" onSubmit={handleSubmit}>
          <h2>Place your order</h2>

          <div className="service-grid" aria-label="service selection">
            {serviceOptions.map((service) => (
              <button
                key={service.key}
                type="button"
                className={selectedService === service.key ? 'service-option selected' : 'service-option'}
                onClick={() => setSelectedService(service.key)}
              >
                {service.label}
              </button>
            ))}
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
                <p>{order.pickupLocation} → {order.dropoffLocation}</p>
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
