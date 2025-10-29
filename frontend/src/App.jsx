import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

// ---------------------- Static dropdown options ----------------------
const options = {
  genotypes: Array.from({ length: 5000 }, (_, i) => `G${String(i + 1).padStart(2, "0")}`),
  markers: ["T", "C"],
  genes: ["P", "A"],
  qtls: ["A1", "A2"],
  locations: ["Badlapur", "Nagpur"],
  irrigations: ["Optimal", "Stressed"],
};

// ---------------------- Input Page ----------------------
function InputPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Genotype_ID: "G01",
    "Marker_A (T/C)": "T",
    "Gene_R1 (P/A)": "P",
    "QTL_Fruit_Size (A1/A2)": "A1",
    Location: "Badlapur",
    Irrigation_Level: "Optimal",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Server not responding. Check Flask backend.");

      const data = await response.json();

      // navigate to output page with results
      navigate("/output", { state: { predictions: data } });
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

      <form onSubmit={handleSubmit} className="predictor-form">
        <div className="form-grid">
          <label>
            Genotype ID:
            <select
              name="Genotype_ID"
              value={formData.Genotype_ID}
              onChange={handleInputChange}
            >
              {options.genotypes.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>

          <label>
            Marker A (T/C):
            <select
              name="Marker_A (T/C)"
              value={formData["Marker_A (T/C)"]}
              onChange={handleInputChange}
            >
              {options.markers.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>

          <label>
            Gene R1 (P/A):
            <select
              name="Gene_R1 (P/A)"
              value={formData["Gene_R1 (P/A)"]}
              onChange={handleInputChange}
            >
              {options.genes.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>

          <label>
            QTL Fruit Size:
            <select
              name="QTL_Fruit_Size (A1/A2)"
              value={formData["QTL_Fruit_Size (A1/A2)"]}
              onChange={handleInputChange}
            >
              {options.qtls.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>

          <label>
            Location:
            <select
              name="Location"
              value={formData.Location}
              onChange={handleInputChange}
            >
              {options.locations.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>

          <label>
            Irrigation Level:
            <select
              name="Irrigation_Level"
              value={formData.Irrigation_Level}
              onChange={handleInputChange}
            >
              {options.irrigations.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "🔄 Predicting..." : "🚀 Predict Performance"}
        </button>
      </form>

      {error && <div className="error-message">⚠️ {error}</div>}
    </div>
  );
}

// ---------------------- Output Page ----------------------
function OutputPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const predictions = location.state?.predictions;

  if (!predictions) {
    return (
      <div className="container">
        <div className="error-message">⚠️ No predictions found.</div>
        <button onClick={() => navigate("/")}>⬅️ Go Back</button>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1>📊 Predicted Performance</h1>
        <p>Simulation results based on your selected conditions.</p>
      </header>

      <div className="results-card">
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

        <button onClick={() => navigate("/")}>⬅️ New Prediction</button>
      </div>
    </div>
  );
}

// ---------------------- App with Routing ----------------------
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InputPage />} />
        <Route path="/output" element={<OutputPage />} />
      </Routes>
    </Router>
  );
}

// ---------------------- Dark Theme CSS ----------------------
const styles = `
:root {
  --primary: #27ae60;
  --secondary: #2ecc71;
  --bg-dark: #000000;
  --card-bg: #111111;
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

header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  color: var(--secondary);
  font-size: 2.4rem;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 12px rgba(46, 204, 113, 0.9);
}

header p {
  font-size: 1.1rem;
  color: #aaaaaa;
}

.predictor-form {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 255, 100, 0.2);
  transition: transform 0.2s ease, box-shadow 0.3s;
}

.predictor-form:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 35px rgba(0, 255, 100, 0.35);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
}

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

select:focus {
  border-color: var(--secondary);
  outline: none;
  box-shadow: 0 0 6px rgba(39, 174, 96, 0.8);
}

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
  margin-top: 1rem;
}

button:hover {
  background: var(--secondary);
  transform: scale(1.03);
}

button:disabled {
  background: #333;
  cursor: not-allowed;
}

.results-card {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 0 20px rgba(0, 255, 100, 0.25);
  animation: fadeIn 0.5s ease-in-out;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.stat-box {
  background: #000;
  padding: 1.2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 0 15px rgba(0, 255, 100, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s;
}

.stat-box:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 25px rgba(0, 255, 100, 0.4);
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default App;
