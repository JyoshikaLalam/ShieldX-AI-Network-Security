
import streamlit as st  # type: ignore
import pandas as pd # type: ignore
import numpy as np # type: ignore
from sklearn.model_selection import train_test_split # type: ignore
from sklearn.preprocessing import StandardScaler # type: ignore
from sklearn.ensemble import RandomForestClassifier # type: ignore
from sklearn.svm import SVC # type: ignore
from sklearn.neighbors import KNeighborsClassifier # type: ignore
from sklearn.metrics import classification_report # type: ignore

st.set_page_config(page_title="ShieldX - Network Intrusion Detection", layout="wide")

st.title("🛡️ ShieldX: Network Intrusion Detection System")

# Upload CSV file
uploaded_file = st.file_uploader("Upload CICIDS CSV Dataset", type=["csv"])

if uploaded_file is not None:
    df = pd.read_csv(uploaded_file)

    st.subheader("🔍 Dataset Preview")
    st.dataframe(df.head())

    # Data Cleaning
    df.dropna(inplace=True)
    df = df.loc[:, df.apply(pd.Series.nunique) > 1]

    # Standardize column names
    df.rename(columns=lambda x: x.strip(), inplace=True)
    if 'Attack Label' in df.columns:
        df.rename(columns={'Attack Label': 'Label'}, inplace=True)

    # Convert Label to binary
    if 'Label' in df.columns:
        df['Label'] = df['Label'].apply(lambda x: 0 if 'BENIGN' in str(x).upper() else 1)
    else:
        st.error("❌ 'Label' column not found.")
        st.stop()

    # Select only numeric columns
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.dropna(inplace=True)
    df = df.select_dtypes(include=[np.number, 'bool'])

    if 'Label' not in df.columns:
        st.error("❌ 'Label' column missing after preprocessing.")
        st.stop()

    X = df.drop(['Label'], axis=1)
    y = df['Label']

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # Model selection
    st.sidebar.header("⚙️ Model Configuration")
    model_choice = st.sidebar.selectbox("Choose a classifier", ("Random Forest", "SVM", "KNN"))

    if model_choice == "Random Forest":
        model = RandomForestClassifier()
    elif model_choice == "SVM":
        model = SVC()
    elif model_choice == "KNN":
        model = KNeighborsClassifier()

    # Train model
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    # Output metrics
    st.subheader("📊 Classification Report")
    report = classification_report(y_test, y_pred, output_dict=True)
    st.dataframe(pd.DataFrame(report).transpose())

    st.success(f"✅ Model '{model_choice}' trained and evaluated successfully.")
else:
    st.info("📤 Please upload a dataset to get started.")
