# 🛡️ ShieldX‑AI‑Network‑Security

An AI-powered **Intrusion Detection System (IDS)** designed to enhance cybersecurity by detecting and flagging malicious network traffic patterns using modern machine learning techniques.

---

## 🌟 Features

* ✅ AI/ML-based threat detection with popular benchmark datasets
* 📈 Exploratory Data Analysis (EDA) and visualization in Jupyter Notebook
* 🌐 Flask-based web application (`app.py`) for real-time predictions
* 🧾 Auto-generated PDF report summarizing network insights
* 🔄 End-to-end preprocessing pipeline (scaling, encoding, splitting)

---

## 📁 Repository Structure

```
ShieldX-AI-Network-Security/
├── .streamlit/
│   └── config.toml               # Streamlit UI settings
│
├── Intel-ShieldX-vite_Dashboard/  # Frontend dashboard
│   ├── docs/                       # documentation
│   │   ├── api.md
│   │   ├── architecture.md
│   │   └── project-timeline.md
│   ├── src/
│   │   ├── components/            # UI components (cards, tables, etc.)
│   │   ├── pages/                 # Route-based views (Home, Monitor, Report)
│   │   ├── types/                 # TypeScript type declarations
│   │   ├── utils/                 # Helper functions
│   │   ├── App.tsx                # Main React component
│   │   ├── main.tsx               # Entry point
│   │   ├── index.css              # Global styles
│   │   └── vite-env.d.ts
│   ├── index.html                 # App shell
│   ├── package.json               # Frontend dependencies
│   ├── tailwind.config.js         # Tailwind CSS config
│   └── tsconfig.*.json            # TypeScript configs
│
├── data/
│   └── [Dataset CSV files]        # CICIDS2017
│
├── app.py                         # Flask backend serving predictions (streamlit)
├── ShieldX_AIML_NetworkSecurity.ipynb  # Jupyter notebook with ML pipeline
├── ShieldX_Network_Traffic_Analysis.pdf # PDF summary of analysis
├── requirements.txt               # Backend dependencies
└── README.md                      # Project documentation
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/JyoshikaLalam/ShieldX-AI-Network-Security.git
cd ShieldX-AI-Network-Security
```

### 2. Create a virtual environment and activate

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

### 3. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 4. Run Flask API

```bash
python -m streamlit run app.py
```

### 5. Launch Frontend (optional if using Vite dashboard)

```bash
cd Intel-ShieldX-vite_Dashboard
npm install
npm run dev
```

---

## 🔍 Core Files Explained

### 🧠 `ShieldX_AIML_NetworkSecurity.ipynb`

This notebook performs the full ML workflow:

* **Data ingestion**: Reads raw network traffic data from CSV files.
* **Preprocessing**: Cleans nulls, encodes categorical features, scales numerics.
* **EDA**:

  * Visualizes protocol and attack distributions.
  * Correlation matrix.
  * Anomaly heatmaps (optional).
* **Model training**:

  * `RandomForestClassifier`, `SVM`, `KNN`
  * Compares their performance using confusion matrix, accuracy, precision, recall.

---

### 📑 `ShieldX_Network_Traffic_Analysis.pdf`

A printable, concise version of the notebook’s outputs:

* Charts of class balance, feature correlation
* Summary of metrics from trained classifiers
* Notes on feature importance (e.g., `flow_duration`, `flag`, `src_bytes`)
* Recommendation of best-performing model (likely Random Forest)

---

### 🌐 `app.py`

* A simple **Flask app** that:

  * Loads the trained model.
  * Accepts uploaded `.csv` files with unseen network traffic.
  * Returns predictions (malicious or benign).
* Integrated with frontend for real-time inference.

**Routes:**

```python
@app.route('/', methods=['GET'])           # Homepage
@app.route('/predict', methods=['POST'])   # Accepts CSV upload, returns results
```

---

### 💻 `Intel-ShieldX-vite_Dashboard/`

* Built with **Vite + React + TypeScript + TailwindCSS**
* Pages include:

  * **Home**: Overview of system capabilities
  * **Live Monitor**: Real-time predictions (pending integration)
  * **Reports**: Shows graphs and historical data

#### Notable Files:

* `docs/api.md`: API documentation for frontend/backend interaction
* `docs/architecture.md`: System design overview
* `project-timeline.md`: Development schedule or milestones

---

## 📊 ML Models Used

| Model            | Description                    | Use Case               |
| ---------------- | ------------------------------ | ---------------------- |
| Random Forest    | Ensemble of decision trees     | High-accuracy baseline |
| SVM              | Margin-based classifier        | Good for binary splits |
| KNN              | Instance-based classifier      | Small-scale testing    |
| Ensemble Model   | Anomaly detection              | Intrusion detection    |

**Evaluation Metrics**:

* Accuracy
* Precision / Recall
* F1-Score
* ROC-AUC
* Confusion Matrix

---

## 📈 Example Output

* Upload a `.csv` of logs like:

  ```
  duration,src_bytes,dst_bytes,protocol_type,flag,...
  0.3,491,0,tcp,SF,...
  ```
* Get predictions:

  ```
  0: Normal
  1: Attack
  ```

---

## 🧩 Future Enhancements

* 🔲 Add Deep Learning-based classifiers
* 🔲 Streamlit/Flask dashboard integration
* 🔲 Live packet sniffing (Wireshark/PyShark)
* 🔲 Docker support for full deployment
* 🔲 Integrate Kafka for live data ingestion
