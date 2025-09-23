# Plant Breeding Prediction System - AI Coding Guidelines

## Architecture Overview

This is a **full-stack plant breeding prediction system** with a Flask ML backend and React frontend. The backend loads and trains 4 RandomForest models at startup on plant breeding data, exposing predictions via a single REST endpoint.

### Core Components
- **Backend**: `backend/app.py` - Flask server with pre-trained ML models
- **Frontend**: `frontend/src/App.jsx` - Single-page React form application
- **Data**: `backend/plant_breeding_dataset.json` - 85K+ plant records with genetic/environmental features

## Critical Patterns

### Backend ML Architecture
- **Models are trained at startup** (not per-request) - see `MODELS` dict in `app.py`
- **Feature encoding**: Uses `pd.get_dummies()` with column alignment pattern via `MODEL_COLUMNS`
- **4 prediction targets**: yield (`Avg_Fruit_Weight_g`), quality (`Sugar_Content_Brix`), stress (`Drought_Score_(1-5)`), agronomic (`Days_to_Flowering`)
- **Required features**: `['Genotype_ID', 'Marker_A (T/C)', 'Gene_R1 (P/A)', 'QTL_Fruit_Size (A1/A2)', 'Location', 'Irrigation_Level']`

### Frontend Data Flow
- **Inline styling pattern**: CSS-in-JS via `document.head.appendChild(styleSheet)` at component bottom
- **Form state**: Single `formData` object with exact backend feature names (including spaces/parentheses)
- **API endpoint**: Hardcoded to `http://127.0.0.1:5000/predict` - update for deployment
- **Static options**: Dropdown values defined in `options` object - currently hardcoded but comments suggest dynamic loading

## Development Workflows

### Local Development
```bash
# Backend (from backend/)
pip install -r requirements.txt
python app.py  # Starts Flask on port 5000

# Frontend (from frontend/)
npm install
npm run dev    # Starts Vite dev server
```

### Key Dependencies
- **Backend**: Flask, pandas, scikit-learn, flask-cors
- **Frontend**: React 19.1.1, Vite 7.1.7 with React plugin

## Project-Specific Conventions

### Data Handling
- **Feature names with special characters**: Use exact strings like `'Marker_A (T/C)'` as object keys
- **Model prediction keys**: Always return `predicted_yield`, `predicted_quality`, `predicted_stress`, `predicted_agronomic`
- **Column alignment**: New prediction data must use `reindex(columns=MODEL_COLUMNS, fill_value=0)` pattern

### Error Handling
- **Backend**: Return 500 status with `{"error": "message"}` JSON for model failures
- **Frontend**: Display errors in `.error-message` styled div, check for server availability

### UI Patterns
- **Form layout**: CSS Grid with `repeat(auto-fit, minmax(250px, 1fr))` for responsive dropdowns
- **Loading states**: Disable submit button, show spinner during API calls
- **Results display**: Formatted with `.toFixed(2)` for numeric precision

## Integration Points

- **CORS**: Enabled on Flask backend for cross-origin requests
- **Content-Type**: Always use `application/json` for API requests
- **State management**: React `useState` for form data, predictions, loading, and error states
- **No routing**: Single-page application without React Router

When modifying this system, ensure ML model retraining triggers (data changes) and maintain the exact feature encoding pipeline for prediction accuracy.