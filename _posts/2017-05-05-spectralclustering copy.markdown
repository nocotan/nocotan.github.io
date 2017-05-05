---
layout: post
title:  "スペクトラルクラスタリング"
date:   2017-05-05 01:00:00
categories: 機械学習
---

クラスタリングをグラフの分割問題として扱う手法。
入力データをグラフとして表現し、評価関数に基づいてグラフカットを行う。

![画像](https://raw.githubusercontent.com/nocotan/nocotan.github.io/master/images/20170505/graph1.png)

![画像](https://raw.githubusercontent.com/nocotan/nocotan.github.io/master/images/20170505/graph2.png)

### 評価関数
以下の関数を最小化することを目的とする。

* RatioCut
* MCut
* NCut

#### Cut

<br>
　cut(P) = 1/2ΣΣx<sub>ij</sub>  
<br>

#### RatioCut

<br>
　RatioCut(P) = Σcut(P<sub>k</sub>)/|P<sub>k</sub>|  
<br>

#### RatioCut

<br>
　RatioCut(P) = Σcut(P<sub>k</sub>)  
<br>

#### NCut

<br>
　NCut(P) = Σcut(P<sub>k</sub>)/vol(P<sub>k</sub>), vol(P) = Σx<sub>ij</sub>  
<br>

### アルゴリズム
* グラフラプラシアンL=D<sup>-1</sup>LD<sup>-1</sup>を求める
* Lの固有値問題を解く
* Fielderベクトルu<sub>2</sub>を求める
* q = D<sup>-1/2</sup>u<sub>2</sub>を求める
* qをソートしクラスタリングする

### グラフラプラシアン

<br>
　L = D - W  
<br>

#### 対称正規化グラフラプラシアン

<br>
　L<sub>sym</sub> = D<sup>1/2</sup>LD<sup>1/2</sup>  
<br>

#### 酔歩正規化グラフラプラシアン

<br>
　L<sub>rw</sub> = D<sup>-1</sup>L  
<br>

### サンプル

```python
from sklearn import (manifold, datasets, decomposition)
from sklearn import cluster

X_spec = manifold.SpectralEmbedding(n_components=2,
affinity='nearest_neighbors', gamma=None, random_state=None, eigen_solver=None,
n_neighbors=5).fit_transform(X_train)

spectral = cluster.SpectralClustering(n_clusters=10, eigen_solver='arpack',
affinity="nearest_neighbors")

X = spectral.fit(X_spec)
y_pred = spectral.fit_predict(X_spec)
```
