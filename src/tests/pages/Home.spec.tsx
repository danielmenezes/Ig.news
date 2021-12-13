import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/client'
import { stripe } from '../../services/stripe'
import { mocked } from 'ts-jest/utils'
import Home, { getStaticProps } from '../../pages/index'

jest.mock('next/router')
jest.mock('next-auth/client')
jest.mock('../../services/stripe')


describe('Home page', () => {

  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<Home product={{ priceId: 'fake-price-id', amount: 10 }} />)

    expect(screen.getByText('for $10.00 month')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const retriveStripePricesMocked = mocked(stripe.prices.retrieve)

    retriveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: 10,
          }
        }
      })
    )
  })
})