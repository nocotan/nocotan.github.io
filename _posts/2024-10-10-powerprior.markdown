---
layout: post
title:  Power Prior in Bayesian Statistics
date:   2024-10-10 12:00:00 +0900
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

The power prior in Bayesian statistics is used to incorporate historical or external data into the current analysis in a flexible and controlled manner.
It was introduced to address situations where prior data are available, but their relevance to the current study might be uncertain or partial. The power prior allows statisticians to adjust the influence of historical data on the current analysis by raising the likelihood function of the historical data to a power between 0 and 1.


## Definition
Suppose that
- current data: $D = (X, y)$
- historical data: $D_0 = (X_0, y_0)$
- parameter of intereset: $\theta$
- $\pi_0(\theta)$: initial prior
- power parameter: $\alpha_0 \in [0, 1]$

The power prior for $\theta$ is defined as
$$
\pi(\theta \mid D_0, \alpha_0) \propto L(\theta \mid D_0)^{\alpha_0}\pi_0(\theta),
$$
where $L(\theta \mid D_0)$ is the likelihood function based on the historical data $D_0$.

## Resulting Posterior
The posterior distribution of $\theta$ given both the current and historical data is
$$
\begin{align*}
\pi(\theta \mid D, D_0, \alpha_0) &\propto L(\theta \mid D) \times \pi(\theta \mid D_0, \alpha_0) \\
&= L(\theta \mid D)\times L(\theta \mid D_0)^{\alpha_0}\times \pi_0(\theta).
\end{align*}
$$

We can see that the power parameter $\alpha_0$ adjusts the influence of the historical data.
- $\alpha_0 = 0$:  No influence from $D_0$, and the prior reduces to $\pi_0(\theta)$.
- $\alpha_0 = 1$: The historical data $D_0$ is fully incorporated.
- $\alpha_0 \in (0, 1)$: Partial influence, and discounting $D_0$ accordingly.

By adjusting $\alpha_0$, we can control how much the historical data impacts the prior, allowing for uncertainty about its relevance.

## References
- Ibrahim, J. G., & Chen, M.-H. (2000). "Power prior distributions for regression models." Statistical Science, 15(1), 46–60.