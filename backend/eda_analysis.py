"""
Exploratory Data Analysis for customer churn dataset.
"""
import pandas as pd
import numpy as np
import json
from pathlib import Path


def perform_eda(df, output_dir='public/data'):
    """
    Perform comprehensive EDA and save results as JSON.
    
    Parameters:
    - df: DataFrame with customer data
    - output_dir: Directory to save EDA results
    """
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    eda_results = {}
    
    # 1. Churn Distribution
    churn_counts = df['Churn'].value_counts().to_dict()
    eda_results['churn_distribution'] = {
        'retained': int(churn_counts.get(0, 0)),
        'churned': int(churn_counts.get(1, 0)),
        'churn_rate': float(df['Churn'].mean())
    }
    
    # 2. Age Analysis
    age_churn = df.groupby('Age')['Churn'].agg(['count', 'sum', 'mean']).reset_index()
    age_churn.columns = ['age', 'total', 'churned', 'churn_rate']
    # Group into bins for visualization
    age_bins = []
    for i in range(0, 9):
        bin_start = 18 + i * 7
        bin_end = bin_start + 7
        bin_data = df[(df['Age'] >= bin_start) & (df['Age'] < bin_end)]
        if len(bin_data) > 0:
            age_bins.append({
                'range': f'{bin_start}-{bin_end}',
                'count': int(len(bin_data)),
                'churned': int(bin_data['Churn'].sum()),
                'churn_rate': float(bin_data['Churn'].mean())
            })
    eda_results['age_analysis'] = age_bins
    
    # 3. Tenure Analysis
    tenure_bins = []
    for i in range(0, 8):
        bin_start = i * 9
        bin_end = bin_start + 9
        bin_data = df[(df['Tenure'] >= bin_start) & (df['Tenure'] < bin_end)]
        if len(bin_data) > 0:
            tenure_bins.append({
                'range': f'{bin_start}-{bin_end}',
                'count': int(len(bin_data)),
                'churned': int(bin_data['Churn'].sum()),
                'churn_rate': float(bin_data['Churn'].mean())
            })
    eda_results['tenure_analysis'] = tenure_bins
    
    # 4. Balance Analysis
    balance_bins = []
    for i in range(0, 5):
        bin_start = i * 50
        bin_end = (i + 1) * 50
        bin_data = df[(df['Balance'] >= bin_start) & (df['Balance'] < bin_end)]
        if len(bin_data) > 0:
            balance_bins.append({
                'range': f'${bin_start}k-${bin_end}k',
                'count': int(len(bin_data)),
                'churned': int(bin_data['Churn'].sum()),
                'churn_rate': float(bin_data['Churn'].mean())
            })
    eda_results['balance_analysis'] = balance_bins
    
    # 5. Monthly Charges Analysis
    charges_bins = []
    for i in range(0, 5):
        bin_start = i * 400
        bin_end = (i + 1) * 400
        bin_data = df[(df['MonthlyCharges'] >= bin_start) & (df['MonthlyCharges'] < bin_end)]
        if len(bin_data) > 0:
            charges_bins.append({
                'range': f'${bin_start}-${bin_end}',
                'count': int(len(bin_data)),
                'churned': int(bin_data['Churn'].sum()),
                'churn_rate': float(bin_data['Churn'].mean())
            })
    eda_results['monthly_charges_analysis'] = charges_bins
    
    # 6. Country Analysis
    country_data = []
    for country in df['Country'].unique():
        country_df = df[df['Country'] == country]
        country_data.append({
            'country': country,
            'count': int(len(country_df)),
            'churned': int(country_df['Churn'].sum()),
            'churn_rate': float(country_df['Churn'].mean())
        })
    eda_results['country_analysis'] = country_data
    
    # 7. Gender Analysis
    gender_data = []
    for gender in df['Gender'].unique():
        gender_df = df[df['Gender'] == gender]
        gender_data.append({
            'gender': gender,
            'count': int(len(gender_df)),
            'churned': int(gender_df['Churn'].sum()),
            'churn_rate': float(gender_df['Churn'].mean())
        })
    eda_results['gender_analysis'] = gender_data
    
    # 8. Customer Type Analysis
    ctype_data = []
    for ctype in df['CustomerType'].unique():
        ctype_df = df[df['CustomerType'] == ctype]
        ctype_data.append({
            'type': ctype,
            'count': int(len(ctype_df)),
            'churned': int(ctype_df['Churn'].sum()),
            'churn_rate': float(ctype_df['Churn'].mean())
        })
    eda_results['customer_type_analysis'] = ctype_data
    
    # 9. Credit Card Analysis
    cc_data = []
    for has_cc in [0, 1]:
        cc_df = df[df['HasCreditCard'] == has_cc]
        cc_data.append({
            'has_credit_card': bool(has_cc),
            'count': int(len(cc_df)),
            'churned': int(cc_df['Churn'].sum()),
            'churn_rate': float(cc_df['Churn'].mean())
        })
    eda_results['credit_card_analysis'] = cc_data
    
    # 10. Active Member Analysis
    active_data = []
    for is_active in [0, 1]:
        active_df = df[df['IsActiveMember'] == is_active]
        active_data.append({
            'is_active': bool(is_active),
            'count': int(len(active_df)),
            'churned': int(active_df['Churn'].sum()),
            'churn_rate': float(active_df['Churn'].mean())
        })
    eda_results['active_member_analysis'] = active_data
    
    # 11. Correlation Analysis (for numerical features)
    numerical_df = df[['Age', 'Tenure', 'CreditScore', 'Balance', 'MonthlyCharges', 'Churn']].copy()
    corr_matrix = numerical_df.corr()
    
    # Extract correlations with churn
    churn_correlations = corr_matrix['Churn'].drop('Churn').to_dict()
    eda_results['churn_correlations'] = {
        feature: float(value) for feature, value in churn_correlations.items()
    }
    
    # 12. Feature Statistics
    feature_stats = {}
    for col in ['Age', 'Tenure', 'CreditScore', 'Balance', 'MonthlyCharges']:
        feature_stats[col] = {
            'mean': float(df[col].mean()),
            'median': float(df[col].median()),
            'std': float(df[col].std()),
            'min': float(df[col].min()),
            'max': float(df[col].max()),
            'q25': float(df[col].quantile(0.25)),
            'q75': float(df[col].quantile(0.75))
        }
    eda_results['feature_statistics'] = feature_stats
    
    # 13. Missing Values
    eda_results['missing_values'] = {col: int(df[col].isna().sum()) for col in df.columns}
    
    # Save EDA results
    eda_path = f'{output_dir}/eda_results.json'
    with open(eda_path, 'w') as f:
        json.dump(eda_results, f, indent=2)
    print(f"✓ EDA results saved to {eda_path}")
    
    return eda_results


if __name__ == '__main__':
    # Load the generated data
    df = pd.read_csv('public/data/customer_data.csv')
    print(f"Loaded {len(df)} customer records")
    
    eda_results = perform_eda(df)
    print("✓ EDA analysis complete!")
