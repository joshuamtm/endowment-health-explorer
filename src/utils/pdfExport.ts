import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { Scenario } from '../types'

export async function exportToPDF(
  scenarios: Scenario[],
  chartElement: HTMLElement | null
): Promise<void> {
  const pdf = new jsPDF('landscape', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  
  pdf.setFontSize(20)
  pdf.text('Endowment Health Explorer Report', pageWidth / 2, 20, { align: 'center' })
  
  pdf.setFontSize(10)
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' })
  
  let yPosition = 40
  
  scenarios.forEach((scenario, index) => {
    if (index > 0) {
      pdf.addPage()
      yPosition = 20
    }
    
    pdf.setFontSize(16)
    pdf.text(scenario.name, 20, yPosition)
    yPosition += 10
    
    pdf.setFontSize(10)
    pdf.text('Parameters:', 20, yPosition)
    yPosition += 7
    
    const params = [
      `Initial Endowment: $${scenario.inputs.initialEndowment.toLocaleString()}`,
      `Withdrawal Rate: ${scenario.inputs.withdrawalRate}%`,
      `Expected Return: ${scenario.inputs.expectedReturn}%`,
      `Return Volatility: ${scenario.inputs.returnVolatility}%`,
      `Inflation Rate: ${scenario.inputs.inflationRate}%`,
      `Years to Project: ${scenario.inputs.yearsToProject}`,
      `Market Scenario: ${scenario.inputs.marketScenario}`
    ]
    
    params.forEach(param => {
      pdf.text(param, 25, yPosition)
      yPosition += 5
    })
    
    if (scenario.comments) {
      yPosition += 5
      pdf.text('Comments:', 20, yPosition)
      yPosition += 5
      const lines = pdf.splitTextToSize(scenario.comments, pageWidth - 40)
      pdf.text(lines, 25, yPosition)
      yPosition += lines.length * 5
    }
    
    if (scenario.monteCarloResults) {
      yPosition += 10
      pdf.text('Monte Carlo Analysis:', 20, yPosition)
      yPosition += 7
      pdf.text(`Probability of Depletion: ${(scenario.monteCarloResults.probabilityOfDepletion * 100).toFixed(1)}%`, 25, yPosition)
      yPosition += 5
      if (scenario.monteCarloResults.yearsUntilDepletion) {
        pdf.text(`Median Years Until Depletion: ${scenario.monteCarloResults.yearsUntilDepletion.toFixed(1)}`, 25, yPosition)
      }
    }
    
    const keyYears = [0, 5, 10, 15, 20, 25, 30].filter(y => y <= scenario.inputs.yearsToProject)
    if (keyYears.length > 0 && yPosition < pageHeight - 50) {
      yPosition += 10
      pdf.text('Key Projections:', 20, yPosition)
      yPosition += 7
      
      const headers = ['Year', 'Balance', 'Withdrawal', 'Inflation Adj.']
      const columnWidths = [20, 40, 40, 40]
      let xPos = 25
      
      pdf.setFontSize(9)
      headers.forEach((header, i) => {
        pdf.text(header, xPos, yPosition)
        xPos += columnWidths[i]
      })
      yPosition += 5
      
      keyYears.forEach(year => {
        const point = scenario.projections[year]
        if (point) {
          xPos = 25
          pdf.text(year.toString(), xPos, yPosition)
          xPos += columnWidths[0]
          pdf.text(`$${(point.balance / 1000000).toFixed(2)}M`, xPos, yPosition)
          xPos += columnWidths[1]
          pdf.text(`$${(point.withdrawal / 1000).toFixed(0)}K`, xPos, yPosition)
          xPos += columnWidths[2]
          pdf.text(`$${(point.inflationAdjustedBalance / 1000000).toFixed(2)}M`, xPos, yPosition)
          yPosition += 5
        }
      })
    }
  })
  
  if (chartElement) {
    try {
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        backgroundColor: '#1a1a1a'
      })
      pdf.addPage()
      const imgData = canvas.toDataURL('image/png')
      const imgWidth = pageWidth - 40
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, Math.min(imgHeight, pageHeight - 40))
    } catch (error) {
      console.error('Error capturing chart:', error)
    }
  }
  
  pdf.save(`endowment-report-${Date.now()}.pdf`)
}