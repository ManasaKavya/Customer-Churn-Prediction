"""
Complete ML pipeline: data generation -> EDA -> preprocessing -> model training -> evaluation.
Run this script to generate the complete churn prediction system.
"""
import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from data_generation import generate_synthetic_data, save_data
from eda_analysis import perform_eda
from model_training import train_models, evaluate_models, save_models
from preprocessing import preprocess_data
import pandas as pd
import json
from pathlib import Path


def run_pipeline():
    """Execute the complete pipeline."""
    print("\n" + "="*80)
    print(" CUSTOMER CHURN PREDICTION SYSTEM - COMPLETE PIPELINE")
    print("="*80)
    
    # Phase 1: Data Generation
    print("\n[PHASE 1/4] Generating Synthetic Banking Dataset...")
    print("-" * 80)
    df = generate_synthetic_data(n_samples=10000, churn_rate=0.20)
    print(f"✓ Generated {len(df)} customer records")
    print(f"✓ Churn rate: {df['Churn'].mean():.2%}")
    save_data(df)
    
    # Phase 2: EDA
    print("\n[PHASE 2/4] Performing Exploratory Data Analysis...")
    print("-" * 80)
    eda_results = perform_eda(df)
    print(f"✓ Generated {len(eda_results)} analysis categories")
    
    # Phase 3: Preprocessing
    print("\n[PHASE 3/4] Preprocessing Data...")
    print("-" * 80)
    X_train, X_test, y_train, y_test, feature_names, encoders, scaler = preprocess_data(df)
    print(f"✓ Training set size: {X_train.shape[0]}")
    print(f"✓ Test set size: {X_test.shape[0]}")
    print(f"✓ Number of features: {X_train.shape[1]}")
    
    # Phase 4: Model Training & Evaluation
    print("\n[PHASE 4/4] Training and Evaluating Models...")
    print("-" * 80)
    models = train_models(X_train, X_test, y_train, y_test, feature_names)
    metrics = evaluate_models(models, X_train, X_test, y_train, y_test, feature_names)
    save_models(models)
    
    # Create summary report
    print("\n" + "="*80)
    print(" PIPELINE EXECUTION SUMMARY")
    print("="*80)
    
    summary = {
        'dataset': {
            'total_records': len(df),
            'total_features': len(feature_names),
            'churn_rate': float(df['Churn'].mean()),
            'train_test_split': f"{X_train.shape[0]}/{X_test.shape[0]}"
        },
        'features': feature_names,
        'models': {}
    }
    
    for model_name, metrics_dict in metrics.items():
        summary['models'][model_name] = {
            'accuracy': f"{metrics_dict['accuracy']:.4f}",
            'precision': f"{metrics_dict['precision']:.4f}",
            'recall': f"{metrics_dict['recall']:.4f}",
            'f1_score': f"{metrics_dict['f1_score']:.4f}",
            'roc_auc': f"{metrics_dict['roc_auc']:.4f}"
        }
        print(f"\n{model_name.upper()}")
        print(f"  • Accuracy:  {metrics_dict['accuracy']:.4f}")
        print(f"  • Precision: {metrics_dict['precision']:.4f}")
        print(f"  • Recall:    {metrics_dict['recall']:.4f}")
        print(f"  • F1-Score:  {metrics_dict['f1_score']:.4f}")
        print(f"  • ROC-AUC:   {metrics_dict['roc_auc']:.4f}")
    
    # Save summary
    summary_path = 'public/data/pipeline_summary.json'
    Path('public/data').mkdir(parents=True, exist_ok=True)
    with open(summary_path, 'w') as f:
        json.dump(summary, f, indent=2)
    
    print("\n" + "="*80)
    print(" ✓ PIPELINE COMPLETE!")
    print("="*80)
    print(f"\nOutput files generated:")
    print(f"  • public/data/customer_data.csv - Full dataset")
    print(f"  • public/data/data_summary.json - Data statistics")
    print(f"  • public/data/eda_results.json - EDA analysis results")
    print(f"  • public/data/model_metrics.json - Model performance metrics")
    print(f"  • public/data/pipeline_summary.json - Pipeline summary")
    print(f"  • backend/models/ - Trained model files (.pkl)")
    print("\nYou can now access the dashboard at /dashboard")


if __name__ == '__main__':
    run_pipeline()
