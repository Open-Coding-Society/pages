---
layout: post
title: "ML | Titanic Survival Prediction"
description: "Predicting Titanic survival using Machine Learning"
permalink: /ml/titanic/fe
---

<!-- 引入样式 -->
<style>
.titanic-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Roboto', sans-serif;
}

.form-section {
    background: #000000;
    border-radius: 10px;
    padding: 25px;
    margin-bottom: 30px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.form-section h2 {
    color: #2c3e50;
    margin-bottom: 20px;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 5px;
    color: #34495e;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 10px;
    border: 2px solid #140000;
    border-radius: 5px;
    font-size: 16px;
    transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #3498db;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.checkbox-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.checkbox-group input {
    width: auto;
}

.btn-predict {
    background: #3498db;
    color: white;
    border: none;
    padding: 15px 30px;
    font-size: 18px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    transition: background 0.3s;
}

.btn-predict:hover {
    background: #57bcff;
}

.btn-predict:disabled {
    background: #95a5a6;
    cursor: not-allowed;
}

.result-section {
    background: #000000;
    border-radius: 10px;
    padding: 25px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.result-card {
    text-align: center;
}

.probability-bar {
    height: 30px;
    background: #0d6471;
    border-radius: 15px;
    overflow: hidden;
    margin: 20px 0;
    position: relative;
}

.probability-fill {
    height: 100%;
    background: linear-gradient(90deg, #2ecc71, #27ae60);
    transition: width 0.5s ease;
}

.probability-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-top: 20px;
}

.stat-item {
    padding: 15px;
    border-radius: 5px;
    font-size: 18px;
}

.survive-stat {
    background: #105420;
    color: #5cc274;
    border: 1px solid #c3e6cb;
}

.die-stat {
    background: #5b040b;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.feature-importance {
    margin-top: 30px;
}

.feature-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.feature-name {
    width: 150px;
    font-size: 14px;
}

.feature-bar {
    flex: 1;
    height: 20px;
    background: #021215;
    border-radius: 10px;
    overflow: hidden;
    margin: 0 10px;
}

.feature-fill {
    height: 100%;
    background: #3498db;
    transition: width 0.3s;
}

.feature-value {
    width: 60px;
    text-align: right;
    font-size: 14px;
}

.loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error-message {
    background: #f8d7da;
    color: #721c24;
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 20px;
    border: 1px solid #f5c6cb;
}
</style>

<div class="titanic-container">
    <h1>🚢 Titanic Survival Prediction</h1>
    <p>Enter passenger information to predict survival probability</p>
    
    <!-- 表单区域 -->
    <div class="form-section">
        <h2>Passenger Information</h2>
        <form id="titanicForm">
            <div class="form-row">
                <div class="form-group">
                    <label>Passenger Class *</label>
                    <select id="pclass" required>
                        <option value="">Select class</option>
                        <option value="1">1st Class</option>
                        <option value="2">2nd Class</option>
                        <option value="3">3rd Class</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Name (optional)</label>
                    <input type="text" id="name" placeholder="Your name">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Sex *</label>
                    <select id="sex" required>
                        <option value="">Select sex</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Age *</label>
                    <input type="number" id="age" min="0" max="100" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Siblings/Spouses</label>
                    <input type="number" id="sibsp" min="0" value="0">
                </div>
                
                <div class="form-group">
                    <label>Parents/Children</label>
                    <input type="number" id="parch" min="0" value="0">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Fare (£) *</label>
                    <input type="number" id="fare" min="0" step="0.01" required>
                </div>
                
                <div class="form-group">
                    <label>Port of Embarkation</label>
                    <select id="embarked">
                        <option value="S">Southampton</option>
                        <option value="C">Cherbourg</option>
                        <option value="Q">Queenstown</option>
                    </select>
                </div>
            </div>
            
            <div class="checkbox-group">
                <input type="checkbox" id="alone">
                <label>Traveling alone</label>
            </div>
            
            <button type="button" class="btn-predict" id="predictBtn" onclick="predictSurvival()">
                Predict Survival
            </button>
        </form>
    </div>
    
    <!-- 结果区域 -->
    <div class="result-section" id="resultSection" style="display: none;">
        <h2>Prediction Result</h2>
        <div class="result-card">
            <div class="probability-bar">
                <div class="probability-fill" id="probabilityFill" style="width: 0%"></div>
                <span class="probability-text" id="probabilityText">0%</span>
            </div>
            
            <div class="stats-grid">
                <div class="stat-item survive-stat">
                    <div>Survival Probability</div>
                    <strong id="surviveProb">0%</strong>
                </div>
                <div class="stat-item die-stat">
                    <div>Death Probability</div>
                    <strong id="dieProb">0%</strong>
                </div>
            </div>
            
            <div class="feature-importance" id="featureSection" style="display: none;">
                <h3>Feature Importance</h3>
                <div id="featureList"></div>
            </div>
        </div>
    </div>
    
    <!-- 错误提示 -->
    <div id="errorMessage" class="error-message" style="display: none;"></div>
</div>

<!-- JavaScript -->
<script>
const API_URL = 'http://localhost:8587/api/titanic/predict';

async function predictSurvival() {
    const predictBtn = document.getElementById('predictBtn');
    const errorDiv = document.getElementById('errorMessage');
    
    // 验证表单
    if (!validateForm()) {
        return;
    }
    
    // 显示加载状态
    predictBtn.disabled = true;
    predictBtn.innerHTML = '<span class="loading"></span> Predicting...';
    errorDiv.style.display = 'none';
    
    // 收集表单数据
    const passengerData = {
        name: document.getElementById('name').value || 'Passenger',
        pclass: parseInt(document.getElementById('pclass').value),
        sex: document.getElementById('sex').value,
        age: parseFloat(document.getElementById('age').value),
        sibsp: parseInt(document.getElementById('sibsp').value),
        parch: parseInt(document.getElementById('parch').value),
        fare: parseFloat(document.getElementById('fare').value),
        embarked: document.getElementById('embarked').value,
        alone: document.getElementById('alone').checked
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(passengerData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayResults(data);
        } else {
            showError(data.error || 'Prediction failed');
        }
    } catch (error) {
        showError('Cannot connect to server. Make sure the backend is running.');
        console.error('Error:', error);
    } finally {
        predictBtn.disabled = false;
        predictBtn.innerHTML = 'Predict Survival';
    }
}

function validateForm() {
    const pclass = document.getElementById('pclass').value;
    const sex = document.getElementById('sex').value;
    const age = document.getElementById('age').value;
    const fare = document.getElementById('fare').value;
    
    if (!pclass || !sex || !age || !fare) {
        showError('Please fill in all required fields');
        return false;
    }
    
    if (age < 0 || age > 100) {
        showError('Age must be between 0 and 100');
        return false;
    }
    
    if (fare < 0) {
        showError('Fare must be positive');
        return false;
    }
    
    return true;
}

function displayResults(data) {
    const surviveProb = (data.survive * 100).toFixed(1);
    const dieProb = (data.die * 100).toFixed(1);
    
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('probabilityFill').style.width = surviveProb + '%';
    document.getElementById('probabilityText').textContent = surviveProb + '%';
    document.getElementById('surviveProb').textContent = surviveProb + '%';
    document.getElementById('dieProb').textContent = dieProb + '%';
    
    // 显示特征重要性
    if (data.feature_weights) {
        displayFeatureWeights(data.feature_weights);
    }
    
    // 滚动到结果
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

function displayFeatureWeights(weights) {
    const featureList = document.getElementById('featureList');
    featureList.innerHTML = '';
    
    // 排序并取前10个特征
    const sortedWeights = Object.entries(weights)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    sortedWeights.forEach(([feature, weight]) => {
        const percent = (weight * 100).toFixed(1);
        const item = document.createElement('div');
        item.className = 'feature-item';
        item.innerHTML = `
            <span class="feature-name">${feature}</span>
            <div class="feature-bar">
                <div class="feature-fill" style="width: ${percent}%"></div>
            </div>
            <span class="feature-value">${percent}%</span>
        `;
        featureList.appendChild(item);
    });
    
    document.getElementById('featureSection').style.display = 'block';
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
</script>

