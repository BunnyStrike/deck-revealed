import React from 'react'

import PrivacyPolicy from './PrivacyPolicy'

export const PrivacyPolicyPage = (
  items: JSX.IntrinsicAttributes &
    Pick<
      {
        googleAnalytics?: any
        kitchenSink?: any
        googleAdSense?: any
        googleAdmob?: any
        googleAdWords?: any
        facebook?: any
        twitter?: any
        appleStore?: any
        googleStore?: any
        stripe?: any
        paypal?: any
        braintree?: any
        firebase?: any
        effective?: any
        url: any
        mobile?: any
        personalData?: any
        legalName: any
        advertising?: any
        remarketing?: any
        payments?: any
        storage?: any
        contacts?: any
      },
      never
    > & {
      googleAnalytics?: any
      kitchenSink?: any
      googleAdSense?: any
      googleAdmob?: any
      googleAdWords?: any
      facebook?: any
      twitter?: any
      appleStore?: any
      googleStore?: any
      stripe?: any
      paypal?: any
      braintree?: any
      firebase?: any
      effective?: any
      url?: any
      mobile?: any
      personalData?: any
      legalName?: any
      advertising?: any
      remarketing?: any
      payments?: any
      storage?: any
      contacts?: any
    } & {
      showHeader?: boolean | undefined
      covers?: string[] | undefined
      analytics?: never[] | undefined
    }
) => {
  return (
    <>
      <div className="relative overflow-hidden bg-white py-16">
        <div className="relative px-4 sm:px-6 lg:px-8">
          <PrivacyPolicy
            googleAnalytics={true}
            googleAdSense={true}
            googleAdmob={true}
            googleAdWords={true}
            firebase={true}
            {...items}
          ></PrivacyPolicy>
        </div>
      </div>
    </>
  )
}

export default PrivacyPolicyPage
