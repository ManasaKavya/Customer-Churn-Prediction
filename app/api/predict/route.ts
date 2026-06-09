import { NextRequest, NextResponse } from 'next/server'

// Mock prediction function - would be replaced with actual model inference
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { age, tenure, creditScore, balance, monthlyCharges, numProducts, hasCreditCard, isActiveMember, country, gender, customerType } = body

    // Validate input
    if (!age || tenure === undefined || !creditScore || balance === undefined || !monthlyCharges) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Simple heuristic-based prediction for demonstration
    // In production, this would use the trained scikit-learn models
    let churnScore = 0
    let reasoning: string[] = []

    // Low tenure is a risk factor
    if (tenure < 12) {
      churnScore += 30
      reasoning.push('New customer (tenure < 12 months)')
    }

    // High monthly charges
    if (monthlyCharges > 1000) {
      churnScore += 20
      reasoning.push('High monthly charges')
    }

    // Low balance
    if (balance < 10000) {
      churnScore += 15
      reasoning.push('Low account balance')
    }

    // Inactive member
    if (!isActiveMember) {
      churnScore += 25
      reasoning.push('Inactive member')
    }

    // Single product customer
    if (numProducts === 1) {
      churnScore += 15
      reasoning.push('Single product customer')
    }

    // No credit card
    if (!hasCreditCard) {
      churnScore += 10
      reasoning.push('No credit card')
    }

    // Age factor (younger customers churn more)
    if (age < 30) {
      churnScore += 15
      reasoning.push('Younger demographic (higher churn propensity)')
    } else if (age > 60) {
      churnScore -= 10
      reasoning.push('Senior customer (lower churn propensity)')
    }

    // Normalize score to 0-1 range
    const probability = Math.min(Math.max(churnScore / 100, 0), 1)
    const churnLabel = probability > 0.5 ? 'Likely to Churn' : 'Likely to Stay'
    const riskLevel = probability > 0.7 ? 'High' : probability > 0.4 ? 'Medium' : 'Low'

    return NextResponse.json({
      prediction: {
        churn_probability: Math.round(probability * 100),
        churn_label: churnLabel,
        risk_level: riskLevel,
        confidence_score: Math.round((1 - Math.abs(probability - 0.5)) * 2 * 100)
      },
      risk_factors: reasoning,
      customer_profile: {
        age,
        tenure,
        creditScore,
        balance,
        monthlyCharges,
        numProducts,
        hasCreditCard,
        isActiveMember,
        country,
        gender,
        customerType
      }
    })
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    )
  }
}
