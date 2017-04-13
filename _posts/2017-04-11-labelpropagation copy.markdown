---
layout: post
title:  "Label Propagation"
date:   2017-04-11 01:00:00
categories: 機械学習
---
半教師あり学習アルゴリズム『Label Propagation』の紹介。このアルゴリズムでは、ノ
ードのラベルが近傍に応じて近くのノードに伝播する、グラフ上の伝播の形式として問
題を定式化する。このプロセスでは、もともとラベルがついているデータに関してはラ
ベルを固定する。したがって、ラベル付きデータはラベルのついていないデータに対し
てラベルを「伝播」させるように振る舞う。  
[グラフベース半教師あり学習について](http://nocotan.github.io/%E6%A9%9F%E6%A2%B0%E5%AD%A6%E7%BF%92/2017/04/10/graphbasedlearning-copy.html)

## 問題設定
{(x<sub>1</sub>, y<sub>1</sub>) ... (x<sub>l</sub>, y<sub>l</sub>)}をラベル付き
データとし、{x<sub>l+1</sub> ... s<sub>l+u</sub>}をラベルなしデータとする。(一
般に l << u)。また、全体のデータ数をnとし、全体のクラス数Cは既知のものとする。    
直感的に、同じラベルがついているデータは似ていると思われる。ラベルづけ
されたものとラベルづけされていないものの両方をノードとするグラフを作成し、ノー
ドi, j間のエッジはそれらのノードの類似性を表すものとする。グラフは以下の重みで
完全に接続されているものとする。   
<br>
&emsp;**w<sub>ij</sub> = exp(- ||x<sub>i</sub> - x<sub>j</sub>||<sup>2</sup> / α<sup>2</sup>)**  
<br>
## アルゴリズム
まず、ラベルをエッジに伝播させていく。エッジの重みを大きくすると、ラベルが容易
に移動するようになる。n x nの確率的遷移行列Pを定義すると、    
<br>
&emsp;**P<sub>ij</sub> = P(i → j) = w<sub>ij</sub> / Σw<sub>ik</sub>**  
<br>
P<sub>ij</sub>はノードiからjへの遷移確率である。クラス数をCとし、i番目の行が
y<sub>i</sub>を指すベクトルであるようなl x Cラベル行列Y<sub>L</sub>を定義する。
ここで、各ノードに対するソフトラベルfを計算する。fはn x Cの行列であり、行はラベ
ルの確率分布として解釈することができる。  
以下がラベル伝播法のアルゴリズムである。

1. f ← Pf
2. Clamp the labeled data f<sub>L</sub> = Y<sub>L</sub>
3. Repeat from step 1 until f converges

ステップ1で、全てのノードから、それらの近傍へラベルを伝搬させる。  
ステップ2で、ラベル付きデータのラベルで上書きし直す。  

## scikit-learnを使用した実装
```python
# -*- coding: utf-8 -*-
import numpy as np
from sklearn import datasets
from sklearn.semi_supervised import LabelPropagation

model = LabelPropagation()
iris = datasets.load_iris()

random_unlabeled_points = np.where(np.random.randint(0, 2, size=len(iris.target)))

labels = np.copy(iris.target)
labels[random_unlabeled_points] = -1
model.fit(iris.data, labels)

print(model.score(iris.data, iris.target))
```

##### 参考論文
[Semi-Supervised Learning Using Gaussian Fields and Harmonic Functions](http://www.aaai.org/Papers/ICML/2003/ICML03-118.pdf)
