import { describe, expect, test } from '@jest/globals'

import { stripe } from '@revealed/api'

describe('sum module', () => {
  test('adds 1 + 2 to equal 3', () => {
    const payload = {
      id: 'evt_test_webhook',
      object: 'event',
    }

    const payloadString = JSON.stringify(payload, null, 2)
    const secret = 'whsec_test_secret'

    const header = stripe.webhooks.generateTestHeaderString({
      payload: payloadString,
      secret,
    })

    const event = stripe.webhooks.constructEvent(payloadString, header, secret)

    console.log(event)

    // Do something with mocked signed event
    expect(event.id).toBe(payload.id)
  })
})
