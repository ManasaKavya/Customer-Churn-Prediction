"""
Train multiple machine learning models for churn prediction.
"""
import pandas as pd
import numpy as np
import json
import joblib
from pathlib import Path
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV, cross_val_score
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report
)

from preprocessing import preprocess_data


def train_models(X_train, X_test, y_train, y_test, feature_names):
    """
    Train multiple models with hyperparameter tuning.
    
    Returns:
    - Dictionary with trained models and their metrics
    """
    models = {}
    
    print("\n" + "="*60)
    print("TRAINING LOGISTIC REGRESSION")
    print("="*60)
    
    # Logistic Regression with Grid Search
    lr_params = {
        'C': [0.001, 0.01, 0.1, 1, 10, 100],
        'solver': ['lbfgs', 'liblinear'],
        'max_iter': [1000]
    }
    
    lr_grid = GridSearchCV(
        LogisticRegression(random_state=42),
        lr_params,
        cv=5,
        scoring='roc_auc',
        n_jobs=-1
    )
    lr_grid.fit(X_train, y_train)
    lr_model = lr_grid.best_estimator_
    
    print(f"✓ Best parameters: {lr_grid.best_params_}")
    print(f"✓ Best CV score: {lr_grid.best_score_:.4f}")
    
    models['logistic_regression'] = {
        'model': lr_model,
        'params': lr_grid.best_params_,
        'cv_score': float(lr_grid.best_score_)
    }
    
    print("\n" + "="*60)
    print("TRAINING RANDOM FOREST")
    print("="*60)
    
    # Random Forest with Grid Search
    rf_params = {
        'n_estimators': [100, 200],
        'max_depth': [10, 15, 20, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    
    rf_grid = GridSearchCV(
        RandomForestClassifier(random_state=42, n_jobs=-1),
        rf_params,
        cv=5,
        scoring='roc_auc',
        n_jobs=-1
    )
    rf_grid.fit(X_train, y_train)
    rf_model = rf_grid.best_estimator_
    
    print(f"✓ Best parameters: {rf_grid.best_params_}")
    print(f"✓ Best CV score: {rf_grid.best_score_:.4f}")
    
    models['random_forest'] = {
        'model': rf_model,
        'params': rf_grid.best_params_,
        'cv_score': float(rf_grid.best_score_)
    }
    
    return models


def evaluate_models(models, X_train, X_test, y_train, y_test, feature_names, output_dir='public/data'):
    """
    Evaluate all trained models and save metrics.
    """
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    all_metrics = {}
    
    for model_name, model_info in models.items():
        print(f"\n{'='*60}")
        print(f"EVALUATING {model_name.upper()}")
        print(f"{'='*60}")
        
        model = model_info['model']
        
        # Predictions
        y_pred = model.predict(X_test)
        y_pred_proba = model.predict_proba(X_test)[:, 1]
        
        # Calculate metrics
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, y_pred_proba)
        cm = confusion_matrix(y_test, y_pred)
        
        print(f"Accuracy:  {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall:    {recall:.4f}")
        print(f"F1-Score:  {f1:.4f}")
        print(f"ROC-AUC:   {roc_auc:.4f}")
        print(f"\nConfusion Matrix:")
        print(f"  [[{cm[0,0]}, {cm[0,1]}],")
        print(f"   [{cm[1,0]}, {cm[1,1]}]]")
        
        # Store metrics
        all_metrics[model_name] = {
            'accuracy': float(accuracy),
            'precision': float(precision),
            'recall': float(recall),
            'f1_score': float(f1),
            'roc_auc': float(roc_auc),
            'confusion_matrix': cm.tolist(),
            'cv_score': model_info['cv_score']
        }
        
        # Feature importance for tree-based models
        if hasattr(model, 'feature_importances_'):
            feature_importance = dict(zip(feature_names, model.feature_importances_.tolist()))
            # Sort by importance
            feature_importance = dict(sorted(
                feature_importance.items(),
                key=lambda x: x[1],
                reverse=True
            ))
            all_metrics[model_name]['feature_importance'] = feature_importance
    
    # Save metrics
    metrics_path = f'{output_dir}/model_metrics.json'
    with open(metrics_path, 'w') as f:
        json.dump(all_metrics, f, indent=2)
    print(f"\n✓ Model metrics saved to {metrics_path}")
    
    return all_metrics


def save_models(models, output_dir='backend/models'):
    """Save trained models to disk."""
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    for model_name, model_info in models.items():
        model = model_info['model']
        model_path = f'{output_dir}/{model_name}.pkl'
        joblib.dump(model, model_path)
        print(f"✓ Saved {model_name} to {model_path}")


def main():
    print("Loading and preprocessing data...")
    df = pd.read_csv('public/data/customer_data.csv')
    
    X_train, X_test, y_train, y_test, feature_names, encoders, scaler = preprocess_data(df)
    
    print("\nTraining models...")
    models = train_models(X_train, X_test, y_train, y_test, feature_names)
    
    print("\nEvaluating models...")
    metrics = evaluate_models(models, X_train, X_test, y_train, y_test, feature_names)
    
    print("\nSaving models...")
    save_models(models)
    
    print("\n" + "="*60)
    print("MODEL TRAINING AND EVALUATION COMPLETE!")
    print("="*60)
    
    # Summary
    print("\nModel Performance Summary:")
    for model_name, metrics_dict in metrics.items():
        print(f"\n{model_name.upper()}:")
        print(f"  Accuracy:  {metrics_dict['accuracy']:.4f}")
        print(f"  Precision: {metrics_dict['precision']:.4f}")
        print(f"  Recall:    {metrics_dict['recall']:.4f}")
        print(f"  F1-Score:  {metrics_dict['f1_score']:.4f}")
        print(f"  ROC-AUC:   {metrics_dict['roc_auc']:.4f}")


if __name__ == '__main__':
    main()
