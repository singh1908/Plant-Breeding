from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split

# --- 1. SETUP AND DATA PREPARATION ---
app = Flask(_name_)
CORS(app) # Enable Cross-Origin Resource Sharing

# Load and prepare data at startup
try:
    df = pd.read_json('plant_breeding_dataset.json')
    
    # Define features and prepare data for encoding
    FEATURES = [
        'Genotype_ID', 'Marker_A (T/C)', 'Gene_R1 (P/A)',
        'QTL_Fruit_Size (A1/A2)', 'Location', 'Irrigation_Level'
    ]
    X = df[FEATURES]
    X_encoded = pd.get_dummies(X, columns=FEATURES)
    
    # Store the column structure for later use
    MODEL_COLUMNS = X_encoded.columns
    
    print("Dataset loaded and prepared successfully.")

except FileNotFoundError:
    print("Error: 'plant_breeding_dataset.json' not found.")
    df = None

# --- 2. TRAIN MODELS AT STARTUP ---
MODELS = {}

def train_model(target_variable):
    """A helper function to train a model for a specific target."""
    if df is None:
        return None
    y = df[target_variable]
    X_train, _, y_train, _ = train_test_split(X_encoded, y, test_size=0.2, random_state=42)
    model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    print(f"Model for '{target_variable}' trained successfully.")
    return model

if df is not None:
    MODELS['yield'] = train_model('Avg_Fruit_Weight_g')
    MODELS['quality'] = train_model('Sugar_Content_Brix')
    MODELS['stress'] = train_model('Drought_Score_(1-5)')
    MODELS['agronomic'] = train_model('Days_to_Flowering')

# --- 3. CREATE THE PREDICTION API ENDPOINT ---
@app.route('/predict', methods=['POST'])
def predict():
    if not MODELS:
        return jsonify({"error": "Models are not trained. Check server logs."}), 500

    # Get data from the POST request
    data = request.get_json()
    
    # Convert incoming data to a DataFrame
    new_plant_df = pd.DataFrame([data])
    
    # One-hot encode the new data
    new_plant_encoded = pd.get_dummies(new_plant_df)
    
    # Align columns with the training data to ensure correct format
    final_new_plant = new_plant_encoded.reindex(columns=MODEL_COLUMNS, fill_value=0)
    
    # Make predictions using each trained model
    predictions = {
        "predicted_yield": MODELS['yield'].predict(final_new_plant)[0],
        "predicted_quality": MODELS['quality'].predict(final_new_plant)[0],
        "predicted_stress": MODELS['stress'].predict(final_new_plant)[0],
        "predicted_agronomic": MODELS['agronomic'].predict(final_new_plant)[0],
    }
    
    return jsonify(predictions)

if _name_ == '_main_':
    app.run(debug=True)