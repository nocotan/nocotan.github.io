---
layout: post
title:  "On the Convergence of Adam and Beyond"
date:   2018-02-02 20:00:00
categories: 機械学習
---

* 元論文: [On the Convergence of Adam and Beyond](https://openreview.net/pdf?id=ryQu7f-RZ)

## 概要
深層学習で用いられる勾配更新に基づく既存の最適化手法は，しばしば最適解への収束に失敗するケースがある．
本論文では，そうした失敗の一つの原因がアルゴリズムで用いられる指数移動平均によるものであることを示す．
また，Adamが最適解に収束しない単純な凸最適化設定の例を紹介する．
これについての分析から，過去の勾配の長期的な記憶を保持するアルゴリズムによって収束問題を修正することができることが考察できる．
本論文では，収束問題を解決するだけでなく，経験的な性能向上をもたらすAdamの変形アルゴリズムを示す．

## Introduction
深層学習モデルの学習において，モデルのパラメータをロス関数を減少させる方向に反復的に更新するSGDの改良である，学習率を自動で適合させるAdamやAdagrad，RMSPropといったアルゴリズムが成功を収めている．
これらのアルゴリズムは多くの場合うまくいくが，いくつかの問題設定においては収束しないことが観測されている．
そうした問題設定はごく稀にのみ大きな勾配をもたらすという特徴があり，それらの影響は指数移動平均のために急速に減少し，収束性に乏しくなってしまう．

*貢献:*

* RMSPROPとAdamが収束しない単純な凸最適化問題を例に，それらのアルゴリズムにおける指数移動平均がもたらす非収束問題を解消する．
* 上記の結果から，収束の保証された最適化アルゴリズムは，以前の勾配についての長期記憶が必要であることを示す．これに基づいて，オリジナルのAdamと同じ時間的/空間的計算量を有するAdamの改良アルゴリズムを提案する．
* 実験結果から提案アルゴリズムの有用性を示す．

## The Non-Convergence of Adam
本章では，Adamが単純な一次元凸最適化問題であっても最適解への収束が失敗する例を示す．
これらの例は(Kingma & Ba, 2015)の収束性の主張と矛盾する．

$$
f_t (x) = \begin{cases}
C_x & for t mod 3 = 1 \\
- x & otherwise
\end{cases}
$$

上式で，$$C > 2$$とするとき．最適解は$$x = -1$$である．
しかしAdamにおいて，$$\beta_{1} = 0$$かつ$$\beta_{2} = 1 / (1 + C^2)$$の時，最適解とは異なる$$x = +1$$に収束してしまう．
これは，上記の式は3回に1回のみ大きな勾配を，残りの2回は間違った方向へ-1の勾配をもたらすため，稀に訪れる大きな勾配$$C$$だけではこれを相殺できないためである．

## A New Exponential Moving Average Variant: AMSGrad
本章では，新しい指数移動平均の変形を提案し，収束性の分析を行う．
Algorithm2にAMSGradのアルゴリズムを示す．

<image src="/images/20180202/fig1.png"></image>

AMSGradはAdamと比べてより小さい学習率を使用し，学習率に過去の勾配の勾配の影響をゆっくりと減衰させる仕組みを導入する．
Figure1とFigure2に論文の実験結果を示す(詳しくは元論文を参照)．

<image src="/images/20180202/fig2.png"></image>

<image src="/images/20180202/fig3.png"></image>

## KerasでのAMSGradの使用
Kerasでは，Adamの引数にamsgrad=Trueを渡すことで有効化できる．
* https://keras.io/ja/optimizers/

```py
from keras import optimizers
optimizer = optimizers.Adam(amsgrad=True)
```

