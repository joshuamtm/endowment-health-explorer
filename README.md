# 📊 Endowment Health Explorer

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://endowment-health-explorer.netlify.app)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)

A sophisticated financial projection tool that enables non-profit boards to visualize and stress-test their endowment's health under various withdrawal rates and market scenarios. Built with a Bloomberg Terminal-inspired interface for professional presentations.

![Endowment Health Explorer Screenshot](https://via.placeholder.com/1200x600/0a0a0a/00ff00?text=Endowment+Health+Explorer)

## 🎯 Purpose

Non-profit boards need to make informed decisions about sustainable withdrawal rates from their endowments while considering various market conditions. This tool provides an interactive, visual platform to explore "what-if" scenarios during board meetings, making it easier to understand the long-term impact of financial decisions on organizational sustainability.

## ✨ Key Features

### 📈 Dynamic Financial Projections
- Real-time balance calculations with adjustable parameters
- Withdrawal rate slider (0-10%)
- Expected return and volatility controls
- Inflation rate adjustments
- Customizable projection timeframes (5-100 years)

### 🎲 Monte Carlo Simulations
- 1,000-iteration probabilistic modeling
- Percentile distributions (5th, 25th, median, 75th, 95th)
- Depletion probability calculations
- Visual confidence bands on charts

### 💼 Scenario Management
- Create and save unlimited scenarios
- Compare multiple scenarios side-by-side
- Add annotations and comments
- Track creation and modification dates

### 📁 Import/Export Capabilities
- **CSV Import/Export** - Standard spreadsheet format
- **Excel Import/Export** - Native .xlsx support
- **PDF Reports** - Board-ready documents with charts
- Batch export for multiple scenarios

### 🎨 Professional Presentation
- **Bloomberg Terminal Aesthetic** - Dark theme with high contrast
- **Projector Mode** - Enlarged display for board rooms
- **Print-Friendly** - Automatic styling for printed reports
- Responsive design for all devices

### 📚 Preset Templates
Built-in templates for common endowment strategies:
- **Standard 4% Rule** - Traditional endowment spending
- **Conservative 3% Model** - Enhanced sustainability focus
- **University Endowment Model** - 5% spending policy
- **Foundation Payout Minimum** - IRS 5% requirement
- **Aggressive Growth** - Higher risk/return profile
- **Perpetual Preservation** - Ultra-conservative approach

### 📉 Historical Market Scenarios
Pre-configured market conditions:
- Normal Market (7% return, 15% volatility)
- Recession (-5% return, 25% volatility)
- Bull Market (12% return, 12% volatility)
- Stagflation (3% return, 20% volatility)
- 2008 Financial Crisis (-15% return, 40% volatility)
- 1990s Bull Market (18% return, 10% volatility)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/joshuamtm/endowment-health-explorer.git
cd endowment-health-explorer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## 💻 Technology Stack

- **Frontend Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 7.1
- **Charts**: Recharts for data visualization
- **Statistical Analysis**: Simple Statistics library
- **File Processing**: Papa Parse (CSV), XLSX (Excel)
- **PDF Generation**: jsPDF with html2canvas
- **Styling**: Custom CSS with Bloomberg Terminal aesthetic
- **Deployment**: Netlify

## 📖 Usage Guide

### Creating Your First Scenario

1. **Set Initial Parameters**
   - Enter your endowment's current value
   - Select a preset template or customize parameters
   - Adjust withdrawal rate, expected returns, and time horizon

2. **Run Analysis**
   - Click "Create Scenario" to generate projections
   - Run Monte Carlo simulation for probability analysis
   - Add comments and annotations

3. **Compare Scenarios**
   - Toggle "Compare Mode"
   - Select multiple scenarios to view side-by-side
   - Analyze differences in outcomes

4. **Export Results**
   - Generate PDF report for board presentations
   - Export data to Excel for further analysis
   - Save scenarios for future reference

### Advanced Features

#### Importing Existing Data
Upload CSV or Excel files with your current endowment data. The tool will automatically parse and populate the input fields.

#### Projector Mode
Enable Projector Mode for enhanced visibility during board presentations. This increases font sizes and contrast for better readability.

#### Custom Market Scenarios
Create custom market conditions by adjusting:
- Expected annual return (-20% to +20%)
- Return volatility (0% to 50%)
- Inflation rate (0% to 10%)

## 📊 Understanding the Charts

### Balance Projection Chart
- **Green Line**: Nominal balance over time
- **Orange Dashed Line**: Inflation-adjusted balance
- **Shaded Area**: Monte Carlo confidence bands (when enabled)

### Cash Flow Chart
- **Red Line**: Annual withdrawals
- **Green Line**: Investment returns
- Shows the relationship between distributions and growth

### Comparison View
- Multiple scenarios overlaid on single chart
- Color-coded for easy differentiation
- Synchronized time axes for direct comparison

## 🎯 Use Cases

### Board Meeting Presentations
- Real-time scenario exploration during discussions
- Immediate answers to "what-if" questions
- Professional visualizations for minutes and reports

### Strategic Planning
- Long-term sustainability analysis
- Risk assessment under various market conditions
- Optimal withdrawal rate determination

### Donor Communications
- Demonstrate fiduciary responsibility
- Show impact of different giving levels
- Illustrate endowment sustainability

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Bloomberg Terminal's professional financial interface
- Built for non-profit organizations seeking sustainable endowment management
- Statistical methods based on modern portfolio theory

## 📧 Contact

For questions, suggestions, or support:
- Create an issue on GitHub
- Visit the [live demo](https://endowment-health-explorer.netlify.app)

## 🔮 Roadmap

- [ ] Multi-user collaboration features
- [ ] Historical performance tracking
- [ ] Integration with financial data APIs
- [ ] Custom reporting templates
- [ ] Mobile app version
- [ ] AI-powered scenario recommendations

---

**Built with ❤️ for the non-profit sector**