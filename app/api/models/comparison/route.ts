import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const metricsPath = join(process.cwd(), 'public/data/model_metrics.json')
    const data = readFileSync(metricsPath, 'utf-8')
    const metrics = JSON.parse(data)
    
    // Transform for easier consumption
    const comparison = {
      models: Object.entries(metrics).map(([name, data]: [string, any]) => ({
        name: name.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        metrics: {
          accuracy: data.accuracy,
          precision: data.precision,
          recall: data.recall,
          f1_score: data.f1_score,
          roc_auc: data.roc_auc
        },
        confusion_matrix: data.confusion_matrix,
        feature_importance: data.feature_importance || {}
      }))
    }
    
    return NextResponse.json(comparison)
  } catch (error) {
    console.error('Error reading model metrics:', error)
    return NextResponse.json(
      { error: 'Failed to load model metrics' },
      { status: 500 }
    )
  }
}
