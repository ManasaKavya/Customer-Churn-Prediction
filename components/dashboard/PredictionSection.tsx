'use client'

import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

interface PredictionResult {
  prediction: {
    churn_probability: number
    churn_label: string
    risk_level: string
    confidence_score: number
  }
  risk_factors: string[]
  customer_profile: any
}

export function PredictionSection() {
  const [formData, setFormData] = useState({
    age: '35',
    tenure: '24',
    creditScore: '750',
    balance: '50000',
    monthlyCharges: '500',
    numProducts: '2',
    hasCreditCard: '1',
    isActiveMember: '1',
    country: 'France',
    gender: 'Male',
    customerType: 'Regular'
  })

  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked ? '1' : '0' : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(formData.age),
          tenure: parseInt(formData.tenure),
          creditScore: parseInt(formData.creditScore),
          balance: parseFloat(formData.balance),
          monthlyCharges: parseFloat(formData.monthlyCharges),
          numProducts: parseInt(formData.numProducts),
          hasCreditCard: formData.hasCreditCard === '1',
          isActiveMember: formData.isActiveMember === '1',
          country: formData.country,
          gender: formData.gender,
          customerType: formData.customerType
        })
      })

      if (!response.ok) throw new Error('Prediction failed')
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate prediction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Churn Prediction</h1>
        <p className="text-muted-foreground">Enter customer details to predict churn probability</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="p-6 bg-card border border-border rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} min="18" max="100" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tenure (months)</label>
              <input type="number" name="tenure" value={formData.tenure} onChange={handleChange} min="0" max="72" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Credit Score</label>
              <input type="number" name="creditScore" value={formData.creditScore} onChange={handleChange} min="300" max="850" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Balance ($)</label>
              <input type="number" name="balance" value={formData.balance} onChange={handleChange} min="0" step="1000" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Monthly Charges ($)</label>
              <input type="number" name="monthlyCharges" value={formData.monthlyCharges} onChange={handleChange} min="0" step="50" className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Number of Products</label>
              <select name="numProducts" value={formData.numProducts} onChange={handleChange} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Country</label>
              <select name="country" value={formData.country} onChange={handleChange} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="France">France</option>
                <option value="Germany">Germany</option>
                <option value="Spain">Spain</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Customer Type</label>
              <select name="customerType" value={formData.customerType} onChange={handleChange} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="Regular">Regular</option>
                <option value="Premium">Premium</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="hasCC" name="hasCreditCard" checked={formData.hasCreditCard === '1'} onChange={handleChange} className="rounded" />
              <label htmlFor="hasCC" className="text-sm font-medium text-foreground">Has Credit Card</label>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="isActive" name="isActiveMember" checked={formData.isActiveMember === '1'} onChange={handleChange} className="rounded" />
              <label htmlFor="isActive" className="text-sm font-medium text-foreground">Active Member</label>
            </div>

            <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors duration-200 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Predicting...' : 'Generate Prediction'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-2">
          {error && (
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Main Prediction */}
              <div className={`p-8 rounded-lg border-2 ${result.prediction.churn_label === 'Likely to Churn' ? 'bg-red-500/10 border-red-500' : 'bg-green-500/10 border-green-500'}`}>
                <div className="flex items-start gap-4">
                  {result.prediction.churn_label === 'Likely to Churn' ? (
                    <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                  ) : (
                    <CheckCircle2 className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{result.prediction.churn_label}</h3>
                    <p className={`text-lg font-semibold mb-3 ${result.prediction.churn_label === 'Likely to Churn' ? 'text-red-500' : 'text-green-500'}`}>
                      Churn Probability: {result.prediction.churn_probability}%
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Risk Level:</span>
                      <span className={`px-3 py-1 rounded-full font-medium text-sm ${
                        result.prediction.risk_level === 'High' ? 'bg-red-500/20 text-red-500' :
                        result.prediction.risk_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                        'bg-green-500/20 text-green-500'
                      }`}>
                        {result.prediction.risk_level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="p-6 bg-card border border-border rounded-lg">
                <h4 className="font-semibold text-foreground mb-4">Risk Factors</h4>
                <div className="space-y-2">
                  {result.risk_factors.map((factor, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-foreground text-sm">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!result && !error && (
            <div className="p-12 bg-card border border-border rounded-lg text-center">
              <p className="text-muted-foreground">Fill in the customer details and click "Generate Prediction" to see results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
