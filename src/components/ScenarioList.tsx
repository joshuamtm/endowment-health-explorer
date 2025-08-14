import React from 'react'
import type { Scenario } from '../types'

interface ScenarioListProps {
  scenarios: Scenario[]
  activeScenarioId: string | null
  comparedScenarioIds: string[]
  compareMode: boolean
  onSelectScenario: (id: string) => void
  onDeleteScenario: (id: string) => void
  onToggleComparison: (id: string) => void
}

const ScenarioList: React.FC<ScenarioListProps> = ({
  scenarios,
  activeScenarioId,
  comparedScenarioIds,
  compareMode,
  onSelectScenario,
  onDeleteScenario,
  onToggleComparison
}) => {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }
  
  return (
    <div className="scenario-list">
      <h3>Saved Scenarios</h3>
      {scenarios.length === 0 ? (
        <p className="empty-message">No scenarios saved yet</p>
      ) : (
        <div className="scenario-items">
          {scenarios.map(scenario => {
            const finalBalance = scenario.projections[scenario.projections.length - 1]?.balance || 0
            const isActive = scenario.id === activeScenarioId
            const isCompared = comparedScenarioIds.includes(scenario.id)
            
            return (
              <div 
                key={scenario.id}
                className={`scenario-item ${isActive ? 'active' : ''} ${isCompared ? 'compared' : ''}`}
              >
                <div className="scenario-header" onClick={() => onSelectScenario(scenario.id)}>
                  <h4>{scenario.name}</h4>
                  <span className="scenario-date">
                    {new Date(scenario.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="scenario-summary">
                  <div className="summary-stat">
                    <span className="label">Initial:</span>
                    <span className="value">{formatCurrency(scenario.inputs.initialEndowment)}</span>
                  </div>
                  <div className="summary-stat">
                    <span className="label">Final:</span>
                    <span className={`value ${finalBalance === 0 ? 'depleted' : ''}`}>
                      {formatCurrency(finalBalance)}
                    </span>
                  </div>
                  <div className="summary-stat">
                    <span className="label">Withdrawal:</span>
                    <span className="value">{scenario.inputs.withdrawalRate}%</span>
                  </div>
                </div>
                <div className="scenario-actions">
                  {compareMode && (
                    <label className="compare-checkbox">
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => onToggleComparison(scenario.id)}
                      />
                      Compare
                    </label>
                  )}
                  <button 
                    className="btn-delete"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confirm(`Delete scenario "${scenario.name}"?`)) {
                        onDeleteScenario(scenario.id)
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ScenarioList