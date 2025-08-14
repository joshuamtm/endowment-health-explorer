import { useState } from 'react'
import './App.css'
import Dashboard from './components/Dashboard'
import type { Scenario, AppState } from './types'

function App() {
  const [appState, setAppState] = useState<AppState>({
    scenarios: [],
    activeScenarioId: null,
    compareMode: false,
    comparedScenarioIds: [],
    projectorMode: false
  })

  const addScenario = (scenario: Scenario) => {
    setAppState(prev => ({
      ...prev,
      scenarios: [...prev.scenarios, scenario],
      activeScenarioId: scenario.id
    }))
  }

  const updateScenario = (id: string, updates: Partial<Scenario>) => {
    setAppState(prev => ({
      ...prev,
      scenarios: prev.scenarios.map(s => 
        s.id === id ? { ...s, ...updates } : s
      )
    }))
  }

  const deleteScenario = (id: string) => {
    setAppState(prev => ({
      ...prev,
      scenarios: prev.scenarios.filter(s => s.id !== id),
      activeScenarioId: prev.activeScenarioId === id ? null : prev.activeScenarioId
    }))
  }

  const toggleCompareMode = () => {
    setAppState(prev => ({
      ...prev,
      compareMode: !prev.compareMode,
      comparedScenarioIds: []
    }))
  }

  const toggleScenarioComparison = (id: string) => {
    setAppState(prev => {
      const isCompared = prev.comparedScenarioIds.includes(id)
      return {
        ...prev,
        comparedScenarioIds: isCompared
          ? prev.comparedScenarioIds.filter(sid => sid !== id)
          : [...prev.comparedScenarioIds, id]
      }
    })
  }

  const toggleProjectorMode = () => {
    setAppState(prev => ({
      ...prev,
      projectorMode: !prev.projectorMode
    }))
  }

  return (
    <div className={`app ${appState.projectorMode ? 'projector-mode' : ''}`}>
      <Dashboard
        appState={appState}
        onAddScenario={addScenario}
        onUpdateScenario={updateScenario}
        onDeleteScenario={deleteScenario}
        onToggleCompareMode={toggleCompareMode}
        onToggleScenarioComparison={toggleScenarioComparison}
        onToggleProjectorMode={toggleProjectorMode}
        onSetActiveScenario={(id) => setAppState(prev => ({ ...prev, activeScenarioId: id }))}
      />
    </div>
  )
}

export default App
