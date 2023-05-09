---
layout: post
title:  Generalization of Cramér-Rao inequality; Chapman–Robbins bound
date:   2023-05-09 12:00:00 +0900
categories: statistics
---
<script async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js" id="MathJax-script"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css" integrity="sha384-zB1R0rpPzHqg7Kpt0Aljp8JPLqbXI3bhnPWROx27a9N0Ll6ZP/+DiW/UqRcLbRjq" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js" integrity="sha384-y23I5Q6l+B6vatafAwxRu/0oK/79VlbSz7Q9aiSZUvyWYIYsd+qj+o24G5ZU2zJz" crossorigin="anonymous"></script>
<!-- Automatically render math in text elements -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.min.js" integrity="sha384-kWPLUVMOks5AQFrykwIup5lo0m3iMkkHrD0uJ4H5cjeGihAutqP0yW0J6dpFiVkI" crossorigin="anonymous"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
  renderMathInElement(document.body, {
    delimiters: [
      {left: "$$", right: "$$", display: true},
      {left: "$", right: "$", display: false},
    ]
  });
});
</script>

The Cramér-Rao inequality is known for providing a lower bound on the variance of an estimator, but appropriate regularity conditions are required for this inequality to hold.

## Regularity conditions

**Definition (Regularity conditions).**
For the probability density function $p(\boldsymbol{x}; \theta)$ parametrized by $\theta \in \Theta$,

1. the support of $p(\boldsymbol{x}; \theta)$ does not depend on $\theta$;
2. for each $\boldsymbol{x}\in\mathcal{X}$, $p(\bm{x};\theta)$ is differentiable with respect to $\theta$;
3. for some $\theta \in \Theta$, there exists $\delta > 0$ and non-negative function $G(\boldsymbol{x}; \theta)$,
    
    $$
    \begin{aligned}
    \left|\frac{p(\boldsymbol{x};\eta) - p(\boldsymbol{x};\theta)}{\eta - \theta}\right| &\leq G(\boldsymbol{x}; \theta), \\
    \mathbb{E}_{\theta}[G(\boldsymbol{x};\theta)] &< \infty,
    \end{aligned}
    $$

    for some $\eta \in (\theta - \delta, \theta + \delta)$;
    
4. for some $\theta \in \Theta$, there exists $\Delta > 0$ and non-negative function $H(\boldsymbol{x}; \theta)$, 

    $$
    \begin{aligned}
    \left|\frac{p(\boldsymbol{x}; \lambda) - p(\boldsymbol{x}; \theta)}{(\lambda - \theta)p(\boldsymbol{x}; \theta)} - \frac{\partial}{\partial\theta}\ln p(\boldsymbol{x}; \theta)\right| \leq H(\boldsymbol{x}; \theta),
    \end{aligned}
    $$

    for some $\lambda \in (\theta - \Delta, \theta + \Delta)$

5. Fisher information $I(\theta)$ satisfies $0 < I(\theta) < \infty$. 

**Example.** Let $x_1,\dots,x_n \sim U(0, \theta)$ for some parameter $\theta \in \Theta = \mathbb{R}_+$. The joint probability density function of $\boldsymbol{x} = (x_1,\dots,x_n)$ is given as

$$
p(\boldsymbol{x}; \theta) = \begin{cases}
1 / \theta^n & (0 \leq \min_i x_i, \max_i x_i \leq \theta), \\
0 & (\text{otherwise}).
\end{cases}
$$

Then, we can see that the support of $p(\boldsymbol{x}; \theta)$ depends on the parameter $\theta$ as

$$\text{supp}\ p(\boldsymbol{x};\theta) = \lbrace\boldsymbol{x}; p(\boldsymbol{x};\theta) > 0\rbrace = \lbrace \boldsymbol{x}; 0 \leq \min_i x_i,\dots,\max_i x_i \leq \theta \rbrace,$$

and violates the regularity conditions.

## Chapman-Robbins bound

The following theorem is a relaxation for the non-regular case of the Cramér-Rao lower bound.

**Theorem (Chapman-Robbins bound).**
For some $\theta \in \Theta$, we assume that there exists $\xi \in \Theta$ satisfying $\text{supp}\ p(\boldsymbol{x}; \xi)\subset \text{supp}\ p(\boldsymbol{x}; \theta)$ and $\xi \neq \theta$. Here, for the unbiased estimator $\hat{g}$ of some $g(\theta)$, we have the following bound.

$$
V_{\theta}(\hat{g}) \geq \sup_{\xi} \frac{\lbrace g(\xi) - g(\theta) \rbrace^2}{V_{\theta}(p(\boldsymbol{x};\xi) / p((\boldsymbol{x}); \theta))}.
$$

**Proof.**
When $V_{\theta}(\hat{g}) = \infty$, it is clear that the inequality holds.
Then, we assume that $V_{\theta}(\hat{g}) < \infty$.
For any $\theta \in \Theta$, we have $\mathbb{E}_{\theta}(\hat{g}) = g(\theta)$ and

$$
\begin{aligned}
\text{Cov}_{\theta}\left(\hat{g}, \frac{p(\boldsymbol{x}; \xi)}{p(\boldsymbol{x}; \theta)} - 1\right) &= \mathbb{E}_{\theta}\left[\left(\hat{g} - g(\theta)\right)\left(\frac{p(\boldsymbol{x}; \xi)}{p(\boldsymbol{x};\theta)} - 1\right)\right] \\
&= g(\xi) - g(\theta).
\end{aligned}
$$

Thus, from the Cauchy–Schwarz inequality,

$$
\begin{aligned}
\left\lbrace\text{Cov}_{\theta}\left(\hat{g}, \frac{p(\boldsymbol{x}; \xi)}{p(\boldsymbol{x}; \theta)} - 1\right)\right\rbrace^2 &\leq V_{\theta}(\hat{g})V_{\theta}\left(\frac{p(\boldsymbol{x}; \xi)}{p(\boldsymbol{x}; \theta)} - 1\right) \\
&= V_{\theta}(\hat{g})V_{\theta}\left(\frac{p(\boldsymbol{x}; \xi)}{p(\boldsymbol{x}; \theta)}\right).
\end{aligned}
$$

Finally, we have

$$
V_{\theta}(\hat{g}) \geq \frac{\lbrace g(\xi) - g(\theta) \rbrace^2}{V_{\theta}(p(\boldsymbol{x};\xi) / p((\boldsymbol{X}); \theta))},
$$

and from $\text{supp}\ p(\boldsymbol{x}; \xi)\subset \text{supp}\ p(\boldsymbol{x}; \theta)$, the Chapman-Robbins bound is obtained.

**Remark.**
For $\xi = \theta + \delta$ with $\delta \neq 0$ and $g(\theta) = \theta$, we have

$$
\begin{aligned}
V_{\theta}(\hat{\theta}) &\geq \frac{\delta^2}{\inf_{\delta \neq 0} V_{\theta}\left(\frac{p(\boldsymbol{x}; \theta + \delta)}{p(\boldsymbol{x}; \theta)}\right)} \\
&= \frac{\delta^2}{\inf_{\delta \neq 0}\mathbb{E}_{\theta}\left[\left\lbrace\frac{p(\boldsymbol{x}; \theta + \delta)}{p(\boldsymbol{x}; \theta)} - 1\right\rbrace^2\right]}
\end{aligned}
$$

from the Chapman-Robbins bound.
Here, we can obtain the Cramér-Rao lower bound by $\delta \to \infty$ under the regularity conditions.