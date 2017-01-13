---
layout: post
title:  "潜在的意味解析における特異値分解"
date:   2017-01-12 20:00:00
categories: 機械学習
---

潜在的意味解析(Latent semantic analysis: LSA)は1988年に自然言語処理及び情報検索分野の技術として開発された.
当初、LSAは特異値分解(Singular value decomposition: SVD)によって定式化された.

## 特異値分解

行列Xを $ X = USV^T $ を満たす行列U, S, Vへと分解する.
- Sは対角行列で、対角要素は特異値と呼ばれる
- U, S, Vの各列ベクトルを、特異値が大きい順にK個用いて、新たに行列 $ \tilde{U}, \tilde{S}, \tilde{V} $を作る
- $ \tilde{X} = \tilde{U}\tilde{S}\tilde{V}^T $ とすることで $ \tilde{X} $ を得る.
- ここで、$ \tilde{X} $ はXの低ランク近似行列(low rank approximation)である.
- この時、行列のランクはKとなる  
  
  
例として、以下に示すXについて特異値分解を試行する.

<table>
<caption>X</caption>
<tr><th>.</th><th>drive</th><th>automobile</th><th>car</th><th>play</th><th>music</th></tr>
<tr><th>文書1</th><td>2</td><td>3</td><td>0</td><td>0</td><td>0</td></tr>
<tr><th>文書2</th><td>2</td><td>0</td><td>2</td><td>0</td><td>0</td></tr>
<tr><th>文書3</th><td>0</td><td>0</td><td>0</td><td>2</td><td>2</td></tr>
<tr><th>文書4</th><td>0</td><td>0</td><td>0</td><td>3</td><td>1</td></tr>
</table>

#### 行列X

``` python
X = np.array([[2,3,0,0,0],[2,0,2,0,0],[0,0,0,2,2],[0,0,0,3,1])
```

例えば、行列Xにおいて、文書1のcarの出現頻度は0である.よって、この行列からcarを検索したとしても、文書1を得ることはできない.
同様に、automobileで検索したとしても、文書2を見つけることはできない.
そこで、特異値分解によって潜在的共起性を抽出する.

#### 特異値分解

``` python
U, S, V = np.linalg.svd(X, full_matrices=True)
```

特異値分解を実行すると、以下の行列が得られます.  

<table>
<caption>U</caption>
<tr><td>0.0</td><td>0.88</td><td>-0.48</td><td>0.0</td></tr>
<tr><td>0.0</td><td>0.48</td><td>0.88</td><td>0.0</td></tr>
<tr><td>0.66</td><td>0.0</td><td>0.0</td><td>-0.75</td></tr>
<tr>><td>0.75</td><td>0.0</td><td>0.0</td><td>0.66</td></tr>
</table>

<table>
<caption>S</caption>
<tr><td>4.1</td><td>0.0</td><td>-0.0</td><td>0.0</td></tr>
<tr><td>0.0</td><td>3.9</td><td>0.0</td><td>0.0</td></tr>
<tr><td>0.0</td><td>0.0</td><td>2.4</td><td>-0.0</td></tr>
<tr>><td>0.0</td><td>0.0</td><td>0.0</td><td>0.9</td></tr>
</table>

<table>
<caption>V</caption>
<tr><td>7.1e-17</td><td>-4.7e-17</td><td>-7.1e-17</td><td>0.86</td><td>0.5</td></tr>
<tr><td>0.69</td><td>0.67</td><td>0.25</td><td>0.0</td><td>0.0</td></tr>
<tr><td>0.32</td><td>-0.6</td><td>0.73</td><td>0.0</td><td>0.0</td></tr>
<tr>><td>3.1e-16</td><td>-2.1e-16</td><td>-3.1e-16</td><td>0.5</td><td>-0.86</td></tr>
<tr>><td>0.63</td><td>-0.42</td><td>-0.63</td><td>-1.4e-16</td><td>4.1e-16</td></tr>
</table>

### 低ランク近似行列
特異値が大きい順にK(=2)個抜き出す.

```python
k = 2
U2 = U[:, :k]
S2 = np.diag(S)[:k, :k]
V2 = V[:k, :]

X2 = (U2.dot(S2).dot(V2))
```

こうして得られた $ \tilde{X} $ は以下のようになる.  
※ここでは簡単のため、負の値を0とする.
<table>
<caption> $ \tilde{X} $ </caption>
<tr><th>.</th><th>drive</th><th>automobile</th><th>car</th><th>play</th><th>music</th></tr>
<tr><th>文書1</th><td>2.4</td><td>2.3</td><td>0.85</td><td>0.0</td><td>0.0</td></tr>
<tr><th>文書2</th><td>1.3</td><td>1.27</td><td>0.47</td><td>0.0</td><td>0.0</td></tr>
<tr><th>文書3</th><td>0.0</td><td>0.0</td><td>0.0</td><td>2.4</td><td>1.3</td></tr>
<tr><th>文書4</th><td>0.0</td><td>0.0</td><td>0.0</td><td>2.7</td><td>1.6</td></tr>
</table>

以上の表から、文書1,文書2共にautomobile,
carの要素が正の値を取っていることがわかる。つまりdriveという単語の共起性からこの二つの単語の潜在的共起性が抽出されたことがわかる.  

## まとめ
このように、元の行列の低ランク近似行列を用いることで、文章において、(一見すると)共起していない単語の共起性を抽出することができる.
しかし、この手法では、特異値分解の特徴から、各トピックは互いに直行した概念となってしまう.したがって、この手法では多少似た性質を持つトピックを表現することができず、柔軟性に乏しい.  
 以上の問題を解決するため、1998年以降、確率モデル、階層ベイズモデルによって再度定式化された.  
以下に、本記事で用いたコードをまとめる.

``` python
# -*- coding: utf-8 -*-
import numpy as np

X = np.array([[2,3,0,0,0],[2,0,2,0,0],[0,0,0,2,2],[0,0,0,3,1]])
U, S, V = np.linalg.svd(X)

k = 2
U2 = U[:, :k]
S2 = np.diag(S)[:k, :k]
V2 = V[:k, :]
X2 = (U2.dot(S2).dot(V2))
print(X2)
```
