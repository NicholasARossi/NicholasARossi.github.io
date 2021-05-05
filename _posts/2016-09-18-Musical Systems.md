---
title: "Musical Systems Analysis"
layout: post
photo_url: "/res/blog_2/piano.JPG"
description: "A network level study of the structure of pop music"
comments: yes

---
## Intro
A motif is a recurring element - a pattern that is found more often than would occur by chance. They are essential in all ordered systems, from genetic networks to the patterns of social interaction. Today we're going to talk about their role in music while we reviewing the ways that you can teach robots to write songs.


## Roll the dice, maybe it'll sound good
For the purposes of this post, we're going to understand a musical work as a simple sequence of notes. How we move from one note to the next is what produces this emergent "musicality". The foundation of most robot-composers like [Emily Howell](https://en.wikipedia.org/wiki/Emily_Howell) are [markov chains](https://en.wikipedia.org/wiki/Markov_chain). For more information on what those are, and to see some of the foundational code that made this post possible, read [Victor Powell](http://setosa.io/ev/markov-chains/), he is master of us all. Markov chains can be used to create biased random walks between notes which, absent of any grand form, can still produce musicality.
<p>
The network bellow shows one such markov chain that hops around the pentatonic scale. This scale is nice for generating random music because it lacks any dissonant intervals.
</p>

![pentatonic scale](https://upload.wikimedia.org/score/7/5/756b1ensi3iu6vn4elyyb4uwcgn0z1u/756b1ens.png)

<p> This biased random walk reveals that certain notes are favored, a phenomenon emerging from the probabilty weights between the jumps. Play with the speed and unmute it to hear this network performed. Note, I added some random rhythms on top just to keep the notes interesting (quarter and eight notes, 50% probability each)</p>

<!-- How markov chains produce distributions -->
<iframe src="/res/blog_2/random-sequence-markov.html" width="100%" height="400"  scrolling="no"></iframe>

## Let's go data mining!
So the figure above showed that a biased random network can generate the semblance of musicality. However, the weights between the nodes (or the probability of each transition) are super important in making your robo-music not sound like utter garbage. In order to "discover" the appropriate weights, I told my computer to scrape a bunch of songs from the web, analyze them, and tell me how we transition from one note to the next. It was [complicated](/res/blog_2/algorithm.png). Below we see the note and interval distributions from  ~2000 pop songs.
![distributions](/res/blog_2/int_dist.png)

These are produced from what might come from a summing up a bunch of histograms like the animated one above for a whole slew of pop songs. The interval diagram (the distance from one note to the next) shows that clearly not moving at all (staying on the same note) is the most favored transition. This is emphasized by looking at our case-study song, Bad romance by Lady Gaga, and fitting a few different distributions to show how we move throughout this song.

<center><img src="/res/blog_2/romance2.png" alt="Romance " style="width: 50%;"/></center>

Say what you will, but i'm calling that as an exponential distribution. This fact can be used to inform our procedural music model later on.


## Je veux ton amour et je veux ta revanche
There is an important element that these simple random walks can't quite capture though : the motif. We can think of motifs in music as hooks. The melody you'll hum when you think of the song. Take Bad Romance by Lady Gaga, the hook is [unforgetable](https://www.youtube.com/watch?v=Rwp8ZlYkg_I). However let's try to generate it from a markov chain:
<!-- Example Motif From mother monster -->
<img src="/res/blog_2/gaga.png" alt="Gaga Fugue" style="width: 200px;"/>
<!-- ![Gaga Fugue](/res/blog_2/gaga.png){ width: 50px; } -->
<iframe src="/res/blog_2/markov.html" width="100%" height="400"  scrolling="no"></iframe>

Using all of my stats power, I can say (not counting rhythm) that even with the optimal weights we're still looking at ~3% chance that the hook will be generated if you start on the tonic. Not so hot. As a result we need to generate musicality not just from the probabilities of note transitions, but also the recurrence of grander symmetry.

Real full-blown actual real life scientists have studied this problem and used fancy math to analyze the frequency of [recurrent patterns](http://www.ncbi.nlm.nih.gov/pmc/articles/PMC3309746/). For me I'm just gonna prospect the hooks.

Going back to our data and using some computer science shenanigans we can find which patterns are most common, as is demonstrated by the graph below (see github for how this was done):

![total motifs](/res/blog_2/total_motifs.png)

Note the presence of the RA-AH-GA-GA-AH-AH echoed in some of the prospected motifs (hint 62 is middle - C). Clearly some imperfect musical fragments were also recovered, but overall we see that it not just about probabilities between notes, there are also bigger patterns that recur.


Prospecting the most common motif from all 5000 songs reveals what approximates to be a zero-mean Markovian process for each of the hooks if you center them at the same starting pitch.
![all motifs](/res/blog_2/all_motifs.png)

## Pulling it all together

So how do we know that any of this actually makes something sound musical? Well, we need to give a robot these rules that we found to be common in other peoples music, and ask it to use them to generate new music. I did just that when I wrote an evolutionary algorithm bringing together both the ideas of Markovian interactions and motif recurrence to turn this:

<audio controls>
  <source src="/res/blog_2/random_music.mp3" type="audio/mpeg">
</audio>

into this:

<audio controls>
  <source src="/res/blog_2/example.mp3" type="audio/mpeg">
</audio>

Not perfect, but you can hear the elements coming together.

## tl;dr

<iframe width="560" height="315" src="https://www.youtube.com/embed/cTKlHhLE6Tc" frameborder="0" allowfullscreen></iframe>

## Notes for Nerds:
1. The musical markov chain visualizations were done by adapting [this](http://setosa.io/ev/markov-chains/), with help from [midi.js](https://mudcu.be/midi-js/).

2. The web-scrapping took midi files from various repositories across the web and parsed them with [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/bs4/doc/) and [python midi libraries](https://github.com/vishnubob/python-midi). Code and sample midi files available [here](https://github.com/NicholasARossi/musical_systems/tree/master).

3. I used matlab to write the evolutionary algorithm to combine the themes and write the novel music (I almost never use matlab but I had some code I previously wrote that made it easy). Not available on github, but just email me if you have questions.
