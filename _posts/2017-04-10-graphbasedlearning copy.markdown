---
layout: post
title:  "Graph-based Semi-Supervised Learning"
date:   2017-04-10 01:00:00
categories: 機械学習
---

グラフベースの半教師あり学習の紹介。  
半教師あり学習は、普通の教師あり学習と比べて、ラベルのついていない(大量の)デー
タを学習に用いることがきるという利点がある。

## 教師あり学習
![画像](https://raw.githubusercontent.com/nocotan/nocotan.github.io/master/images/20170410/flow1.png)

* 決定木,サポートベクターマシンなど
* ラベル付きデータを使用して学習を行う

## 半教師あり学習(SSL: Semi-Supervised Learning)
![画像](https://raw.githubusercontent.com/nocotan/nocotan.github.io/master/images/20170410/flow2.png)

* Self-Training, Co-Trainingなど
* ラベル付きデータに加えて、大量のラベルなしデータを使用して学習を行う

### 半教師あり学習の利点
一般に、分類器の性能をあげるために、データを大量に与えたい。しかし、ラベル付き
データを集めるのはとてもコストがかかる。特に、現時点でラベルがついていないデー
タに対して人力でラベルをつける作業は、非常に多くの時間やコストを要する。一方ラ
ベルなしデータであれば、コストをかけることなく大量に手に入れることができる。普通の
教師あり学習ではこれらのラベルなしデータはあくまで分類対象でしかなく、明らかな
デッドリソースである。こういったデータを学習に上手に利用することで分類器の性能
向上を目指すというのが、半教師あり学習の考え方である。

## Graph-based Semi-supervised Learning
* ノード間が重みの大きいエッジで繋がっているならば、それらのノードは同じラベル
  を持っているはずだという仮定をする -> 類似度の大きいデータは同じラベルを持っ
  ているのではないかという仮定

![画像](https://raw.githubusercontent.com/nocotan/nocotan.github.io/master/images/20170410/flow3.png)
![画像](https://raw.githubusercontent.com/nocotan/nocotan.github.io/master/images/20170410/flow4.png)


### Neighborhood Methods
* k-Nearest Neighbor Graph (k-NNG)
* e-Neighborhood Method

#### k-Nearest Neighbor Graph (k-NNG)
インスタンスとそのk最近傍点の間にエッジを追加する

![画像](https://raw.githubusercontent.com/nocotan/nocotan.github.io/master/images/20170410/flow5.png)

##### 欠点
* スケーラブルでない
* 非対称グラフになる
* 不規則なグラフになる

#### e-Neighborhood
半径eの球内の全てのインスタンスにエッジを追加する

![画像](https://raw.githubusercontent.com/nocotan/nocotan.github.io/master/images/20170410/flow6.png)

##### 欠点
* スケーラブルでない
* eの値に敏感
* 断片化されたグラフになる -> 接続されていないインスタンスが大量に出現する可能
  性がある

## アルゴリズム
* Label Propagation
* Modified Adsorption
* Measure Propagation
* Sparse Label Propagation
* Manifold Regularization
* Spectral Graph Transduction
