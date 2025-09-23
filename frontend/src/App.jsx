import React, { useState } from 'react';

// --- Static Options for Form Dropdowns ---
// In a real app, these might come from the dataset dynamically
const options = {
  genotypes: Array.from({ length: 5000 }, (_, i) => `G${String(i + 1).padStart(2, '0')}`),
  markers: ['T', 'C'],
  genes: ['P', 'A'],
  qtls: ['A1', 'A2'],
  locations: ['Badlapur', 'Nagpur'],
  irrigations: ['Optimal', 'Stressed'],
};

function App() {
  const [formData, setFormData] = useState({
    Genotype_ID: 'G01',
    'Marker_A (T/C)': 'T',
    'Gene_R1 (P/A)': 'P',
    'QTL_Fruit_Size (A1/A2)': 'A1',
    Location: 'Badlapur',
    Irrigation_Level: 'Optimal',
  });
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setPredictions(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok. Is the Python server running?');
      }

      const data = await response.json();
      setPredictions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>🌱 Plant Performance Predictor</h1>
        <p>Select the genetic and environmental factors to predict plant performance.</p>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="predictor-form">
          <div className="form-grid">
            {/* Genotype */}
            <label>Genotype ID: <select name="Genotype_ID" value={formData.Genotype_ID} onChange={handleInputChange}>{options.genotypes.map(o => <option key={o} value={o}>{o}</option>)}</select></label>
            {/* Marker A */}
            <label>Marker A (T/C): <select name="Marker_A (T/C)" value={formData['Marker_A (T/C)']} onChange={handleInputChange}>{options.markers.map(o => <option key={o} value={o}>{o}</option>)}</select></label>
            {/* Gene R1 */}
            <label>Gene R1 (P/A): <select name="Gene_R1 (P/A)" value={formData['Gene_R1 (P/A)']} onChange={handleInputChange}>{options.genes.map(o => <option key={o} value={o}>{o}</option>)}</select></label>
            {/* QTL */}
            <label>QTL Fruit Size: <select name="QTL_Fruit_Size (A1/A2)" value={formData['QTL_Fruit_Size (A1/A2)']} onChange={handleInputChange}>{options.qtls.map(o => <option key={o} value={o}>{o}</option>)}</select></label>
            {/* Location */}
            <label>Location: <select name="Location" value={formData.Location} onChange={handleInputChange}>{options.locations.map(o => <option key={o} value={o}>{o}</option>)}</select></label>
            {/* Irrigation */}
            <label>Irrigation Level: <select name="Irrigation_Level" value={formData.Irrigation_Level} onChange={handleInputChange}>{options.irrigations.map(o => <option key={o} value={o}>{o}</option>)}</select></label>
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Predicting...' : 'Predict Performance'}
          </button>
        </form>

        <div className="results-container">
          {error && <div className="error-message">Error: {error}</div>}
          {isLoading && <div className="loading-spinner"></div>}
          {predictions && (
            <div className="results-card">
              <h2>Predicted Performance Profile</h2>
              <ul>
                <li><strong>Yield (Avg. Fruit Weight):</strong> {predictions.predicted_yield.toFixed(2)} grams</li>
                <li><strong>Quality (Sugar Content):</strong> {predictions.predicted_quality.toFixed(2)} Brix</li>
                <li><strong>Stress Tolerance (Drought Score):</strong> {predictions.predicted_stress.toFixed(2)} <em>(lower is better)</em></li>
                <li><strong>Agronomic (Days to Flowering):</strong> {predictions.predicted_agronomic.toFixed(2)} days</li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Basic styling - you can move this to App.css for better organization
const styles = `
:root { --primary-color: #27ae60; --bg-color: #f4f6f8; --card-bg: #ffffff; --text-color: #34495e; }

/* --- MODIFIED FOR CENTERING --- */
body { 
  margin: 0; 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; 
  background-color: var(--bg-color); 
  color: var(--text-color); 
  /* Added Flexbox properties for centering */
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.container { max-width: 800px; padding: 2rem; } /* Removed margin: 0 auto; as it's handled by body's flex */
header { text-align: center; margin-bottom: 2rem; }
header h1 { color: var(--primary-color); }
.predictor-form { background: var(--card-bg); padding: 2rem; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem; }
label { display: flex; flex-direction: column; font-weight: bold; }
select { padding: 0.75rem; border-radius: 4px; border: 1px solid #ddd; margin-top: 0.5rem; font-size: 1rem; }
button { width: 100%; padding: 1rem; font-size: 1.1rem; font-weight: bold; color: white; background-color: var(--primary-color); border: none; border-radius: 4px; cursor: pointer; transition: background-color 0.3s; }
button:hover { background-color: #2ecc71; }
button:disabled { background-color: #95a5a6; cursor: not-allowed; }
.results-container { margin-top: 2rem; }
.results-card { background: var(--card-bg); padding: 2rem; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-left: 5px solid var(--primary-color); }
.results-card h2 { margin-top: 0; }
.results-card ul { list-style: none; padding: 0; }
.results-card li { font-size: 1.1rem; padding: 0.5rem 0; border-bottom: 1px solid #ecf0f1; }
.results-card li:last-child { border-bottom: none; }
.error-message { color: #e74c3c; background: #fbe2e2; padding: 1rem; border-radius: 4px; text-align: center; }
.loading-spinner { border: 4px solid #f3f3f3; border-top: 4px solid var(--primary-color); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 2rem auto; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default App;