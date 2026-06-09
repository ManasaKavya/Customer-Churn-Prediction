'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/Layout'
import { EDASection } from '@/components/dashboard/EDASection'
import { ModelPerformanceSection } from '@/components/dashboard/ModelPerformanceSection'
import { PredictionSection } from '@/components/dashboard/PredictionSection'
import { AnalysisSection } from '@/components/dashboard/AnalysisSection'

type TabType = 'eda' | 'models' | 'prediction' | 'analysis'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('eda')

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'eda' && <EDASection />}
      {activeTab === 'models' && <ModelPerformanceSection />}
      {activeTab === 'prediction' && <PredictionSection />}
      {activeTab === 'analysis' && <AnalysisSection />}
    </DashboardLayout>
  )
}
