import { TrendingUp, Brain, Zap, BarChart3, Sparkles, Lock } from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Exploratory Data Analysis',
    description: 'Comprehensive EDA with visualizations, correlations, and statistical insights into customer behavior patterns.'
  },
  {
    icon: Brain,
    title: 'Multiple ML Models',
    description: 'Compare Logistic Regression and Random Forest with hyperparameter tuning for optimal performance.'
  },
  {
    icon: TrendingUp,
    title: 'Real-time Predictions',
    description: 'Get instant churn predictions for individual customers or upload batch data for analysis.'
  },
  {
    icon: Zap,
    title: 'Performance Metrics',
    description: 'Detailed evaluation including Accuracy, Precision, Recall, F1-Score, ROC-AUC, and Confusion Matrix.'
  },
  {
    icon: Sparkles,
    title: 'Interactive Dashboard',
    description: 'Beautiful visualizations and charts to explore data, compare models, and track insights.'
  },
  {
    icon: Lock,
    title: 'Production Ready',
    description: 'Built with scikit-learn, pandas, and modern web technologies for reliability and scalability.'
  }
]

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to understand and predict customer churn with advanced analytics
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group p-8 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300 mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
