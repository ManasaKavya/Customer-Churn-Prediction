import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
            <Zap className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          Ready to Reduce Customer Churn?
        </h2>

        {/* Description */}
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Start analyzing your customer base with our advanced churn prediction system. Get actionable insights and predictions in minutes, not hours.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Launch Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-background text-foreground font-semibold rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200"
          >
            Explore Features
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-sm text-muted-foreground mt-12 pt-8 border-t border-border">
          Built with scikit-learn, pandas, and Next.js. Production-ready analytics platform.
        </p>
      </div>
    </section>
  )
}
