import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts'
import type { Scenario } from '../types'

interface ChartDisplayProps {
  scenario: Scenario
  showMonteCarlo: boolean
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({ scenario, showMonteCarlo }) => {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toFixed(0)}`
  }
  
  const chartData = scenario.projections.map(point => ({
    year: point.year,
    balance: point.balance,
    inflationAdjusted: point.inflationAdjustedBalance,
    withdrawal: point.withdrawal,
    returns: point.returns
  }))
  
  const monteCarloData = scenario.monteCarloResults ? 
    scenario.projections.map((point, index) => ({
      year: point.year,
      p5: scenario.monteCarloResults!.percentile5[index],
      p25: scenario.monteCarloResults!.percentile25[index],
      median: scenario.monteCarloResults!.median[index],
      p75: scenario.monteCarloResults!.percentile75[index],
      p95: scenario.monteCarloResults!.percentile95[index],
      actual: point.balance
    })) : []
  
  return (
    <div className="chart-display">
      <h2>{scenario.name}</h2>
      
      {showMonteCarlo && scenario.monteCarloResults ? (
        <div className="chart-container">
          <h3>Monte Carlo Simulation Results</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={monteCarloData}>
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
              <Area
                type="monotone"
                dataKey="p95"
                stackId="1"
                stroke="none"
                fill="#2d4a2b"
                fillOpacity={0.4}
                name="95th Percentile"
              />
              <Area
                type="monotone"
                dataKey="p75"
                stackId="2"
                stroke="none"
                fill="#3d5a3b"
                fillOpacity={0.5}
                name="75th Percentile"
              />
              <Area
                type="monotone"
                dataKey="median"
                stackId="3"
                stroke="none"
                fill="#4d6a4b"
                fillOpacity={0.6}
                name="Median"
              />
              <Area
                type="monotone"
                dataKey="p25"
                stackId="4"
                stroke="none"
                fill="#5d7a5b"
                fillOpacity={0.5}
                name="25th Percentile"
              />
              <Area
                type="monotone"
                dataKey="p5"
                stackId="5"
                stroke="none"
                fill="#6d8a6b"
                fillOpacity={0.4}
                name="5th Percentile"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#00ff00"
                strokeWidth={2}
                dot={false}
                name="Expected"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="chart-container">
          <h3>Balance Projection</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
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
              <Area
                type="monotone"
                dataKey="balance"
                fill="#2d4a2b"
                fillOpacity={0.3}
                stroke="#00ff00"
                strokeWidth={2}
                name="Nominal Balance"
              />
              <Line
                type="monotone"
                dataKey="inflationAdjusted"
                stroke="#ff9900"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Inflation Adjusted"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <div className="chart-container">
        <h3>Cash Flows</h3>
        <ResponsiveContainer width="100%" height={300}>
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
              label={{ value: 'Amount', angle: -90, position: 'insideLeft', style: { fill: '#888' } }}
            />
            <Tooltip 
              formatter={formatCurrency}
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              labelStyle={{ color: '#888' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="withdrawal"
              stroke="#ff4444"
              strokeWidth={2}
              dot={false}
              name="Annual Withdrawal"
            />
            <Line
              type="monotone"
              dataKey="returns"
              stroke="#44ff44"
              strokeWidth={2}
              dot={false}
              name="Investment Returns"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {scenario.comments && (
        <div className="scenario-comments">
          <h4>Notes:</h4>
          <p>{scenario.comments}</p>
        </div>
      )}
    </div>
  )
}

export default ChartDisplay