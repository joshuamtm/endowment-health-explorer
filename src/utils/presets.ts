import type { PresetTemplate } from '../types'

export const presetTemplates: PresetTemplate[] = [
  {
    name: 'Standard 4% Rule',
    description: 'Traditional endowment spending rule with 4% annual withdrawal',
    inputs: {
      withdrawalRate: 4,
      expectedReturn: 7,
      returnVolatility: 15,
      inflationRate: 2.5,
      yearsToProject: 30
    }
  },
  {
    name: 'Conservative 3% Model',
    description: 'Lower withdrawal rate for enhanced sustainability',
    inputs: {
      withdrawalRate: 3,
      expectedReturn: 6,
      returnVolatility: 12,
      inflationRate: 2.5,
      yearsToProject: 50
    }
  },
  {
    name: 'University Endowment Model',
    description: 'Typical university endowment with 5% spending policy',
    inputs: {
      withdrawalRate: 5,
      expectedReturn: 8,
      returnVolatility: 16,
      inflationRate: 3,
      yearsToProject: 40
    }
  },
  {
    name: 'Foundation Payout Minimum',
    description: 'IRS minimum 5% distribution requirement for private foundations',
    inputs: {
      withdrawalRate: 5,
      expectedReturn: 7.5,
      returnVolatility: 14,
      inflationRate: 2.5,
      yearsToProject: 30
    }
  },
  {
    name: 'Aggressive Growth',
    description: 'Higher risk/return profile with lower withdrawal',
    inputs: {
      withdrawalRate: 3.5,
      expectedReturn: 10,
      returnVolatility: 20,
      inflationRate: 3,
      yearsToProject: 30
    }
  },
  {
    name: 'Perpetual Preservation',
    description: 'Ultra-conservative approach for perpetual capital preservation',
    inputs: {
      withdrawalRate: 2.5,
      expectedReturn: 5,
      returnVolatility: 10,
      inflationRate: 2,
      yearsToProject: 100
    }
  }
]