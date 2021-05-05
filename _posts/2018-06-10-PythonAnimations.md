---
title: "Easing Animations with Python"
layout: post
description: "Making smooth, animated dataviz projects with python "
comments: yes
---
<link rel="stylesheet" href="/res/blog_15/manni.css">
<style>
      h1,h2,h3,head,title {
        font-weight: 1000;
        outline-color: black;
        color: black;
        background-color: #e684ae;
}
		iframe {
			width: 10px;
			min-width: 100%;
			*width: 100%;
		}
</style>

<a href="/res/blog_15/africa_animated (2).svg">
<img src="/res/blog_15/africa_animated (2).svg">
</a>﻿

### Building Animations in Python

While they may be over-hyped these days, animations are a key form of data visualization. Some things just look better changing over time. Also, while some languages like d3.js or processing put a focus on animations first, Python remains relatively clunky to use if you want to make smooth animations that pop.

Take for instance an example animation like the one created exclusively in python below:


{% highlight python3 linenos %}
import matplotlib.pyplot as plt
import numpy as np
from matplotlib import animation
plt.close('all')
colors = [ 'teal']

fig_animate, ax = plt.subplots()
dots = []

dots.append(ax.plot([], [], linestyle='none', marker='h', markersize=30, color=colors[0]))

ax.set_xlim([-1,11])
ax.set_ylim([-1,11])

data=np.round(3*np.sin(np.linspace(0,6*np.pi,100))+5)

def animate(z):
    dots[0][0].set_data(data[z],data[z])
    return dots

anim = animation.FuncAnimation(fig_animate, animate, frames=len(data), blit=False)

ax.set_facecolor('#d3d3d3')
writer = animation.writers['ffmpeg'](fps=10)
dpi=300

anim.save('dot.mp4', writer=writer,dpi=dpi)
{% endhighlight %}

![dots](/res/blog_15/gif.gif)


### The power of Easing

We see that indeed things are moving over time, but they don't have that orgainic feel that we've come to expect from visual data.

The big thing absent here is **easing**. Easing is the process of interpolating between two points in order for the animation to no longer look jerky. Use the interactive below to explore a few differnt types of easing.


<iframe src="/res/blog_15/easing_javascript.html" width="100%" height="300px" scrolling="no"></iframe>


We see intuitively than any form of interpolation between point A and point B make the whole thing feel a lot more natural - it takes away the appearance of a slide show.

### Implementing Easing in Python

I wrote a small packages that facilitates easing in python by adding differnt types of smoothing between datapoints.

This is how it works:

<a href="/res/blog_15/interpolation_schema.png">
<img src="/res/blog_15/interpolation_schema.png">
</a>﻿

All you have to do to make it work is pass in an original datavector, it's time vector and and output vector. Then execute one of the interpolation functions on it and it will return nice interpolated data:

```python
ease = Eased(data, input_time_vector, output_time_vector)
out_data = ease.power_ease(n)
```

All the code necessary to implement this can be found [here](https://github.com/NicholasARossi/Easing-Animations-with-Python)

### Applying our tools to African Conflict Data

So what does this stuff look like on real data? Below are some graphs that show violent conflict within the african conflict over time with various types of easing.

The first is just a barchart of the cummulative dead over time:

<video controls loop autoplay width="100%">
<source src="/res/blog_15/total_dead.mp4" autoplay="true" type="video/mp4">

Your browser does not support the video tag.
</video>

The second is a distribution of the fatalities per event over time:



<video controls loop autoplay width="100%">
<source src="/res/blog_15/hist_only.mp4" autoplay="true" type="video/mp4">

Your browser does not support the video tag.
</video>

This final animation brings several types together and shows how you can impliment but 1d and 2d easing.

<video controls loop autoplay width="100%">
<source src="/res/blog_15/conflict_upload.webm" autoplay="true" type="video/webm">
<!-- <source src="/res/blog_15/conflict_upload.mp4" autoplay="true" type="video/mp4"> -->

Your browser does not support the video tag.
</video>


### Conclusion

Watch the video below for a presentation on this material:

<a href="https://www.youtube.com/watch?v=6GxWgJATj78">
<img src="/res/blog_15/python_animate_thumb.png">
</a>﻿


### Notes:
* [Github Repo with animation library](https://github.com/NicholasARossi/Easing-Animations-with-Python)
* African conflict data from [here](https://www.kaggle.com/jboysen/african-conflicts/kernels)