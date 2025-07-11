import streamlit as st
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import classification_report
import matplotlib.pyplot as plt
import seaborn as sns

st.set_page_config(page_title="🛡️ ShieldX - Intrusion Detection", layout="wide")

# Sidebar configuration
with st.sidebar:
    st.title("🛠️ Configuration")
    model_choice = st.selectbox("🔍 Select Classifier", ("Random Forest", "SVM", "KNN"))
    show_feat = st.checkbox("🌲 Show Feature Importance (RF only)", value=True)
    st.markdown("---")
  

# Main header
st.markdown("<h1 style='text-align: center;'>🛡️ ShieldX: Network Intrusion Detection System</h1>", unsafe_allow_html=True)

# Upload CSV file
uploaded_file = st.file_uploader("📂 Upload CICIDS CSV Dataset", type=["csv"])

if uploaded_file:
    df = pd.read_csv(uploaded_file)

    st.markdown("### 📄 Data Preview")
    st.dataframe(df.head(), use_container_width=True)

    # Preprocessing
    df.dropna(inplace=True)
    df = df.loc[:, df.apply(pd.Series.nunique) > 1]
    df.rename(columns=lambda x: x.strip(), inplace=True)
    if 'Attack Label' in df.columns:
        df.rename(columns={'Attack Label': 'Label'}, inplace=True)

    if 'Label' not in df.columns:
        st.error("❌ 'Label' column not found.")
        st.stop()

    df['Label'] = df['Label'].apply(lambda x: 0 if 'BENIGN' in str(x).upper() else 1)
    df.replace([np.inf, -np.inf], np.nan, inplace=True)
    df.dropna(inplace=True)
    df = df.select_dtypes(include=[np.number, 'bool'])

    if 'Label' not in df.columns:
        st.error("❌ 'Label' column missing after preprocessing.")
        st.stop()

    X = df.drop(['Label'], axis=1)
    y = df['Label']

    if X.shape[1] == 0:
        st.error("❌ No features available after preprocessing.")
        st.stop()

    # Split and scale
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # Classifier selection
    if model_choice == "Random Forest":
        model = RandomForestClassifier()
    elif model_choice == "SVM":
        model = SVC(probability=True)
    elif model_choice == "KNN":
        model = KNeighborsClassifier()

    with st.spinner("🔄 Training..."):
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

    st.success(f"✅ {model_choice} model trained.")

    # Classification report
    report = classification_report(y_test, y_pred, output_dict=True)
    report_df = pd.DataFrame(report).transpose()

    st.markdown("### 📊 Classification Report")
    st.dataframe(report_df.style.background_gradient(cmap="Blues"), use_container_width=True)

    csv = report_df.to_csv(index=True).encode('utf-8')
    st.download_button("📥 Download Classification Report", data=csv, file_name="classification_report.csv", mime="text/csv")

    # Feature Importance for RF
    if show_feat and model_choice == "Random Forest":
        st.markdown("#### 🌲 Top Feature Importances")
        feat_imp = model.feature_importances_
        feat_df = pd.DataFrame({
            'Feature': df.drop(columns='Label').columns,
            'Importance': feat_imp
        }).sort_values(by="Importance", ascending=False).head(10)

        fig_feat, ax = plt.subplots(figsize=(2.0, 1.8), dpi=120)
        sns.barplot(data=feat_df, x="Importance", y="Feature", palette="viridis", ax=ax)
        ax.set_title("Top 10 Features", fontsize=6)
        ax.set_xlabel("Imp.", fontsize=5)
        ax.set_ylabel("Feat.", fontsize=5)
        ax.tick_params(axis='both', labelsize=4)
        plt.tight_layout()
        st.pyplot(fig_feat, clear_figure=True)

else:
    st.info("📤 Upload a dataset to get started.")
