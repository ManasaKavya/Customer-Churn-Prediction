import Link from 'next/link'
import { ArrowRight, BarChart3 } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Advanced ML Analytics</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          Predict Customer
          <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent"> Churn</span>
          {' '}with Confidence
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          Leverage advanced machine learning to identify at-risk customers before they leave. Make data-driven decisions with our comprehensive analytics platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            View Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card text-foreground font-semibold rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200"
          >
            Learn More
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 pt-12 border-t border-border max-w-2xl mx-auto">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-primary">10K+</div>
            <p className="text-sm text-muted-foreground">Customer Records</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-primary">2</div>
            <p className="text-sm text-muted-foreground">ML Models</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-primary">20%</div>
            <p className="text-sm text-muted-foreground">Churn Rate</p>
          </div>
        </div>
      </div>
    </section>
  )
}
