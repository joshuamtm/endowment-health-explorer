export interface ScenarioInputs {
  initialEndowment: number
  withdrawalRate: number
  expectedReturn: number
  returnVolatility: number
  inflationRate: number
  yearsToProject: number
  marketScenario: 'custom' | 'normal' | 'recession' | 'bull' | 'stagflation' | '2008-crisis' | '1990s-bull'
}

export interface ProjectionPoint {
  year: number
  balance: number
  withdrawal: number
  returns: number
  inflationAdjustedBalance: number
}

export interface MonteCarloResult {
  percentile5: number[]
  percentile25: number[]
  median: number[]
  percentile75: number[]
  percentile95: number[]
  probabilityOfDepletion: number
  yearsUntilDepletion: number | null
}

export interface Scenario {
  id: string
  name: string
  inputs: ScenarioInputs
  projections: ProjectionPoint[]
  monteCarloResults?: MonteCarloResult
  comments: string
  createdAt: Date
  updatedAt: Date
}

export interface AppState {
  scenarios: Scenario[]
  activeScenarioId: string | null
  compareMode: boolean
  comparedScenarioIds: string[]
  projectorMode: boolean
}

export interface PresetTemplate {
  name: string
  description: string
  inputs: Partial<ScenarioInputs>
}

export interface HistoricalMarketData {
  name: string
  period: string
  averageReturn: number
  volatility: number
  inflationRate: number
}