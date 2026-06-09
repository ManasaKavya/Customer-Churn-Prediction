"""
Generate synthetic banking customer dataset for churn prediction.
"""
import numpy as np
import pandas as pd
import json
from pathlib import Path


def generate_synthetic_data(n_samples=10000, churn_rate=0.20, random_state=42):
    """
    Generate synthetic banking customer dataset.
    
    Parameters:
    - n_samples: Number of customer records to generate
    - churn_rate: Proportion of churned customers (0-1)
    - random_state: Random seed for reproducibility
    
    Returns:
    - DataFrame with customer features and churn labels
    """
    np.random.seed(random_state)
    
    # Calculate number of churned vs retained customers
    n_churned = int(n_samples * churn_rate)
    n_retained = n_samples - n_churned
    
    # Generate features
    customer_ids = np.arange(1, n_samples + 1)
    
    # Age: between 18 and 80
    age = np.random.randint(18, 81, n_samples)
    
    # Tenure: months as customer (0-72 months = 6 years)
    tenure = np.random.randint(0, 73, n_samples)
    
    # Credit Score: 300-850
    credit_score = np.random.randint(300, 851, n_samples)
    
    # Balance: account balance in thousands
    balance = np.random.exponential(scale=50, size=n_samples)
    balance = np.clip(balance, 0, 250)
    
    # Monthly Charges: in hundreds
    monthly_charges = np.random.gamma(shape=2, scale=300, size=n_samples)
    monthly_charges = np.clip(monthly_charges, 50, 2000)
    
    # Number of Products: 1-4
    num_products = np.random.randint(1, 5, n_samples)
    
    # Has Credit Card: binary
    has_credit_card = np.random.choice([0, 1], n_samples, p=[0.3, 0.7])
    
    # Is Active Member: binary
    is_active = np.random.choice([0, 1], n_samples, p=[0.2, 0.8])
    
    # Country: categorical (France, Germany, Spain)
    countries = np.random.choice(['France', 'Germany', 'Spain'], n_samples, p=[0.5, 0.3, 0.2])
    
    # Gender: Male/Female
    gender = np.random.choice(['Male', 'Female'], n_samples, p=[0.55, 0.45])
    
    # Customer Type: Regular/Premium
    customer_type = np.random.choice(['Regular', 'Premium'], n_samples, p=[0.7, 0.3])
    
    # Churn: target variable (imbalanced)
    churn = np.concatenate([np.ones(n_churned), np.zeros(n_retained)])
    np.random.shuffle(churn)
    
    # Create relationships that influence churn
    # Low tenure + high charges -> higher churn likelihood
    churn_mask = churn == 1
    tenure[churn_mask] = np.minimum(tenure[churn_mask] + np.random.randint(-5, 15, n_churned), 72)
    monthly_charges[churn_mask] = monthly_charges[churn_mask] * np.random.uniform(1.1, 1.5, n_churned)
    is_active[churn_mask] = np.where(np.random.rand(n_churned) < 0.6, 0, is_active[churn_mask])
    
    # Create DataFrame
    df = pd.DataFrame({
        'CustomerID': customer_ids,
        'Age': age,
        'Tenure': tenure,
        'CreditScore': credit_score,
        'Balance': balance,
        'MonthlyCharges': monthly_charges,
        'NumProducts': num_products,
        'HasCreditCard': has_credit_card,
        'IsActiveMember': is_active,
        'Country': countries,
        'Gender': gender,
        'CustomerType': customer_type,
        'Churn': churn.astype(int)
    })
    
    return df


def save_data(df, output_dir='public/data'):
    """Save dataset to CSV and create sample statistics."""
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Save full dataset
    csv_path = f'{output_dir}/customer_data.csv'
    df.to_csv(csv_path, index=False)
    print(f"✓ Dataset saved to {csv_path}")
    
    # Save summary statistics
    stats = {
        'total_customers': len(df),
        'churn_count': int(df['Churn'].sum()),
        'churn_rate': float(df['Churn'].mean()),
        'feature_stats': {}
    }
    
    # Numerical features stats
    numerical_cols = ['Age', 'Tenure', 'CreditScore', 'Balance', 'MonthlyCharges']
    for col in numerical_cols:
        stats['feature_stats'][col] = {
            'mean': float(df[col].mean()),
            'median': float(df[col].median()),
            'std': float(df[col].std()),
            'min': float(df[col].min()),
            'max': float(df[col].max())
        }
    
    # Categorical features stats
    categorical_cols = ['Country', 'Gender', 'CustomerType']
    for col in categorical_cols:
        stats['feature_stats'][col] = df[col].value_counts().to_dict()
    
    stats_path = f'{output_dir}/data_summary.json'
    with open(stats_path, 'w') as f:
        json.dump(stats, f, indent=2)
    print(f"✓ Summary statistics saved to {stats_path}")
    
    return df


if __name__ == '__main__':
    print("Generating synthetic banking customer dataset...")
    df = generate_synthetic_data(n_samples=10000, churn_rate=0.20)
    print(f"Generated {len(df)} customer records")
    print(f"Churn rate: {df['Churn'].mean():.2%}")
    print("\nFirst 5 rows:")
    print(df.head())
    
    save_data(df)
    print("\n✓ Data generation complete!")
