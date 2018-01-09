---
title: "Schools are still segregated"
layout: post
description: "Did segregation really end a generation ago? Here we investigate how it continues, quantitatively."
comments: yes
---
<script src="https://cdn.jsdelivr.net/npm/lazyload@2.0.0-beta.2/lazyload.js"></script>
<meta property="og:image" content="/res/blog_8/thumb2.png">
<html>
  <head>
    <link rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Permanent+Marker">
    <style>
      h1,h2,h3,head,title {
        font-family: 'Permanent Marker',serif;
        color: darkturquoise;
      }
      body {
        <!-- font-family: 'timesnewroman',serif; -->
        color: black;
      }
    </style>
  </head>
</html>
<script type="text/x-mathjax-config">
  MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]}});
</script>
<script type="text/javascript" async
  src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_CHTML">
</script>

## Segregation is dead, long live segregation

When I think of segregation, I think of a historical event. Something begun under the umbrella of government agency and vanquished by collective endeavor. However, the data suggest that despite the end of exogenous state-sponsored inequity, we see a emergent clustering of ethnic groups in America that produces non-homogenous demographic distributions in k-12 education. Below we investigate the scope of this phenomenon using a number of quantitative techniques.

## Demographics are distributed regionally, then locally
Before we evaluate local clustering in school populations, we must begin by decoupling it regional phenomena. Not every state has the same demographics. There exists majority minority states (Hawaii, California, Texas) and majority white states (Vermont, Maine, West Virginia). We are a collective of vaguely autonomous republics and any evaluation of a student body of a particular school must be contextualized by the statistics of the state in which it is located. Below we see the white proportionality of each state:

<iframe class="lazyload"  src="/res/blog_8/map.html" width="100%" height="50%" scrolling="no"></iframe>


## What does modern segregation look like?

