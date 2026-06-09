"""
Data preprocessing and feature engineering for churn prediction.
"""
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split


def preprocess_data(df, test_size=0.2, random_state=42):
    """
    Preprocess data: handle missing values, encode categoricals, scale numericals.
    
    Parameters:
    - df: Input DataFrame
    - test_size: Proportion for test set
    - random_state: Random seed
    
    Returns:
    - X_train, X_test, y_train, y_test, feature_names, encoders, scaler
    """
    df = df.copy()
    
    # Separate features and target
    X = df.drop('Churn', axis=1)
    y = df['Churn']
    
    # Remove customer ID as it's not a feature
    X = X.drop('CustomerID', axis=1)
    
    # Handle missing values (none in this case, but good practice)
    X = X.fillna(X.mean(numeric_only=True))
    
    # Encode categorical variables
    encoders = {}
    categorical_cols = ['Country', 'Gender', 'CustomerType']
    
    for col in categorical_cols:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        encoders[col] = le
    
    # Store feature names before any transformations
    feature_names = list(X.columns)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )
    
    # Scale numerical features
    scaler = StandardScaler()
    numerical_cols = ['Age', 'Tenure', 'CreditScore', 'Balance', 'MonthlyCharges', 
                      'NumProducts', 'HasCreditCard', 'IsActiveMember', 
                      'Country', 'Gender', 'CustomerType']
    
    X_train_scaled = X_train.copy()
    X_test_scaled = X_test.copy()
    
    X_train_scaled[numerical_cols] = scaler.fit_transform(X_train[numerical_cols])
    X_test_scaled[numerical_cols] = scaler.transform(X_test[numerical_cols])
    
    print(f"✓ Data preprocessing complete!")
    print(f"  - Train set: {X_train_scaled.shape}")
    print(f"  - Test set: {X_test_scaled.shape}")
    print(f"  - Features: {X_train_scaled.shape[1]}")
    
    return X_train_scaled, X_test_scaled, y_train, y_test, feature_names, encoders, scaler


if __name__ == '__main__':
    df = pd.read_csv('public/data/customer_data.csv')
    X_train, X_test, y_train, y_test, feature_names, encoders, scaler = preprocess_data(df)
    print(f"✓ Preprocessing complete!")
    print(f"Features: {feature_names}")
