import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const dataPath = join(process.cwd(), 'public/data/eda_results.json')
    const data = readFileSync(dataPath, 'utf-8')
    const edaResults = JSON.parse(data)
    
    return NextResponse.json(edaResults)
  } catch (error) {
    console.error('Error reading EDA data:', error)
    return NextResponse.json(
      { error: 'Failed to load EDA data' },
      { status: 500 }
    )
  }
}
