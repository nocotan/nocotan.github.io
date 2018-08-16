---
layout: post
title:  "Metric Learning from Probabilistic Labels"
date:   2018-08-14 20:00:00
categories: 機械学習
---
[paper link](http://www.kdd.org/kdd2018/accepted-papers/view/metric-learning-from-probabilistic-labels)

<img width="703" alt="スクリーンショット 2018-08-14 2.42.54.png (97.6 kB)" src="https://img.esa.io/uploads/production/attachments/9763/2018/08/14/40745/8e944821-ca60-4d7c-9b06-fe8fa24ebfdd.png">

# Abstract
既存のmetric learningの研究は，ラベルが決定的であると仮定している．しかし，現実世界には，ラベルが確率的である場合も多い．既存の研究を単純にそのようなケースに適用しても基本的にはうまくいかないため，本論文ではラベルが確率的な場合に効果的に距離指標を学習する手法を提案する．また，手法は2つの異なる確率的ラベルの問題設定についてのそれぞれについて提案されている．

## 貢献
* Instance-wise probabilistic labelsの問題設定下でのmetric learningのための学習手法であるinstance-level metric learning mechanism (InML)を提案．
* group-wise probabilistic labelsの問題設定下でのmetric learningのための学習手法であるgroup-level metric learning (GrML)を提案．

## 手法の説明
### 問題設定
$u$次元特徴ベクトル$x_i\in{\mathbb{R}^u}$のインスタンス集合$X$が与えられる．metric learningの目的は，任意のインスタンスペア間の有用な距離指標の学習を行うことである．

$$
d(x_i, x_j) = (x_i - x_j)^TW(x_i - x_j) = (x_i - x_j)^TM^TM(x_i - x_j)
$$

ここで，$d(x_i, x_j)$は半正定値行列$W$をパラメータにとる($W = M^TM$かつWは学習対象のパラメータ)．
ラベルが決定的である場合，こうした距離函数を学習する手法は数多く存在するが，ラベルが確率的である場合についての研究はあまり多くない．論文では，以下の二つのケースについて考える:
* instance-wise probabilistic label: 各インスタンス$x_i \in{X}$に確率的ラベル$c_i \in [0, 1]$が対応すると仮定する．ここで$c_i$は$x_i$がpositive classである確率を表す．
* group-wise probabilistic label: データセット$X$が$K$個の部分集合から構成され，各グループ$X_k$が確率$\pi_k \in [0, 1]$に対応すると仮定する．ここで$\pi_k$は$X_k$のインスタンスがpositive classに属する割合を表す．

## Metric Learning from Instance-wise Probabilistic Labels
instance-wise probabilistic labelsから距離指標を学習するInMLを提案する．

この問題設定で最もナイーブなmetric learningの方法は，確率的ラベルを閾値をもとに決定的ラベルとして扱い，既存のmetric learningの手法を適用することである．しかし，確率的ラベルは一般的に豊富な情報量を持つのにも関わらず，決定的ラベルへの変換の際に情報の欠落によって距離性能の劣化に陥る可能性がある．また，現実的には，適切な閾値の設定は難しい．よって，インスタンスとそれに対応する確率的ラベルから直接距離函数を推定する手法が必要となる．これを達成するため，まずはじめに距離制約の構築を目指す．

### Distance Constraint Construction
本論文では，$c_1 > c_2 > \cdots > c_{N-1} > c_N$を仮定する．最初に，部分的に順序づけされたtriplet集合を作る:

$$
R = (x_i, x_j, x_k), \ \ \ 1 \leq i \neq j \neq k \leq N, \ \ j < k
$$

各triplet $(x_i, x_j, x_k)$について，$j<k$から$c_j \leq{c_k}$である．
$c_i$, $c_j$および$c_k$の関係から，triplet集合$R$を次の四つの部分集合に分割することができる$(R = R_1 \cup R_2 \cup R_3 \cup R_4)$:

* $R_1 = (x_i, x_j, x_k), 1 \leq i < j < k \leq N$．
* $R_2 = (x_i, x_j, x_k), 1 \leq j < k < i \leq N$
* $R_3 = (x_i, x_j, x_k), 1 \leq j < i < k \leq N, c_j > c_i > (c_j + c_k) / 2$
* $R_4 = (x_i, x_j, x_k), 1 \leq < j < i < k \leq N, (c_j + c_k)/2 > c_i > c_k$

### Optimization Formulation
提案手法では，metric learningの過程をヒンジ損失を用いたマージン最大化の最適化問題として定式化する．
$R'_1 = R_1 \cup R_3$かつ$R'_2 = R_2 \cup R_4$とする．各triplet $(x_i, x_j, x_k) \in \mathbb{R}$について，距離制約を再定義する:

$$
\begin{cases}
d(x_i, x_j) + g \leq d(x_i, x_k) & if (x_i, x_j, x_k) \in R'_1 \newline
d(x_i, x_k) + g \leq d(x_i, x_j) & if (x_i, x_j, x_k) \in R'_2 \newline
\end{cases}
$$

$g$はマージンについての正則化パラメータ．上記の制約の下，次のヒンジ損失を最小化する:

$$
\min_W \sum_{(x_i, x_j, x_k)\in R'_1} \max(0, d(x_i, x_j) - d(x_i, x_k) + g) + \\ \sum _{(x _i, x _j, x _k) \in R'_2} \max(0, d(x_i, x_k) - d(x_i, x_j) + g) + \alpha ||W|| _*
$$

ここで，最適化問題は以下のように定式化される:

$$
\begin{eqnarray}
\min_{W, \xi^1_{ijk}, \xi^2_{ijk}} \sum_{(x_i, x_j, x_k)\in R'_1} \frac{1}{|R'_1|} \xi^1 _{ijk} + \sum _{(x_i, x_j, x_k) \in R'_2} \frac{1}{|R'_2|} \xi^2 _{ijk} + \alpha ||W|| _* \newline
s.t. \forall{(x_i, x_j, x_k) \in R'_1} \ \ \ \max(0, d(x_i, x_j) - d(x_i, x_k) + g) \leq \xi^1 _{ijk} \newline
\forall{(x_i, x_j, x_k) \in R'_2} \ \ \ \max(0, d(x_i, x_k) - d(x_i, x_j) +g) \leq \xi^2 _{ijk} \newline
\forall{(x_i, x_j, x_k) \in R'_1} \ \ \ \xi^1 _{ijk} \geq 0 \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \newline
\forall{(x_i, x_j, x_k) \in R'_2} \ \ \ \xi^2 _{ijk} \geq 0 \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \newline
\end{eqnarray}
$$

## Metric Learning from Group-wise Probabilistic Labels
group-wise probabilistic labelsの問題設定下でのmetric learningのための学習手法であるgroup-level metric learning (GrML)を提案．

$K$個のグループから成るインスタンス集合$X$が与えられる．
$X_k$の各インスタンスペア$(x^k_i, x^k_j)$について，二つのインスタンスが似ているかどうかを示すラベル$y^k_{ij}$があると仮定する．
$X_k$に属するインスタンスペアがラベル1をとる割合を示す確率を以下に表す．

$$
\tilde{\pi}_k = 1 - \frac{2|X_k| \pi_k(1 - \pi_k)}{|X_k| - 1}
$$

インスタンスペア$(x^k_i, x^k_j)$と対応する未知のラベル$y-k_{ij}$をモデル化する:

$$
Pr(y^k_{ij} | x^k_i, x^k_j; M, b) = \frac{1}{1 + \exp (-y^k_{ij}(d(x_i, x_j) - b))}
$$

$b$は閾値として動作するバイアス．
最適化問題は次のように定式化される:

$$
\begin{eqnarray}
\min_{P, M} = \sum^K_{k=1} \sum_{i<j} \frac{2p^k_{ij}}{|X_k|(|X_k|-1)}\log (1 + \exp(-d(x^k_i, x^k_j) - b)) \newline
+\sum^K_{k=1}\sum_{i<j}  \frac{2(1-p^k_{ij})}{|X_k|(|X_k|-1)}\log (1 + \exp(d(x^k_i, x^k_j) - b)) \newline
\sum^K_{k=1}\frac{2T}{|X_k|(|X_k|-1)}\sum_{i<j}(p^k_{ij}\log p^k_{ij} + (1-p^k_{ij})\log(1-p^k_{ij})) + \frac{1}{2}||M||^2_F \newline
s.t. \sum_{i<j} \frac{2p^k_{ij}}{|X_k|(|X_k|-1)}
\end{eqnarray}
$$

$T$はペナルティパラメータ，$P$はインスタンスペアがとる確率の集合．

最適化は次の2ステップから成る．
* step1: $P$を固定化して$M$を更新
* step2: $M$を固定化して$P$を更新

<img width="440" alt="スクリーンショット 2018-08-14 4.58.14.png (76.9 kB)" src="https://img.esa.io/uploads/production/attachments/9763/2018/08/14/40745/6421990e-f74d-4cb4-9609-4be56e8c661a.png">

# 実験
Instance-wise & group-wiseの両方の問題設定について実験．
データセットはTable. 1に示す．

<img width="440" alt="スクリーンショット 2018-08-14 5.00.05.png (51.8 kB)" src="https://img.esa.io/uploads/production/attachments/9763/2018/08/14/40745/96e64928-7bd4-4fee-a28b-9cb2305ee837.png">

<img width="666" alt="スクリーンショット 2018-08-14 5.01.58.png (150.9 kB)" src="https://img.esa.io/uploads/production/attachments/9763/2018/08/14/40745/3284a4f7-2a17-4642-93f8-96b3e9a7ff21.png">

# 考察
ラベルが確率的である場合のmetric learningについては研究が少なそう．
group-wiseの応用は，privacy preservingとかの文脈で使えそう．
