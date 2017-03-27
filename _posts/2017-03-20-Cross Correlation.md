---
title: "Understanding Cross-Correlation"
layout: post
description: "What happens when two things are related, but only after some time delay?"
comments: yes
---
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
</script>
<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_CHTML">
</script>


### Some things take time

Hey [look at this graph](https://www.youtube.com/watch?v=sIlNIVXpIns)!
<center>
<a align="center" href="/res/blog_5/graph_1.png">
<img  src="/res/blog_5/graph_1.png">
</a>﻿
</center>
We see that the daylight in Boston and Paris follow the same basic trajectories, but the exact brightness in Boston isn't a great predictor of the brightness in Paris. Taken a step further, if we "flatten" the data to remove the time dimension and plot the brightness in Paris vs that of Boston we get the following. Each point on the circle represents the brightness in Paris and the brightness in Boston at a specific time.

<video controls width="100%">
  <source src="/res/blog_5/flattened_1.webm" type="video/webm">
  <source src="/res/blog_5/flattened_1.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>

<!-- <center>
<a align="center" href="/res/blog_5/graph_2.png">
<img src="/res/blog_5/graph_2.png">
</a>﻿
</center> -->
An interesting graph that contains some information, but isn't as informative as it could be. The [degeneracy](https://en.wikipedia.org/wiki/Degenerate_conic) of the data makes each value non-unique, preventing us from determining the exact brightness of Paris given Boston and vice-versa.



There **is** an answer to this problem that allows us to relate these two signals in a more meaningful way : compare them after a **time-shift**. If we compare Paris daylight to Boston 6 hours later, we find that there is much greater correlation between the two variables. In plain language, you're comparing points from the two trajectories at different times.

<video controls width="100%">
  <source src="/res/blog_5/flattened_2.webm" type="video/webm">
  <source src="/res/blog_5/flattened_2.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>
<!-- <a align="center" href="/res/blog_5/graph_3.png">
<img src="/res/blog_5/graph_3.png">
</a>﻿ -->

This operation is the essence of [cross-correlation](https://en.wikipedia.org/wiki/Cross-correlation). How much do two signals correlate with each other as you shift one of them in time. We call the magnitude of the shift $\tau$.
<center>
$$(f*g)(\tau) = \int_{-\infty}^{\infty} f^{}g(t+\tau)dt$$
</center>



Below we see the full cross-correlation of a sine and cosine wave as we move the cosine wave and keep the other fixed. We see that there is a peak cross-correlation at $ \tau=\frac{\pi}{2}$ and the signals are most anti-correlated at $ \tau=\frac{3\pi}{4}$. If you shift the signal backward or forward tau can be positive or negative (g is leading or lagging).


<video controls width="100%">
  <source src="/res/blog_5/true_1.webm" type="video/webm">
  <source src="/res/blog_5/true_1.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>

### What happens with noisy data?
Cross-correlation is an extremely powerful method of analysis to use on noisy data. Just adding bit of waggle to the sine and cosine waves from above gets similar results.
<video controls width="100%">
  <source src="/res/blog_5/true_2.webm" type="video/webm">
  <source src="/res/blog_5/true_2.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>

More importantly, the analysis works even when the data is **SUPER** noisy. Consider the following set of stochastic differential equations representing [Ornstein–Uhlenbeck processes](https://en.wikipedia.org/wiki/Ornstein%E2%80%93Uhlenbeck_process):
<center>
$$\frac{dX}{dt} = -\theta_{x} X_{t} dt+\sigma_{x} \eta_{x}$$
$$\frac{dY}{dt} = (gX_{t}-\theta_{y}Y_{t})dt+\sigma_{y} \eta_{y}$$
</center>

Here $\theta$ represents the inverse of the correlation time of the signal while $\sigma$ represents the standard deviation of the trajectory. In this case, I've modeled Y as having some linear dependance on X, scaled by the gain "g".
These equations could model any number of stochastic interactions (gene expression, weather patterns) but we'll use them to imagine an example from the world of finance.
<center>
<a href="/res/blog_5/Econ.png">
<img src="/res/blog_5/Econ.png">
</a>﻿
</center>
Here we see two time traces representing the value of the Dollar and the value of the Euro. Despite the fluctuations in both of the signals, there seems to be some interdependency. However, the directionality of this relationship isn't entirely apparent at first glance. We don't know if the Dollar affects the value of the Euro or vice-versa. We turn to our new favorite technique - Cross-Correlation!!!!

<video controls width="100%">
  <source src="/res/blog_5/true_4.webm" type="video/webm">
  <source src="/res/blog_5/true_4.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>

It becomes apparent that as we shift the Euro time trace, the two trajectories become more most correlated as $\tau = - 18$ days. The value of the dollar determines (in part) that of the Euro. If this simulated data is to be believed (*wink*), that means we should BUY BUY BUY Euros if the dollar spikes up, alternatively we should SELL SELL SELL Euros if the Dollar drops in value.

Clearly real economic markets are more complicated than this as the regulation is not unilateral (ie the Euro value will feed back and affect the dollar value). But this analysis does lend insight into how we can take seemingly unrelated stochastic signals and find the underlying correlations.


### Note: Numerical Cross-Correlation is data hungry
If the signal to noise ration is high in a given relationship between two time-series, it may require a relatively long data set in order to detect any apparent cross-correlation. The animation bellow illustrates this point by calculating the numerical cross correlation of two time traces (blue dots) and comparing them to the exact analytical solution to the cross-correlation of the two functions.
<video controls width="100%">
  <source src="/res/blog_5/true_5.webm" type="video/webm">
  <source src="/res/blog_5/true_5.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>
In order to get the numerical calculations to converge to the exact solutions we need a relatively long simulation. This can be **very** problematic when calculating cross-correlations using real data sets as it's possible a given time-series of collected data is insufficient to effectively calculate any underlying phenomena. However, the time it takes to converge to the exact solution is a function of the signal to noise ratio and as such shorter data sets will be sufficient for less noisy data.

### Conclusion
Cross-correlation is an essential data science technique to understand the flow of information in dynamical systems including [genetic networks](http://www.nature.com/ng/journal/v40/n12/abs/ng.281.html), [finance](https://arxiv.org/abs/1002.0321) and the [climate ](http://www.pnas.org/content/108/42/17296.full). Always remember, sometimes things take time.

## notes:

* I hacked this together on a couple jupyter notebooks, if you're curious as to how I made the animations you can find the code [here](https://github.com/NicholasARossi/xcor_animations)

* Cross-correlation does assume the underlying phenomena are [stationary](https://en.wikipedia.org/wiki/Stationary_process) and [ergodic](https://en.wikipedia.org/wiki/Ergodicity). There are work arounds for these assumptions but they are usually pretty messy.