Unlike de jure segregation of the past, modern racial clustering is not *usually* a consequence of direct state action, but rather an emergent phenomenon arising from the interface of human behavior and public policy. In fact [the supreme court ruled in 2007](https://en.wikipedia.org/wiki/Parents_Involved_in_Community_Schools_v._Seattle_School_District_No._1) that it was unconstitutional for state actors to forcibly integrate schools - so racial separation today is a passive, bottom-up process.

To examine the face of modern segregation let's consider the following two high-schools : <span style="color:darkturquoise">**Minnetonka High**</span> just outside of Minneapolis, MN and <span style="color:magenta">**Berkmar High**</span> just outside of Atlanta, GA.
Minnetonka is predominantly white and Berkmar is predominantly non-white, but that alone is not enough to indicate *segragation*.


<iframe  class="lazyload" src="/res/blog_8/schools.html" width="100%" height="300px" scrolling="yes"></iframe>

The question is - how well do the demographics of these schools mirror the demographics of the state? Are they representative of a well mixed population?
To gain context, lets consider a <span style="color:darkgrey">**hypothetical distribution**</span> of schools that comes from random resampling of the total state demographics. Here, we would expect some variance in the demographics of the schools as a function of the the error in bootstrap resampling. However, we can see that the distribution remains relatively homogenous with schools neither being purely white nor purely non-white.  Reality is very far from this randomly generated distribution. For both <span style="color:darkturquoise">**Minnesota**</span> and <span style="color:magenta">**Georgia**</span>, we see many schools are not well mixed - the ensemble of schools expresses a heterogeneous range of demographics.

<a href="/res/blog_8/MN_GA_density.png">
<img class="lazyload" src="/res/blog_8/MN_GA_density.png">
</a>﻿

The qualitative difference are clear, but what quantitative metrics can we employ to compare the relative *segregation* of each state.

First lets borrow a tool from information theory [Kullback Leibler divergence](https://en.wikipedia.org/wiki/Kullback%E2%80%93Leibler_divergence). This is a non-parametric calculation of how similar two distribution are. In this case, we can compare how similar the actual demographic distributions of schools in a state are to the distribution that would be generated from pure random sampling.


<video controls loop autoplay width="100%" height="300">
<source src="/res/blog_8/mass_data.webm" autoplay="true" type="video/webm">
<source src="/res/blog_8/mass_data.mp4" autoplay="true" type="video/mp4">

<center>
\[
D_{kL}(P||Q)= \int^{\infty}_{-\infty} p(x)log\frac{p(x)}{q(x)} \, dx
\]
</center>
</video>

Alternatively, we can solve the binomial proportion confidence interval formula for how unlikely randomly sampling a school population would be. In this case $\hat{p}(x)$ is the observed percentage of white people in a school, ${p}(x)$ is the state wide percentage, and n is the number of students in that school. The z score can be understood as a measure of unlikeliness that that school population could occur randomly - or how segregated it is.
<center>
\[
z=\frac{|\hat{p}(x)-p(x)|}{\sqrt{\frac{1}{n}(p(x)*(1-p(x)))}}
\]
</center>
Then we can average that over all k schools in the state.
<center>
\[
\bar{z}=\frac{1}{k}\sum_{j=1}^{k}\frac{|\hat{p}_j(x)-p_j(x)|}{\sqrt{\frac{1}{n}(p_j(x)*(1-p_j(x)))}}
\]
</center>

<a href="/res/blog_8/MN_GA_quant.png">
<img class="lazyload" src="/res/blog_8/MN_GA_quant.png">
</a>﻿

We see that both metric confirm similar trends : that Minnesota is less segregated for its demographics than Georgia.

### Segregation manifests spatially
An important element of these data is the spatial component. See the maps below of the first and fourth most populous states and how their school demographics are distributed spatially.

<a href="/res/blog_8/california.png">
<img class="lazyload"  src="/res/blog_8/california.png">
</a>﻿

<a href="/res/blog_8/ny.png">
<img class="lazyload"  src="/res/blog_8/ny.png">
</a>﻿

New York shows that certain upstate is disproportionately white while the city is disproportionately nonwhite. Interestingly, even within the city there exists demographic heterogeneity manifested as local clustering.

<a href="/res/blog_8/manhattan.png">
<img class="lazyload" src="/res/blog_8/manhattan.png">
</a>﻿

## Verdict : how segregated is your state?

Applying the z-score metric from above we can calculate the average degree of segregation for each state.

<iframe src="/res/blog_8/map3.html" width="100%" height="50%" scrolling="no"></iframe>
<!-- <iframe src="/res/blog_8/states_scatter.html" width="100%"  height="100%"  scrolling="no"></iframe> -->

## What predicts this segregation?
We can consider several covariates with this emergent, de-facto, segregation. First, the demographics of the state matter, as you can't be segregated if you're completely homogenous. Mouse over the state below to reveal their <span style="color:teal">**% white**</span> as well as their <span style="color:magenta">**segregation score**</span>.

<style>.embed-container { position: relative; padding-bottom: 85%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src="/res/blog_8/states_scatter.html" frameborder='0' allowfullscreen scrolling="no"></iframe></div>

However, this variable doesn't have strong predictive power over whether the state is segregated or not. The level of urbanization of the state seems to have more of an impact. Mouse over the state below to reveal their <span style="color:coral">**% urbanized**</span> as well as their <span style="color:slategrey">**segregation score**</span>.

<style>.embed-container { position: relative; padding-bottom: 85%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src="/res/blog_8/states_scatter2.html" frameborder='0' allowfullscreen scrolling="no"></iframe></div>



### Afterword
US government data is highly racialized which lends itself to testing these sorts of hypotheses. For instance, tracking distributions of student family income is a little harder. However, statistics like income could be inferred from proxy variables like the percentage of students qualifying in free lunch programs.  

Still, these data represent quantitatively disprove the hypothesis that segregation is exclusively a top-down phenomenon that was part of the historical record. It still exists today in part because of the emergent clustering produced from humans tendency to self-associate.

Watch the video essay below for further analysis:
<a href="https://www.youtube.com/watch?v=uszdal33edo?rel=0">
<img class="lazyload" src="/res/blog_8/thumb.png">
</a>﻿

<!-- <iframe width="560" height="315" src="https://www.youtube.com/watch?v=uszdal33edo"></iframe> -->

### Notes:
* Data can be found [here](https://ocrdata.ed.gov/); the urbanization and state demographics just from wikipedia
* [Code](https://github.com/NicholasARossi/Segregation) ; maps were made with [basemap](https://matplotlib.org/basemap/) - ideas for the map figures came from [here](http://ramiro.org/notebook/new-york-roads-railways/)
