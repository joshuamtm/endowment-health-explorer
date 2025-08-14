import type { ScenarioInputs, ProjectionPoint, MonteCarloResult } from '../types'
import * as ss from 'simple-statistics'

export function calculateProjections(inputs: ScenarioInputs): ProjectionPoint[] {
  const projections: ProjectionPoint[] = []
  let balance = inputs.initialEndowment
  
  for (let year = 0; year <= inputs.yearsToProject; year++) {
    const withdrawal = balance * (inputs.withdrawalRate / 100)
    const returns = balance * (inputs.expectedReturn / 100)
    const inflationAdjustedBalance = balance / Math.pow(1 + inputs.inflationRate / 100, year)
    
    projections.push({
      year,
      balance,
      withdrawal,
      returns,
      inflationAdjustedBalance
    })
    
    balance = balance - withdrawal + returns
    
    if (balance <= 0) {
      balance = 0
      break
    }
  }
  
  return projections
}

export function runMonteCarloSimulation(
  inputs: ScenarioInputs,
  numSimulations: number = 1000
): MonteCarloResult {
  const simulations: number[][] = []
  let depletionCount = 0
  const depletionYears: number[] = []
  
  for (let sim = 0; sim < numSimulations; sim++) {
    const scenario: number[] = []
    let balance = inputs.initialEndowment
    let depleted = false
    
    for (let year = 0; year <= inputs.yearsToProject; year++) {
      scenario.push(balance)
      
      if (balance <= 0) {
        if (!depleted) {
          depletionCount++
          depletionYears.push(year)
          depleted = true
        }
        balance = 0
        continue
      }
      
      const withdrawal = balance * (inputs.withdrawalRate / 100)
      const randomReturn = generateRandomReturn(inputs.expectedReturn, inputs.returnVolatility)
      const returns = balance * (randomReturn / 100)
      
      balance = balance - withdrawal + returns
    }
    
    simulations.push(scenario)
  }
  
  const percentiles = calculatePercentiles(simulations)
  
  return {
    percentile5: percentiles.p5,
    percentile25: percentiles.p25,
    median: percentiles.median,
    percentile75: percentiles.p75,
    percentile95: percentiles.p95,
    probabilityOfDepletion: depletionCount / numSimulations,
    yearsUntilDepletion: depletionYears.length > 0 
      ? ss.median(depletionYears)
      : null
  }
}

function generateRandomReturn(expectedReturn: number, volatility: number): number {
  const standardNormal = Math.sqrt(-2.0 * Math.log(Math.random())) * 
    Math.cos(2.0 * Math.PI * Math.random())
  return expectedReturn + volatility * standardNormal
}

function calculatePercentiles(simulations: number[][]) {
  const yearlyValues: number[][] = []
  
  for (let year = 0; year < simulations[0].length; year++) {
    const valuesAtYear = simulations.map(sim => sim[year] || 0)
    yearlyValues.push(valuesAtYear)
  }
  
  return {
    p5: yearlyValues.map(values => ss.quantile(values, 0.05)),
    p25: yearlyValues.map(values => ss.quantile(values, 0.25)),
    median: yearlyValues.map(values => ss.median(values)),
    p75: yearlyValues.map(values => ss.quantile(values, 0.75)),
    p95: yearlyValues.map(values => ss.quantile(values, 0.95))
  }
}

export function getMarketScenarioDefaults(scenario: string): Partial<ScenarioInputs> {
  const scenarios: Record<string, Partial<ScenarioInputs>> = {
    'normal': {
      expectedReturn: 7,
      returnVolatility: 15,
      inflationRate: 2.5
    },
    'recession': {
      expectedReturn: -5,
      returnVolatility: 25,
      inflationRate: 1
    },
    'bull': {
      expectedReturn: 12,
      returnVolatility: 12,
      inflationRate: 3
    },
    'stagflation': {
      expectedReturn: 3,
      returnVolatility: 20,
      inflationRate: 7
    },
    '2008-crisis': {
      expectedReturn: -15,
      returnVolatility: 40,
      inflationRate: 0.5
    },
    '1990s-bull': {
      expectedReturn: 18,
      returnVolatility: 10,
      inflationRate: 3
    },
    'custom': {}
  }
  
  return scenarios[scenario] || {}
}