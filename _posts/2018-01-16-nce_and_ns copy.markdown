---
layout: post
title:  "Noise Contrastive Estimation and Negative Sampling"
date:   2018-01-16 20:00:00
categories: 機械学習
---

確率的言語モデルのパラメータ推定の高速化手法のうち，以下の二つについて概説する．

* Noise Contrastive Estimation (NCE)
* Negative Sampling

## 概要
コンテキスト$$c$$に基づいて，語彙$$V$$内の単語$$w$$の生起確率を予測する以下の言語モデルを考える．

$$
p_{\theta} (w | c) = \frac{u_{\theta} (w, c)}{\sum_{w' \in V} (w', c)} = \frac{u_{\theta} (w, c)}{Z_{\theta} (c)}
$$

$$w_{\theta} (w, c) = \exp{s_{\theta} (w, c)}$$はコンテキスト内の単語にスコアを割り当てる関数である．
ここで，語彙$$V$$内の全単語を列挙するのは時間的計算量がかかり過ぎるという問題があるため，これについての高速化および近似手法の研究が行われている．

## Noise Contrastive Estimation (NCE)
NCEは言語モデルの推定問題を，経験分布からのサンプルとノイズ分布によって生成されるサンプルを分類する確率的バイナリ分類器のパラメータ推定問題に帰着する．
2クラスの学習データは以下のように生成される:

* 一つの真のサンプルを経験分布$$\tilde{p}$$からサンプリングし，データが真の分布から得られたものであることを示す補助ラベル$$D = 1$$を付与する
* $$k$$個のノイズサンプルをノイズ分布$$q$$から生成し，データがノイズ分布から得られたものであることを示す補助ラベル$$D = 0$$を付与する

コンテキスト$$c$$が与えられると，同時確率$$p(d, w)$$は

$$
p(d, w | c) = \begin{cases}
\frac{k}{1+k} \times q(w) & if \, d = 0 \\ 
\frac{1}{1+k} \times \tilde{p}(w | c) & if \, d = 1
\end{cases}
$$

条件付き確率の定義から，

$$
p(D = 0 | c, w) = \frac{k \times q(w)}{\frac{1}{1+k} \times \tilde{p}(w | c) + \frac{k}{1+k} \times q(w)}
$$

$$
p(D = 1 | c, w) = \frac{\tilde{p}(w | c)}{\tilde{p}(w | c) + k \times q(w)}
$$

NCEは経験分布$$\tilde{p}(w|c)$$を，生成されるコーパスの尤度を最大化するパラメータ$$\theta$$をとるモデルの分布$$p_{\theta}(w|c)$$に置き換えて解く．
しかし，これを計算するためには時間的計算量の問題がある．
これを解決するため，NCEは上式をパラメータ$$\theta$$について以下のように変形する:

$$
p(D=0|c, w) = \frac{k \times q(w)}{w_{\theta}(w, c) + k \times q(w)}
$$

$$
p(D=1|c, w) = \frac{u_{\theta}(w, c)}{w_{\theta}(w, c) + k \times q(w)}
$$

ここで，$$k$$個の負例を選択して，$$D$$の条件付き尤度を最大化するように学習できるパラメータ$$\theta$$を有する2値分類問題に帰着する:

$$
L_{NCE_{k}} = \sum_{(w, c)\in D} (log p(D=1|c, w) + k \mathcal{E}_{\bar{w}~q} \log{p(D=0 | c, \vec{w})})
$$

しかし，第二項の期待値の導出は依然として困難である．
よってこの期待値計算を以下のモンテカルロ法による近似で置き換える．

$$
L^{MC}_{NCE_{k}} = \sum_{(w,c)\in D} (\log{p(D=1|c, w)} + k \times \sum^{k}_{i=1, \bar{w}~q} \frac{1}{k} \times \log{p(D=0|c, \bar{w})}) \\
                 = \sum_{(w,c)\in D} (\log{p(D=1|c, w)} + \sum^{k}_{i=1, \bar{w}~q} \log{p(D=0 | c, \bar{w})})
$$

## Negative Sampling
Negative Samplingは，NCEの変形とみなせる．
Negative Samplingは，$$(w, c)$$が与えられた時の条件付き確率を以下のように定義する:

$$
p(D=0 | c,w) = \frac{1}{u_{\theta}(w, c) + 1}
$$

$$
p(D=1 | c,w) = \frac{u_{\theta}(w, c)}{u_{\theta}(w, c) + 1}
$$

これは，$$k$$が語彙数かつ$$q$$が一様分布である場合のNCEに等しい．
