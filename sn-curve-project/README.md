# S-N Curve: Fatigue Analysis Project

An interactive web application for visualizing and understanding S-N curves (Stress-Number of cycles curves) used in fatigue analysis of materials.

## 🎯 Project Overview

This project provides an educational and interactive platform for understanding fatigue failure in materials through S-N curves. It demonstrates the relationship between stress amplitude and the number of cycles until failure, helping users grasp key concepts in materials science and mechanical engineering.

## ✨ Features

### 📊 Interactive S-N Curve Visualization
- **Real-time Chart Updates**: Dynamic S-N curves that update based on material selection
- **Multiple Materials**: Compare fatigue behavior of Steel, Aluminum, Titanium, and Composite materials
- **Interactive Stress Point**: Click and drag to explore different stress levels and their corresponding fatigue lives
- **Endurance Limit Visualization**: Clear indication of endurance limits for materials that exhibit them

### 📚 Educational Content
- **Fatigue Strength**: Explanation of maximum stress amplitude for specified cycles
- **Fatigue Life**: Understanding of cycles to failure for given stress levels
- **Endurance Limit**: Definition and significance of infinite life stress levels
- **Fatigue Regions**: Classification into Low, High, and Very High Cycle Fatigue

### 🧮 Fatigue Calculator
- **Material Selection**: Choose from different material types
- **Stress Input**: Enter stress amplitude and mean stress values
- **Mean Stress Correction**: Goodman relationship implementation
- **Safety Factor Calculation**: Automatic computation of design safety margins
- **Comprehensive Results**: Detailed output including expected fatigue life and region classification

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Tabbed Interface**: Organized content with easy navigation
- **Interactive Controls**: Sliders, dropdowns, and real-time updates
- **Visual Feedback**: Hover effects, animations, and color-coded information

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start exploring the interactive S-N curves!

### File Structure
```
sn-curve-project/
├── index.html          # Main HTML file
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality and calculations
└── README.md           # Project documentation
```

## 📖 How to Use

### 1. Interactive S-N Curve Tab
- **Select Material**: Choose from the dropdown menu to view different material curves
- **Adjust Stress**: Use the slider to explore different stress levels
- **View Analysis**: See real-time calculations of expected cycles and fatigue region
- **Click on Chart**: Click anywhere on the chart to set the stress point to that location

### 2. Key Concepts Tab
- **Read Explanations**: Learn about fatigue strength, fatigue life, and endurance limit
- **Understand Regions**: Explore the different fatigue regions and their characteristics
- **Review Factors**: Study the various factors that affect fatigue life

### 3. Fatigue Calculator Tab
- **Enter Parameters**: Input stress amplitude, select material, and specify mean stress
- **Calculate Results**: Click the calculate button to get comprehensive fatigue analysis
- **Review Output**: Examine fatigue life, safety factors, and material properties

## 🔬 Technical Details

### S-N Curve Mathematics
The application uses logarithmic interpolation to calculate fatigue life:
- **Log-Log Relationship**: S-N curves follow a logarithmic relationship between stress and cycles
- **Linear Interpolation**: Points between known data are calculated using linear interpolation in log space
- **Extrapolation**: Values outside the curve range use power law relationships

### Material Properties
Each material includes:
- **Endurance Limit**: Stress level for infinite life (if applicable)
- **Fatigue Strength**: Stress at 10⁶ cycles
- **Ultimate Strength**: Maximum tensile strength
- **S-N Curve Data**: Multiple stress-cycle data points

### Mean Stress Correction
The calculator implements the Goodman relationship:
```
σ_corrected = σ_amplitude / (1 - σ_mean / σ_ultimate)
```

## 🎓 Educational Value

This project serves as an excellent learning tool for:
- **Materials Science Students**: Understanding fatigue behavior
- **Mechanical Engineers**: Practical fatigue analysis applications
- **Engineering Educators**: Interactive teaching aid for fatigue concepts
- **Industry Professionals**: Quick reference for material selection

## 🔧 Customization

### Adding New Materials
To add a new material, modify the `materialData` object in `script.js`:

```javascript
newMaterial: {
    name: "Material Name",
    enduranceLimit: 300, // MPa (null if no endurance limit)
    fatigueStrength: 450, // MPa at 10^6 cycles
    ultimateStrength: 700, // MPa
    color: '#HEXCODE',
    snCurve: [
        { stress: 700, cycles: 1000 },
        // Add more data points...
    ]
}
```

### Modifying Calculations
- **Fatigue Life Calculation**: Modify `calculateExpectedCycles()` function
- **Safety Factor**: Adjust `calculateSafetyFactor()` function
- **Mean Stress Correction**: Update the Goodman relationship implementation

## 🌟 Key Learning Outcomes

After using this application, users will understand:

1. **S-N Curve Interpretation**: How to read and interpret fatigue curves
2. **Material Differences**: How different materials behave under cyclic loading
3. **Fatigue Life Prediction**: Methods for estimating component life
4. **Design Considerations**: How to use fatigue data in engineering design
5. **Safety Factors**: Importance of safety margins in fatigue design

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional material databases
- More advanced fatigue models (Morrow, Walker, etc.)
- Statistical analysis features
- Export functionality for reports
- 3D visualization of fatigue surfaces

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Chart.js for the interactive charting library
- Materials science community for fatigue data
- Engineering educators for concept validation

---

**Note**: This application is for educational purposes. For actual engineering design, always consult appropriate standards, codes, and professional engineering judgment. 