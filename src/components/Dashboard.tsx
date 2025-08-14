import React, { useState, useRef } from 'react'
import type { AppState, Scenario } from '../types'
import ScenarioInputPanel from './ScenarioInputPanel'
import ChartDisplay from './ChartDisplay'
import ScenarioList from './ScenarioList'
import ComparisonView from './ComparisonView'
import { exportToCSV, exportToExcel } from '../utils/fileHandlers'
import { exportToPDF } from '../utils/pdfExport'
import { runMonteCarloSimulation } from '../utils/financial'

interface DashboardProps {
  appState: AppState
  onAddScenario: (scenario: Scenario) => void
  onUpdateScenario: (id: string, updates: Partial<Scenario>) => void
  onDeleteScenario: (id: string) => void
  onToggleCompareMode: () => void
  onToggleScenarioComparison: (id: string) => void
  onToggleProjectorMode: () => void
  onSetActiveScenario: (id: string) => void
}

const Dashboard: React.FC<DashboardProps> = ({
  appState,
  onAddScenario,
  onUpdateScenario,
  onDeleteScenario,
  onToggleCompareMode,
  onToggleScenarioComparison,
  onToggleProjectorMode,
  onSetActiveScenario
}) => {
  const [runningMonteCarlo, setRunningMonteCarlo] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)
  
  const activeScenario = appState.scenarios.find(s => s.id === appState.activeScenarioId)
  const comparedScenarios = appState.scenarios.filter(s => 
    appState.comparedScenarioIds.includes(s.id)
  )
  
  const handleRunMonteCarlo = async () => {
    if (!activeScenario) return
    
    setRunningMonteCarlo(true)
    setTimeout(() => {
      const results = runMonteCarloSimulation(activeScenario.inputs)
      onUpdateScenario(activeScenario.id, { monteCarloResults: results })
      setRunningMonteCarlo(false)
    }, 100)
  }
  
  const handleExportPDF = async () => {
    const scenariosToExport = appState.compareMode && comparedScenarios.length > 0
      ? comparedScenarios
      : activeScenario ? [activeScenario] : []
    
    if (scenariosToExport.length > 0) {
      await exportToPDF(scenariosToExport, chartRef.current)
    }
  }
  
  const handleExportCSV = () => {
    const scenariosToExport = appState.compareMode && comparedScenarios.length > 0
      ? comparedScenarios
      : activeScenario ? [activeScenario] : []
    
    if (scenariosToExport.length > 0) {
      exportToCSV(scenariosToExport)
    }
  }
  
  const handleExportExcel = () => {
    const scenariosToExport = appState.compareMode && comparedScenarios.length > 0
      ? comparedScenarios
      : activeScenario ? [activeScenario] : []
    
    if (scenariosToExport.length > 0) {
      exportToExcel(scenariosToExport)
    }
  }
  
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Endowment Health Explorer</h1>
          <p>Dynamic Financial Projection Tool</p>
        </div>
        <div className="header-controls">
          <button 
            className={`btn-mode ${appState.compareMode ? 'active' : ''}`}
            onClick={onToggleCompareMode}
          >
            Compare Mode
          </button>
          <button 
            className={`btn-mode ${appState.projectorMode ? 'active' : ''}`}
            onClick={onToggleProjectorMode}
          >
            Projector Mode
          </button>
          <div className="export-controls">
            <button onClick={handleExportPDF} className="btn-export">
              Export PDF
            </button>
            <button onClick={handleExportCSV} className="btn-export">
              Export CSV
            </button>
            <button onClick={handleExportExcel} className="btn-export">
              Export Excel
            </button>
          </div>
        </div>
      </header>
      
      <div className="dashboard-content">
        <div className="sidebar">
          <ScenarioInputPanel
            onCreateScenario={onAddScenario}
            activeScenario={activeScenario}
            onUpdateScenario={activeScenario ? 
              (updates) => onUpdateScenario(activeScenario.id, updates) : undefined
            }
          />
          <ScenarioList
            scenarios={appState.scenarios}
            activeScenarioId={appState.activeScenarioId}
            comparedScenarioIds={appState.comparedScenarioIds}
            compareMode={appState.compareMode}
            onSelectScenario={onSetActiveScenario}
            onDeleteScenario={onDeleteScenario}
            onToggleComparison={onToggleScenarioComparison}
          />
        </div>
        
        <div className="main-content" ref={chartRef}>
          {appState.compareMode && comparedScenarios.length > 0 ? (
            <ComparisonView scenarios={comparedScenarios} />
          ) : activeScenario ? (
            <>
              <ChartDisplay 
                scenario={activeScenario}
                showMonteCarlo={!!activeScenario.monteCarloResults}
              />
              <div className="analysis-controls">
                <button 
                  onClick={handleRunMonteCarlo}
                  disabled={runningMonteCarlo}
                  className="btn-primary"
                >
                  {runningMonteCarlo ? 'Running...' : 'Run Monte Carlo Simulation'}
                </button>
                {activeScenario.monteCarloResults && (
                  <div className="monte-carlo-summary">
                    <div className="stat">
                      <label>Probability of Depletion:</label>
                      <span className={activeScenario.monteCarloResults.probabilityOfDepletion > 0.2 ? 'warning' : ''}>
                        {(activeScenario.monteCarloResults.probabilityOfDepletion * 100).toFixed(1)}%
                      </span>
                    </div>
                    {activeScenario.monteCarloResults.yearsUntilDepletion && (
                      <div className="stat">
                        <label>Median Years Until Depletion:</label>
                        <span>{activeScenario.monteCarloResults.yearsUntilDepletion.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <h2>Welcome to Endowment Health Explorer</h2>
              <p>Create a new scenario or load existing data to begin analyzing your endowment's health.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard