import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('Customer app', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn((input: RequestInfo | URL) => {
        const url = String(input)

        if (url.includes('/api/health')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({ status: 'ok' }),
          })
        }

        if (url.includes('/auth/login')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              token: 'demo-token',
              user: { id: 7, name: 'Ava Patel', email: 'ava@buddydrop.com' },
            }),
          })
        }

        if (url.includes('/restaurants')) {
          return Promise.resolve({
            ok: true,
            json: async () => [
              {
                id: 1,
                name: 'Urban Bites',
                location: 'Downtown',
                categories: ['food', 'pickup'],
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
            ],
          })
        }

        if (url.includes('/orders')) {
          return Promise.resolve({
            ok: true,
            json: async () => [
              {
                id: 1,
                service: 'Food delivery',
                status: 'On the way',
                pickupLocation: 'Riverside Market',
                dropoffLocation: 'City Hall',
                orderDate: 'Today',
                pickupTime: '4:30 PM',
                estimatedArrival: '5:15 PM',
                totalAmount: 22.5,
                progress: 68,
              },
            ],
          })
        }

        return Promise.resolve({
          ok: true,
          json: async () => ({ status: 'ok' }),
        })
      }),
    )
  })

  it('logs in and displays only the restaurants and categories available for the selected location', async () => {
    render(<App />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'ava@buddydrop.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'demo123' },
    })
    fireEvent.change(screen.getByLabelText(/location/i), {
      target: { value: 'Downtown' },
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByText(/welcome back, ava/i)).toBeInTheDocument()
    expect(await screen.findByText(/urban bites/i)).toBeInTheDocument()

    const foodButton = await screen.findByRole('button', { name: /food delivery/i })
    const pickupButton = await screen.findByRole('button', { name: /pickup & drop/i })
    const drinksButton = await screen.findByRole('button', { name: /drinks/i })

    expect(foodButton).not.toBeDisabled()
    expect(pickupButton).not.toBeDisabled()
    expect(drinksButton).toBeDisabled()
  })
})
