import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import type { Scenario } from '../types'

interface ComparisonViewProps {
  scenarios: Scenario[]
}

const colors = ['#00ff00', '#ff9900', '#00ffff', '#ff00ff', '#ffff00', '#ff4444', '#4444ff']

const ComparisonView: React.FC<ComparisonViewProps> = ({ scenarios }) => {
  const maxYears = Math.max(...scenarios.map(s => s.inputs.yearsToProject))
  const years = Array.from({ length: maxYears + 1 }, (_, i) => i)
  
  const chartData = years.map(year => {
    const dataPoint: any = { year }
    scenarios.forEach(scenario => {
      const projection = scenario.projections.find(p => p.year === year)
      dataPoint[scenario.name] = projection ? projection.balance : null
      dataPoint[`${scenario.name}_inflationAdjusted`] = projection ? projection.inflationAdjustedBalance : null
    })
    return dataPoint
  })
  
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toFixed(0)}`
  }
  
  return (
    <div className="comparison-view">
      <h2>Scenario Comparison</h2>
      
      <div className="comparison-table">
        <table>
          <thead>
            <tr>
              <th>Scenario</th>
              <th>Initial</th>
              <th>Withdrawal %</th>
              <th>Return %</th>
              <th>Final Balance</th>
              <th>Depletion Risk</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario, index) => {
              const finalBalance = scenario.projections[scenario.projections.length - 1]?.balance || 0
              const depletionRisk = scenario.monteCarloResults?.probabilityOfDepletion || 0
              
              return (
                <tr key={scenario.id}>
                  <td>
                    <span 
                      className="color-indicator" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    {scenario.name}
                  </td>
                  <td>{formatCurrency(scenario.inputs.initialEndowment)}</td>
                  <td>{scenario.inputs.withdrawalRate}%</td>
                  <td>{scenario.inputs.expectedReturn}%</td>
                  <td className={finalBalance === 0 ? 'depleted' : ''}>
                    {formatCurrency(finalBalance)}
                  </td>
                  <td className={depletionRisk > 0.2 ? 'high-risk' : ''}>
                    {scenario.monteCarloResults ? `${(depletionRisk * 100).toFixed(1)}%` : 'N/A'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      <div className="chart-container">
        <h3>Balance Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="year" 
              stroke="#888"
              label={{ value: 'Year', position: 'insideBottom', offset: -5, style: { fill: '#888' } }}
            />
            <YAxis 
              stroke="#888"
              tickFormatter={formatCurrency}
              label={{ value: 'Balance', angle: -90, position: 'insideLeft', style: { fill: '#888' } }}
            />
            <Tooltip 
              formatter={formatCurrency}
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              labelStyle={{ color: '#888' }}
            />
            <Legend />
            {scenarios.map((scenario, index) => (
              <Line
                key={scenario.id}
                type="monotone"
                dataKey={scenario.name}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-container">
        <h3>Inflation-Adjusted Balance Comparison</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="year" 
              stroke="#888"
              label={{ value: 'Year', position: 'insideBottom', offset: -5, style: { fill: '#888' } }}
            />
            <YAxis 
              stroke="#888"
              tickFormatter={formatCurrency}
              label={{ value: 'Inflation-Adjusted Balance', angle: -90, position: 'insideLeft', style: { fill: '#888' } }}
            />
            <Tooltip 
              formatter={formatCurrency}
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              labelStyle={{ color: '#888' }}
            />
            <Legend />
            {scenarios.map((scenario, index) => (
              <Line
                key={`${scenario.id}_inflation`}
                type="monotone"
                dataKey={`${scenario.name}_inflationAdjusted`}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                connectNulls
                name={`${scenario.name} (Inflation Adj.)`}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ComparisonView