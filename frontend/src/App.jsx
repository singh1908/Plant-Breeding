import React, { useState } from 'react';

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

        <p>Choose genetic & environmental factors to simulate plant traits.</p>

      </header>

      <main>
        <form onSubmit={handleSubmit} className="predictor-form">
          <div className="form-grid">

            <label>
              Genotype ID:

              <select name="Genotype_ID" value={formData.Genotype_ID} onChange={handleInputChange}>
                {options.genotypes.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>

            <label>
              Marker A (T/C):

              <select name="Marker_A (T/C)" value={formData['Marker_A (T/C)']} onChange={handleInputChange}>
                {options.markers.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>

            <label>
              Gene R1 (P/A):

              <select name="Gene_R1 (P/A)" value={formData['Gene_R1 (P/A)']} onChange={handleInputChange}>
                {options.genes.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>

            <label>
              QTL Fruit Size:

              <select name="QTL_Fruit_Size (A1/A2)" value={formData['QTL_Fruit_Size (A1/A2)']} onChange={handleInputChange}>
                {options.qtls.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>

            <label>
              Location:

              <select name="Location" value={formData.Location} onChange={handleInputChange}>
                {options.locations.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>

            <label>
              Irrigation Level:

              <select name="Irrigation_Level" value={formData.Irrigation_Level} onChange={handleInputChange}>
                {options.irrigations.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
          </div>
          <button type="submit" disabled={isLoading}>

            {isLoading ? '🔄 Predicting...' : '🚀 Predict Performance'}

          </button>
        </form>

        <div className="results-container">
          {error && <div className="error-message">⚠️ {error}</div>}
          {isLoading && <div className="loading-spinner"></div>}
          {predictions && (
            <div className="results-card">

              <h2>📊 Predicted Performance</h2>
              <div className="stats-grid">
                <div className="stat-box yield">
                  <h3>🍅 Yield</h3>
                  <p>{predictions.predicted_yield.toFixed(2)} g</p>
                </div>
                <div className="stat-box sugar">
                  <h3>🍭 Sugar</h3>
                  <p>{predictions.predicted_quality.toFixed(2)} Brix</p>
                </div>
                <div className="stat-box stress">
                  <h3>💧 Stress Tolerance</h3>
                  <p>{predictions.predicted_stress.toFixed(2)}</p>
                  <small>(lower is better)</small>
                </div>
                <div className="stat-box flowering">
                  <h3>🌼 Flowering</h3>
                  <p>{predictions.predicted_agronomic.toFixed(2)} days</p>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}


// --- True Black Theme Styling ---
const styles = `
:root { 
  --primary: #27ae60; 
  --secondary: #2ecc71; 
  --bg-dark: #000000;   /* true black */
  --card-bg: #111111;   /* deep black panel */
  --text-color: #f5f5f5; 
}

body { 
  margin: 0; 
  font-family: 'Poppins', sans-serif; 
  background: var(--bg-dark); 
  color: var(--text-color); 

  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 2rem;
}

.container { 
  max-width: 900px; 
  width: 100%; 
  padding: 2rem; 
}

header { text-align: center; margin-bottom: 2rem; }
header h1 { 
  color: var(--secondary); 
  font-size: 2.4rem; 
  margin-bottom: 0.5rem; 
  text-shadow: 0 0 12px rgba(46,204,113,0.9);
}
header p { font-size: 1.1rem; color: #aaaaaa; }

.predictor-form { 
  background: var(--card-bg); 
  padding: 2rem; 
  border-radius: 16px; 
  box-shadow: 0 0 20px rgba(0,255,100,0.2); 
  transition: transform 0.2s ease, box-shadow 0.3s;
}
.predictor-form:hover { 
  transform: translateY(-3px); 
  box-shadow: 0 0 35px rgba(0,255,100,0.35);
}

.form-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
  gap: 1.5rem; 
  margin-bottom: 1.5rem; 
}
label { display: flex; flex-direction: column; font-weight: 600; }
select { 
  padding: 0.75rem; 
  border-radius: 8px; 
  border: 1px solid #333; 
  background: #000; 
  color: var(--text-color); 
  margin-top: 0.5rem; 
  font-size: 1rem; 
  transition: all 0.2s;
}
select:focus { border-color: var(--secondary); outline: none; box-shadow: 0 0 6px rgba(39,174,96,0.8); }

button { 
  width: 100%; 
  padding: 1rem; 
  font-size: 1.1rem; 
  font-weight: bold; 
  color: white; 
  background: var(--primary); 
  border: none; 
  border-radius: 8px; 
  cursor: pointer; 
  transition: all 0.3s; 
}
button:hover { background: var(--secondary); transform: scale(1.03); }
button:disabled { background: #333; cursor: not-allowed; }

.results-container { margin-top: 2rem; }
.results-card { 
  background: var(--card-bg); 
  padding: 2rem; 
  border-radius: 16px; 
  box-shadow: 0 0 20px rgba(0,255,100,0.25); 
  animation: fadeIn 0.5s ease-in-out;
}
.results-card h2 { 
  margin-top: 0; 
  color: var(--secondary); 
  text-align: center; 
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.stat-box {
  background: #000; /* pure black inside cards */
  padding: 1.2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 0 15px rgba(0,255,100,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s;
}
.stat-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 25px rgba(0,255,100,0.4);
}
.stat-box h3 {
  margin: 0 0 0.5rem;
  color: var(--secondary);
}
.stat-box p {
  font-size: 1.4rem;
  font-weight: bold;
  color: #fff;
  margin: 0;
}
.stat-box small {
  font-size: 0.8rem;
  color: #aaa;
}

/* Special accent colors */
.stat-box.yield { border-left: 4px solid #27ae60; }
.stat-box.sugar { border-left: 4px solid #f1c40f; }
.stat-box.stress { border-left: 4px solid #e74c3c; }
.stat-box.flowering { border-left: 4px solid #3498db; }

.error-message { 
  color: #e74c3c; 
  background: #1a0000; 
  padding: 1rem; 
  border-radius: 8px; 
  text-align: center; 
  font-weight: 600; 
}
.loading-spinner { 
  border: 5px solid #111; 
  border-top: 5px solid var(--secondary); 
  border-radius: 50%; 
  width: 50px; 
  height: 50px; 
  animation: spin 1s linear infinite; 
  margin: 2rem auto; 
}
.container {
  width: 100%;
  max-width: 850px;
}

header {
  text-align: center;
  margin-bottom: 2rem;
}
header h1 {
  color: var(--primary-color);
  font-size: 2.2rem;
  margin-bottom: 0.5rem;
}
header p {
  color: #555;
}

.predictor-form {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}
.predictor-form:hover {
  transform: translateY(-2px);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
}

select {
  padding: 0.7rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-top: 0.5rem;
  font-size: 1rem;
  transition: border 0.3s, box-shadow 0.3s;
}
select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 5px rgba(39,174,96,0.4);
  outline: none;
}

button {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
button:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(39,174,96,0.4);
}
button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.results-container {
  margin-top: 2rem;
}

.results-card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  border-left: 6px solid var(--primary-color);
  animation: fadeIn 0.5s ease-in-out;
}
.results-card h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--primary-color);
}
.results-card ul {
  list-style: none;
  padding: 0;
}
.results-card li {
  font-size: 1.05rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}
.results-card li:last-child {
  border-bottom: none;
}

.error-message {
  color: #e74c3c;
  background: #fdecea;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

.loading-spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--primary-color);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default App;

