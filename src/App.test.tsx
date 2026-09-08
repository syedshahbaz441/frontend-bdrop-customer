import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App'

describe('Customer app', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn()
        .mockResolvedValueOnce({
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
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
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
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 99,
            service: 'Pickup & drop',
            status: 'Order placed',
            pickupLocation: 'Downtown Hub',
            dropoffLocation: 'Museum',
            orderDate: '2026-09-10',
            pickupTime: '10:00 AM',
            estimatedArrival: 'Awaiting driver',
            totalAmount: 18,
            progress: 15,
          }),
        }),
    )
  })

  it('loads orders and allows a customer to create a booking', async () => {
    render(<App />)

    expect(await screen.findByText(/food delivery/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /pickup & drop/i }))
    fireEvent.change(screen.getByLabelText(/pickup location/i), {
      target: { value: 'Downtown Hub' },
    })
    fireEvent.change(screen.getByLabelText(/drop-off location/i), {
      target: { value: 'Museum' },
    })
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => {
      expect(screen.getByText(/pickup & drop/i)).toBeInTheDocument()
    })
  })
})
