---
title: "Generating Art Assets Systematically"
layout: post
description: "AI generation, human judgment: the asset pipeline behind Bubblegum Blitz"
comments: yes
hidden: true
sitemap: false
---
<link rel="stylesheet" href="/res/blog_23/bubblegum.css">

<img src="/res/blog_23/hero.webp?v=2" alt="Bubblegum Blitz key art with the mecha roster">

Shipping a game solo means solving two problems:

- getting it in front of people
- giving them a reason to play

[Devvit](https://developers.reddit.com/) is a batteries-included games platform — your app runs inside a post, and it leverages Reddit's built-in social ecosystem to help you find your audience. That solves the first.

The second is gameplay and style. Style is where expectations are high: people assume polish, and a generic look reads as unfinished. It doesn't have to be AAA — a casual game just has to be opinionated.

[Bubblegum Blitz](https://www.reddit.com/r/BubblegumBlitzDev/) is an aesthetically opinionated autobattler built on it.

A game like this needs a lot of assets. Past a certain count you stop making them one at a time and build a system instead. The rule I ended up writing down — it sits at the top of the `AGENTS.md` in my next project — is that the system isn't there for throughput:

> **The scarce resource is not compute. It is the director's attention.**
>
> Agents are cheap, parallel, and tireless. There is one director, they have other things to do, and every minute they spend decoding your output is a minute not spent on the only thing they can actually do — decide whether something looks right. Machines cannot do that part.

So the pipeline is allowed to narrow things down and never allowed to decide. It generates a batch and hands me a short list; I pick one or throw them all out.

<div class="bb-strip">
  <figure style="display:flex;flex-direction:column;justify-content:center;background:#fff;border:2px solid #f3eaff;border-radius:4px;padding:10px;font-size:0.72em;text-align:left;">
    <em>"a SQUAT, wide, low-profile weapon turret… twin very long dominant smoothbore gun barrels side by side, angular faceted armor, heavy grounded mass"</em>
    <figcaption style="font-family:'Banquise';margin-top:8px;text-align:center;">1 · prompt</figcaption>
  </figure>
  <figure><img src="/res/blog_23/strip_concept.jpg" alt="Generated concept image of a twin-barrel turret"><figcaption>2 · nanobanana</figcaption></figure>
  <figure><img src="/res/blog_23/strip_rawmesh.png" alt="Raw Meshy 3D reconstruction of the turret"><figcaption>3 · Meshy, raw</figcaption></figure>
  <figure><img src="/res/blog_23/strip_ingame.jpg" alt="Units fighting on the candy-colored battlefield"><figcaption>4 · in game</figcaption></figure>
</div>

<div class="bb-wide"><img src="/res/blog_23/template_loop.svg" alt="Diagram: the subject I type plus a shared template feed nanobanana, then Meshy, then the engine; I look at the result and say yes or no. A no adds a clause to the template, so the fix applies to every asset after it."></div>

## The review desk

The biggest tooling investment wasn't generation, it was somewhere to judge. Every question I kept re-asking turned into its own page:

<video autoplay loop muted playsinline width="100%" style="display:block;margin:0 auto;">
<source src="/res/blog_23/review_desk.mp4" type="video/mp4">
</video>

Here's a real round trip; the Repeater took two:

<img src="/res/blog_23/iteration.png" alt="Round 1: thin-barrel repeater rejected in the viewer. One prompt sentence later, round 2: gatling block, shipped.">

Spin the same review yourself — real concept-to-mesh pairs, this post's live run first:

<iframe src="/res/blog_23/pair_viewer.html" style="width:100%;aspect-ratio:16/10.5;border:none;border-radius:12px;" scrolling="no" loading="lazy"></iframe>

Parts that pass alone still fail together. One crab walker is five generated part types — twelve pieces — and legs were never one-shotted: femur and shin are separate generations so the knee can actually bend:

<div style="background:#fff3e4;border-radius:12px;padding:14px;">
  <div style="font-family:'Banquise';text-align:center;font-size:1.1em;color:#2a2233;margin-bottom:10px;">one crab walker · five generated parts · twelve pieces</div>
  <div style="display:flex;gap:12px;align-items:center;">
    <img src="/res/blog_23/crab_parts.png" alt="The five generated parts with counts: body ×1, deck gun ×1, femur ×4, shin ×4, claw ×2" style="width:44%;box-shadow:none;">
    <video autoplay loop muted playsinline style="width:56%;border-radius:8px;min-width:0;">
      <source src="/res/blog_23/crab_explode.mp4?v=2" type="video/mp4">
    </video>
  </div>
  <div style="text-align:center;font-size:0.8em;color:#7a6f8a;margin-top:10px;font-family:Menlo,Consolas,monospace;">legs are not one generation — femur and shin are separate meshes so knees can actually bend</div>
</div>

The assembly viewer bolts the pieces together at their baked pivot discs and makes the result walk — knees bent by IK, feet planted in world space. A femur that's too chunky or a claw that fights the body shows up here, and goes back to the prompt.

## The finished product

Everything above ends up here: walkers, tanks and turret platforms, all generated the same way, all on screen at once.

<video autoplay loop muted playsinline width="100%" style="display:block;margin:0 auto;">
<source src="/res/blog_23/combat.mp4?v=8" type="video/mp4">
</video>

Nothing had to be perfect. It had to hold together in motion — which is the part I can only tell by looking.

**[Play the game on r/BubblegumBlitzDev](https://www.reddit.com/r/BubblegumBlitzDev/)** — a new Daily Blitz posts every morning.

*Next: the game's multiplayer has no game servers — how two Reddit-post loops and a deterministic sim replace a backend.*
