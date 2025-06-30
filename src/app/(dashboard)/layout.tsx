import { type ReactNode } from 'react'
import Header from '../../components/global/header'
import { OnboardingCheck } from '../../features/balance/components/onboarding-check'

type Props = { children: ReactNode }

const layout = ({ children }: Props) => {
  return (
    <OnboardingCheck>
      <Header />
      <main className='px-3 lg:px-14'>
        {children}
      </main>
    </OnboardingCheck>
  )
}

export default layout
