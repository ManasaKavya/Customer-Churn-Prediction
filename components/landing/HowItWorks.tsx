import { Database, Microscope, Bot, BarChart3 } from 'lucide-react'

const steps = [
  {
    icon: Database,
    number: '1',
    title: 'Data Ingestion',
    description: 'Load customer data with features like age, tenure, balance, and transaction history.'
  },
  {
    icon: Microscope,
    number: '2',
    title: 'EDA & Analysis',
    description: 'Explore patterns, correlations, and behavioral trends in customer data.'
  },
  {
    icon: Bot,
    number: '3',
    title: 'Model Training',
    description: 'Train and compare ML models with automated hyperparameter tuning.'
  },
  {
    icon: BarChart3,
    number: '4',
    title: 'Predictions',
    description: 'Generate predictions and identify high-risk customers for retention campaigns.'
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 sm:py-32 bg-card/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A streamlined pipeline from data to insights to predictions
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection lines for larger screens */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                {/* Step card */}
                <div className="p-8 rounded-xl bg-background border border-border hover:border-primary/50 transition-all duration-300 h-full">
                  {/* Circle background */}
                  <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-6 mt-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
