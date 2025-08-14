import React, { useState, useEffect, useRef } from 'react'
import type { Scenario, ScenarioInputs } from '../types'
import { presetTemplates } from '../utils/presets'
import { calculateProjections, getMarketScenarioDefaults } from '../utils/financial'
import { importFromCSV, importFromExcel } from '../utils/fileHandlers'

interface ScenarioInputPanelProps {
  onCreateScenario: (scenario: Scenario) => void
  activeScenario?: Scenario
  onUpdateScenario?: (updates: Partial<Scenario>) => void
}

const ScenarioInputPanel: React.FC<ScenarioInputPanelProps> = ({
  onCreateScenario,
  activeScenario,
  onUpdateScenario
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [inputs, setInputs] = useState<ScenarioInputs>({
    initialEndowment: 10000000,
    withdrawalRate: 4,
    expectedReturn: 7,
    returnVolatility: 15,
    inflationRate: 2.5,
    yearsToProject: 30,
    marketScenario: 'normal'
  })
  
  const [scenarioName, setScenarioName] = useState('')
  const [comments, setComments] = useState('')
  
  useEffect(() => {
    if (activeScenario) {
      setInputs(activeScenario.inputs)
      setScenarioName(activeScenario.name)
      setComments(activeScenario.comments)
    }
  }, [activeScenario])
  
  const handleInputChange = (field: keyof ScenarioInputs, value: number | string) => {
    const newInputs = { ...inputs, [field]: value }
    
    if (field === 'marketScenario' && value !== 'custom') {
      const defaults = getMarketScenarioDefaults(value as string)
      Object.assign(newInputs, defaults)
    }
    
    setInputs(newInputs)
    
    if (activeScenario && onUpdateScenario) {
      const projections = calculateProjections(newInputs)
      onUpdateScenario({
        inputs: newInputs,
        projections,
        updatedAt: new Date()
      })
    }
  }
  
  const handlePresetSelect = (preset: typeof presetTemplates[0]) => {
    const newInputs = { ...inputs, ...preset.inputs }
    setInputs(newInputs)
    setScenarioName(preset.name)
    
    if (activeScenario && onUpdateScenario) {
      const projections = calculateProjections(newInputs)
      onUpdateScenario({
        name: preset.name,
        inputs: newInputs,
        projections,
        updatedAt: new Date()
      })
    }
  }
  
  const handleCreateScenario = () => {
    if (!scenarioName) {
      alert('Please enter a scenario name')
      return
    }
    
    const projections = calculateProjections(inputs)
    const scenario: Scenario = {
      id: Date.now().toString(),
      name: scenarioName,
      inputs,
      projections,
      comments,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    onCreateScenario(scenario)
    setScenarioName('')
    setComments('')
  }
  
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    try {
      let importedData: Partial<Scenario>
      
      if (file.name.endsWith('.csv')) {
        importedData = await importFromCSV(file)
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        importedData = await importFromExcel(file)
      } else {
        alert('Please select a CSV or Excel file')
        return
      }
      
      if (importedData.inputs) {
        setInputs(importedData.inputs as ScenarioInputs)
        setScenarioName(`Imported from ${file.name}`)
      }
    } catch (error) {
      alert('Error importing file: ' + error)
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  
  return (
    <div className="scenario-input-panel">
      <h2>Scenario Configuration</h2>
      
      <div className="input-section">
        <label>Scenario Name</label>
        <input
          type="text"
          value={scenarioName}
          onChange={(e) => setScenarioName(e.target.value)}
          placeholder="Enter scenario name..."
        />
      </div>
      
      <div className="input-section">
        <label>Import Data</label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileImport}
        />
      </div>
      
      <div className="input-section">
        <label>Preset Templates</label>
        <select onChange={(e) => {
          const preset = presetTemplates.find(p => p.name === e.target.value)
          if (preset) handlePresetSelect(preset)
        }}>
          <option value="">Select a preset...</option>
          {presetTemplates.map(preset => (
            <option key={preset.name} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="input-section">
        <label>Initial Endowment ($)</label>
        <input
          type="number"
          value={inputs.initialEndowment}
          onChange={(e) => handleInputChange('initialEndowment', parseFloat(e.target.value))}
          min="0"
          step="100000"
        />
      </div>
      
      <div className="input-section">
        <label>Withdrawal Rate: {inputs.withdrawalRate}%</label>
        <input
          type="range"
          value={inputs.withdrawalRate}
          onChange={(e) => handleInputChange('withdrawalRate', parseFloat(e.target.value))}
          min="0"
          max="10"
          step="0.1"
        />
      </div>
      
      <div className="input-section">
        <label>Expected Return: {inputs.expectedReturn}%</label>
        <input
          type="range"
          value={inputs.expectedReturn}
          onChange={(e) => handleInputChange('expectedReturn', parseFloat(e.target.value))}
          min="-20"
          max="20"
          step="0.5"
        />
      </div>
      
      <div className="input-section">
        <label>Return Volatility: {inputs.returnVolatility}%</label>
        <input
          type="range"
          value={inputs.returnVolatility}
          onChange={(e) => handleInputChange('returnVolatility', parseFloat(e.target.value))}
          min="0"
          max="50"
          step="1"
        />
      </div>
      
      <div className="input-section">
        <label>Inflation Rate: {inputs.inflationRate}%</label>
        <input
          type="range"
          value={inputs.inflationRate}
          onChange={(e) => handleInputChange('inflationRate', parseFloat(e.target.value))}
          min="0"
          max="10"
          step="0.1"
        />
      </div>
      
      <div className="input-section">
        <label>Years to Project: {inputs.yearsToProject}</label>
        <input
          type="range"
          value={inputs.yearsToProject}
          onChange={(e) => handleInputChange('yearsToProject', parseInt(e.target.value))}
          min="5"
          max="100"
          step="5"
        />
      </div>
      
      <div className="input-section">
        <label>Market Scenario</label>
        <select 
          value={inputs.marketScenario}
          onChange={(e) => handleInputChange('marketScenario', e.target.value)}
        >
          <option value="custom">Custom</option>
          <option value="normal">Normal Market</option>
          <option value="recession">Recession</option>
          <option value="bull">Bull Market</option>
          <option value="stagflation">Stagflation</option>
          <option value="2008-crisis">2008 Financial Crisis</option>
          <option value="1990s-bull">1990s Bull Market</option>
        </select>
      </div>
      
      <div className="input-section">
        <label>Comments/Annotations</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Add notes about this scenario..."
          rows={3}
        />
      </div>
      
      {!activeScenario && (
        <button 
          className="btn-primary create-scenario"
          onClick={handleCreateScenario}
        >
          Create Scenario
        </button>
      )}
    </div>
  )
}

export default ScenarioInputPanel