---
title: "Global Trends in Cigarette Consumption"
layout: post
description: "Are your country's smokers casual or hardcore? Here, I investigate the differences in prevalence of smoking and how many cigarettes those smokers consume among different nations."
comments: yes
---


<style>
  h1,h2,h3,head,title {

    font-color: black;
    color: black;
    background-color: #EF6648;
  }
  <!-- header{
    background-color: #d3d3d3;
  } -->

</style>

## Smoking is a lot more prevalent in certain places



<img src="/res/blog_3/smoker.jpg" align="left" width="30%" >

There are certain countries that have a much larger smoking population than others - ranging from countries like Ethiopia that have less than 5% of a smoking population to countries like Jordan where it's closer to 40%.
<!-- <div class="full zoomable"><img src="/res/blog_3/Percentage_smokers.PNG"></div> -->
<!-- ![Percentage Smokers](/res/blog_3/Percentage_smokers.PNG) -->
<a href="/res/blog_3/Percentage_smokers.png">
<img src="/res/blog_3/Percentage_smokers.png">
</a>﻿

## Certain countries have super intense smokers

Just looking at the average number of cigarettes that a smoker consumes per country, it's clear to see that not everyone smokes the same way. While we can imagine that there is a distribution of cigarette consumption among smokers in a country, just looking at the mean consumption per smoker shows that there are countries like Slovenia and Bulgaria where smokers consume on average just under 40 cigarettes per day (about 2 packs).
![Cigarettes per Smoker](/res/blog_3/cigarettes_per_smoker.png)



## Countries that have the most smokers do not necessarily smoke the most

The graph below show the weak correlation between the the percentage of smokers in a country and the average number of cigarettes they smoke per day (Spearman's R: 0.36, p value=0.0001).

![Relationship](/res/blog_3/comparison.png)

A good example the disparity between frequency and volume France vs the USA. [Stereotypes](/res/blog_3/letired.png) would have us believe that everyone in France smokes. Indeed, smoking is more common France - about ~27.6% of people smoke in France compared to ~17.2% in the states. However, Americans always believe that if something is worth doing, it's worth overdoing - so american smokers consume on average 17 cigarettes per day (there are 20 in a pack) while French people struggle to consume just under 10 on average. USA! USA! USA!



The chart below shows the countries where smoking is the most frequent, and the countries that have the most *committed* smokers. There is some overlap, but the rankings are very different for the two metrics.

![Top Countries](/res/blog_3/cig_subplots.png)

## Why cigarettes per smoker and not cigarettes per capita?

Well simply put cigarette consumption follows a [non-normal distribution](https://en.wikipedia.org/wiki/Multimodal_distribution), therefore the "mean" doesn't have much significance. To use (albeit crude) statistics humor - humans have on average one testicle and one breast which doesn't cary much information about how human anatomy is distributed! Similarly there are people that smoke and those that don't - it's best to understand how those groups function independently.

## Notes for Nerds:

1. The data came from the [WHO](http://apps.who.int/gho/data/node.sdg.3-a-viz?lang=en) as well as [wikipedia](https://en.wikipedia.org/wiki/List_of_countries_by_cigarette_consumption_per_capita)

2. Analysis was done with Python; visualizations with [vincent](http://vincent.readthedocs.io/en/latest/) and [seaborn](http://stanford.edu/~mwaskom/software/seaborn/). Maps touched up with Illustrator.

3. Code and munged data available [here](https://github.com/NicholasARossi/Global-Smoking-Analysis/tree/master)

4. Disregard cigarettes, acquire dry land
![Gentleman Guppy](/res/blog_3/the_gentleman_guppy.gif)
