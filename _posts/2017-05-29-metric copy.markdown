---
layout: post
title:  "予測結果の評価尺度とsklearnによる実装"
date:   2017-05-29 10:00:00
categories: 機械学習
---

分類器で得られた予測結果の評価関数はsklearnによって提供されている。  
(sklearn API Reference)[http://scikit-learn.org/stable/modules/classes.html]

### 精度(適合率)
学習器が正であると予測したデータのうち、実際に正であるデータの割合
  
　Precision = TP / (TP + FP)  
  
```python
from sklearn.metrics import accyracy_score
accuracy_score(y_true, y_pred)
```
  
### 再現率
実際に正であるもののうち、学習器によって正であると予測されたデータの割合
  
　Recall = TP / (TP + FN)  
  
```python
from sklearn.metrics import recall_score
recall_score(y_true, y_pred)
```
  
### F値(F尺度)
精度と再現率の調和平均
  
　F-measure = 2Recall x Precision / (Recall + Precision)  
  
  ```python
from sklearn.metrics import f1_score
f1_score(y_true, y_pred)
```
  
また、上記の結果をまとめて得る関数も提供されている。
  
```python
from sklearn.metrics import precision_recall_fscore_support
precision_recall_fscore_support(y_true, y_pred)
```
