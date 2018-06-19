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

Animations are a key form of data visualization and yet python doesn't have a lot of really good libraries for it.
Almost everything is driven by the matplotlib library and it doesn't do much but create slideshows.


The basic structure of a matplotlib animation call would be something like this:

{% highlight python3 linenos %}
import numpy as np
from matplotlib import animation, rc
import matplotlib.pyplot as plt

fig_animate, ax = plt.subplots()
data=np.linspace(1,10,100)
ax.set_xscale([0,11])
ax.set_yscale([0,11])

dot = []
# append elements to visualize over time
dot.append(ax.plot([], [], linestyle='none', marker='o', markersize=30, color='teal'))
def animate(z):
    dots[0][0].set_data(data[z],data[z])


    return dots

anim = animation.FuncAnimation(fig_animate, animate,frames=num_frames, blit=False)
plt.tight_layout()
plt.axis('off')
anim.save('media/fluid_scatter.mp4', writer='ffmpeg',fps=60, bitrate=1800)

{% endhighlight %}


```python
ease = Eased(data, input_time_vector, output_time_vector)
out_data = ease.power_ease(n)
```


<iframe src="/res/blog_15/easing_javascript.html" width="100%" height="300px" scrolling="no"></iframe>

```python
ease = Eased(data, input_time_vector, output_time_vector)
out_data = ease.power_ease(n)
```
### Real data : African Conflict

The

<video controls loop autoplay width="100%">
<source src="/res/blog_15/total_dead.mp4" autoplay="true" type="video/mp4">

Your browser does not support the video tag.
</video>

<video controls loop autoplay width="100%">
<source src="/res/blog_15/hist_only.mp4" autoplay="true" type="video/mp4">

Your browser does not support the video tag.
</video>

<a href="/res/blog_15/interpolation_schema.png">
<img src="/res/blog_15/interpolation_schema.png">
</a>﻿

### Conclusion

Watch the video below for a presentation on this material:

<a href="/res/blog_15/python_animate_thumb.png">
<img src="/res/blog_15/python_animate_thumb.png">
</a>﻿


### Notes:
* [Github Repo with animation library](https://github.com/NicholasARossi/Easing-Animations-with-Python)
* African conflict data from [here](https://www.kaggle.com/jboysen/african-conflicts/kernels)