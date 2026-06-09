import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { CTA } from '@/components/landing/CTA'

export const metadata = {
  title: 'Customer Churn Prediction System',
  description: 'Advanced ML-powered platform to predict customer churn and reduce attrition with data-driven insights.',
}

export default function Page() {
  return (
    <main className="bg-background">
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
    </main>
  )
}
