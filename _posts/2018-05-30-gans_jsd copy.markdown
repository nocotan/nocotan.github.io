---
layout: post
title:  "GANsの目的関数とJS divergence"
date:   2018-05-30 00:00:00
categories: 機械学習
---

Generative Adversarial Networksの目的関数がJensen-Shannon divergenceを用いて表現できることの証明．

## 証明

### Jensen-Shannon Divergence
Jensen-Shannon Divergenceは以下の式で表現される．

$$
\begin{equation}
\tag{1}
D_{JS}(p||q) = \frac{1}{2} D_{KL}(p||\frac{p+q}{2}) + \frac{1}{2} D_{KL}(q||\frac{p+q}{2})
\end{equation}
$$

ここで$D_{KL}$はKL divergenceであり，

$$
\begin{equation}
\tag{2}
D_{KL}(p||q) = \int_x p(x) \log{\frac{p(x)}{q(x)}} dx
\end{equation}
$$

となる．$p_{A} = \frac{p+q}{2}$とおくと，式(1)と(2)から，

$$
\begin{eqnarray}
\tag{3}
D_{JS}(p||q) &=& \frac{1}{2} D_{KL}(p||p_{A}) + \frac{1}{2} D_{KL}(q||p_{A}) \\
&=& \frac{1}{2} \int_x p(x) \log{\frac{p(x)}{p_A(x)}} dx + \frac{1}{2} q(x) \log{\frac{q(x)}{p_A(x)}} dx
\end{eqnarray}
$$

### Generative Adversarial Networks
GANsの目的関数は以下の形で表現される．

$$
\begin{eqnarray}
\tag{4}
\min_{G}\max_{D} L(D, G) &=& \mathbb{E}_{x\sim{p_r(x)}}[\log{D(x)}] + \mathbb{E}_{z\sim{p_z(z)}}[\log{(1-D(G(z)))}] \\
&=& \mathbb{E}_{x\sim{p_r(x)}}[\log{D(x)}] + \mathbb{E}_{x\sim{p_g(x)}}[\log{(1-D(x))}]
\end{eqnarray}
$$

この式について，Discriminatorは最小化を目指し，Generatorは最大化を目指す．
式(4)を変形すると，

$$
\begin{eqnarray}
\tag{5}
L(G, D) &=& \int_x p_r(x)\log{(D(x))} dx + \int_x p_g(x)\log{(1-D(x))} dx \\
&=& \int_x p_r(x)\log{(D(x))} + p_g(x)\log{(1-D(x))} dx
\end{eqnarray}
$$

ここで，Discriminator $D(x)$の最適解を考えてみる．
$\tilde{x} = D(x)$，$a=p_r(x)$, $b=p_g(x)$と置き，インテグラルの中を$\tilde{x}$についての関数$f(\tilde{x})$とすると，

$$
\begin{eqnarray}
\tag{6}
f(\tilde{x}) &=& a\log{(\tilde{x})} + b\log{(1-\tilde{x})} \\
\frac{df(\tilde{x})}{d\tilde{x}} &=& \frac{a}{\tilde{x}} - \frac{b}{1-\tilde{x}} \\
&=& \frac{a-(a+b)\tilde{x}}{\tilde{x}(1-\tilde{x})}
\end{eqnarray}
$$

$\frac{df(\tilde{x})}{d\tilde{x}} = 0$とおくと，

$$
\begin{eqnarray}
\tag{7}
\frac{a-(a+b)\tilde{x}}{\tilde{x}(1-\tilde{x})} &=& 0 \\
a - (a+b)\tilde{x} &=& 0 \\
\tilde{x} &=& \frac{a}{a+b} \\
&=& \frac{p_r(x)}{p_r(x) + p_g(x)}
\end{eqnarray}
$$

式(5)と式(7)から，$D(x)$が最適解$\hat{D}(x)$であるときの$L(G, d)$は，

$$
\begin{eqnarray}
\tag{8}
L(G, \hat{D}(x)) &=& \int_x p_r(x) \log{(\frac{p_r(x)}{p_r(x) + p_g(x)})} + p_g(x)\log{(1 - \frac{p_r(x)}{p_r(x) + p_g(x)})} dx \\
&=& \int_x p_r(x) \log{(\frac{p_r(x)}{2p_A(x)})} + p_g(x)\log{(1 - \frac{p_r(x)}{2p_A(x)})} dx \\
&=& \int_x p_r(x) \log{\frac{p_r(x)}{p_A(x)}} + p_g(x)\log{\frac{p_r(x)}{p_A(x)}} dx - 2\log{2} \\
&=& 2(\frac{1}{2}\int_x p_r(x) \log{\frac{p_r(x)}{p_A(x)}} + p_g(x)\log{\frac{p_r(x)}{p_A(x)}} dx) - 2\log{2} \\
&=& 2D_{JS}(p_r||p_g) - 2\log{2}
\end{eqnarray}
$$

以上から，GANsはDiscriminatorが最適である場合，本質的にはJS divergenceによってデータ分布$p_r$とGeneratorの生成するサンプルの分布$p_g$との距離に基づいて最適化を行なっていることがわかる．
