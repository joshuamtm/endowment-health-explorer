import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import type { Scenario } from '../types'

export function exportToCSV(scenarios: Scenario[]): void {
  const data = scenarios.flatMap(scenario => 
    scenario.projections.map(point => ({
      'Scenario': scenario.name,
      'Year': point.year,
      'Balance': point.balance.toFixed(2),
      'Withdrawal': point.withdrawal.toFixed(2),
      'Returns': point.returns.toFixed(2),
      'Inflation Adjusted Balance': point.inflationAdjustedBalance.toFixed(2),
      'Withdrawal Rate': scenario.inputs.withdrawalRate,
      'Expected Return': scenario.inputs.expectedReturn,
      'Comments': scenario.comments
    }))
  )
  
  const csv = Papa.unparse(data)
  downloadFile(csv, `endowment-projections-${Date.now()}.csv`, 'text/csv')
}

export function exportToExcel(scenarios: Scenario[]): void {
  const wb = XLSX.utils.book_new()
  
  scenarios.forEach(scenario => {
    const wsData = [
      ['Endowment Health Explorer - ' + scenario.name],
      [],
      ['Parameters:'],
      ['Initial Endowment', scenario.inputs.initialEndowment],
      ['Withdrawal Rate (%)', scenario.inputs.withdrawalRate],
      ['Expected Return (%)', scenario.inputs.expectedReturn],
      ['Return Volatility (%)', scenario.inputs.returnVolatility],
      ['Inflation Rate (%)', scenario.inputs.inflationRate],
      ['Years to Project', scenario.inputs.yearsToProject],
      ['Comments', scenario.comments],
      [],
      ['Year', 'Balance', 'Withdrawal', 'Returns', 'Inflation Adjusted Balance']
    ]
    
    scenario.projections.forEach(point => {
      wsData.push([
        point.year,
        point.balance,
        point.withdrawal,
        point.returns,
        point.inflationAdjustedBalance
      ])
    })
    
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, scenario.name.slice(0, 31))
  })
  
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `endowment-projections-${Date.now()}.xlsx`
  link.click()
  URL.revokeObjectURL(url)
}

export async function importFromCSV(file: File): Promise<Partial<Scenario>> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const firstRow = results.data[0] as any
          resolve({
            inputs: {
              initialEndowment: parseFloat(firstRow['Initial Endowment'] || '1000000'),
              withdrawalRate: parseFloat(firstRow['Withdrawal Rate'] || '4'),
              expectedReturn: parseFloat(firstRow['Expected Return'] || '7'),
              returnVolatility: parseFloat(firstRow['Return Volatility'] || '15'),
              inflationRate: parseFloat(firstRow['Inflation Rate'] || '2.5'),
              yearsToProject: parseInt(firstRow['Years to Project'] || '30'),
              marketScenario: 'custom'
            }
          })
        } else {
          reject(new Error('No data found in CSV'))
        }
      },
      error: (error) => reject(error)
    })
  })
}

export async function importFromExcel(file: File): Promise<Partial<Scenario>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][]
        
        const params: any = {}
        jsonData.forEach(row => {
          if (row[0] === 'Initial Endowment') params.initialEndowment = row[1]
          if (row[0] === 'Withdrawal Rate (%)') params.withdrawalRate = row[1]
          if (row[0] === 'Expected Return (%)') params.expectedReturn = row[1]
          if (row[0] === 'Return Volatility (%)') params.returnVolatility = row[1]
          if (row[0] === 'Inflation Rate (%)') params.inflationRate = row[1]
          if (row[0] === 'Years to Project') params.yearsToProject = row[1]
        })
        
        resolve({
          inputs: {
            ...params,
            marketScenario: 'custom'
          }
        })
      } catch (error) {
        reject(error)
      }
    }
    reader.readAsArrayBuffer(file)
  })
}

function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}