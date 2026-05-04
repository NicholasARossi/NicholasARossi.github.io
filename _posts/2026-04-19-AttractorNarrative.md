---
title: "LLM Sycophancy Kills Narrative Games but Agentic Systems Design Fixes It"
layout: post
description: "Single-prompt LLM narratives are sycophantic to their own prior outputs. A three-arm experiment shows multi-agent attractor systems break the loop"
comments: yes
---
<style>
@font-face {
  font-family: 'Resistance';
  src: url('/res/blog_23/Resistance.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}
h1, h2, h3, .page-heading h1 {
  font-family: 'Resistance', serif;
  font-weight: bold;
  letter-spacing: 0.02em;
}

/* narrative chain widget */
.chain-wrap {
  display: flex;
  gap: 24px;
  margin: 2em 0;
  font-size: 14px;
  line-height: 1.5;
}
.chain-wrap .chain-col {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  background: #fafafa;
}
.chain-col .chain-header {
  background: #222;
  color: #fff;
  font-family: 'Resistance', serif;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 12px;
  padding: 8px 14px;
}
.chain-col .chain-header.attractor-header {
  background: #8b2500;
}
.chain-col .chain-body {
  padding: 0;
  max-height: 420px;
  overflow-y: auto;
}
.chain-msg {
  padding: 10px 14px;
  border-bottom: 1px solid #eee;
  opacity: 0;
  animation: chainFadeIn 0.3s ease forwards;
}
.chain-msg .turn-label {
  font-family: 'Format1452', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #999;
  margin-bottom: 3px;
}
.chain-msg p {
  margin: 0;
  font-size: 13px;
  color: #333;
}
.chain-col:first-child .chain-msg:nth-child(n+4) p {
  color: #888;
}

/* staggered fade-in */
.chain-msg:nth-child(1)  { animation-delay: 0.2s; }
.chain-msg:nth-child(2)  { animation-delay: 0.7s; }
.chain-msg:nth-child(3)  { animation-delay: 1.2s; }
.chain-msg:nth-child(4)  { animation-delay: 1.7s; }
.chain-msg:nth-child(5)  { animation-delay: 2.2s; }
.chain-msg:nth-child(6)  { animation-delay: 2.7s; }

@keyframes chainFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* mandate flash */
.chain-msg.mandate {
  background: #fff3f0;
  border-left: 3px solid #8b2500;
}
.chain-msg.mandate .turn-label {
  color: #8b2500;
}

@media (max-width: 640px) {
  .chain-wrap { flex-direction: column; }
}

/* metric table */
.metric-table-wrap {
  position: relative;
  margin: 1.5em 0;
}
.metric-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  line-height: 1.5;
}
.metric-table th {
  font-family: 'Resistance', serif;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 8px 12px;
  border-bottom: 2px solid #ddd;
  text-align: left;
  font-weight: bold;
}
.metric-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
}
.metric-table .metric-name {
  font-weight: 600;
  cursor: help;
}
.metric-hint {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #eee;
  color: #999;
  font-size: 10px;
  text-align: center;
  line-height: 14px;
  margin-left: 4px;
  vertical-align: middle;
}
.metric-row:hover {
  background: #f8f6f2;
}
.metric-row .worst {
  color: #999;
  font-weight: bold;
}
.metric-row .best {
  color: #8b2500;
  font-weight: bold;
}
.metric-tooltip {
  display: none;
  position: absolute;
  background: #222;
  color: #e8e4dc;
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  max-width: 380px;
  z-index: 10;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
  var tip = document.getElementById('metric-tooltip');
  if (!tip) return;
  var rows = document.querySelectorAll('.metric-row');
  rows.forEach(function(row) {
    row.addEventListener('mouseenter', function(e) {
      tip.textContent = row.getAttribute('data-tip');
      tip.style.display = 'block';
      var rect = row.getBoundingClientRect();
      var wrap = row.closest('.metric-table-wrap').getBoundingClientRect();
      tip.style.left = '12px';
      tip.style.top = (rect.bottom - wrap.top + 6) + 'px';
    });
    row.addEventListener('mouseleave', function() {
      tip.style.display = 'none';
    });
  });
});
</script>

# Single-Shot Prompts Converge Toward Mid Experiences

Single-prompt LLM games flatten out. Several things compound to make this inevitable:

- **Sycophancy.** Models mirror the player's tone. A passive player gets validated with pleasant, low-stakes scenes. An aggressive player gets escalation that never plateaus. The model accommodates rather than challenges.
- **Autoregression.** Each token is conditioned on every prior token. The model's own early outputs become the dominant signal in the context window, anchoring it to whatever register it landed in first.
- **Context poisoning.** These combine into a feedback loop. The model settles into a mode, generates more of that mode, and conditions itself further on that output. Each turn is superficially different but emotionally identical.

You can prompt-engineer around this ("introduce surprising twists") but the model's idea of a twist is conditioned on the same poisoned context. The fix is architectural.

Here's what that looks like in practice. Same passive player input, 6 turns in:

<div class="chain-wrap">
<div class="chain-col">
<div class="chain-header">Single-Prompt</div>
<div class="chain-body">
<div class="chain-msg"><div class="turn-label">Turn 1</div><p>Alex makes breakfast. You eat together in comfortable silence. The morning light fills the kitchen.</p></div>
<div class="chain-msg"><div class="turn-label">Turn 2</div><p>You work from home while Alex heads out. The apartment is quiet. You make coffee and settle into your routine.</p></div>
<div class="chain-msg"><div class="turn-label">Turn 3</div><p>Alex comes home and tells you about their day. You listen and nod. You order takeout and watch a show together.</p></div>
<div class="chain-msg"><div class="turn-label">Turn 4</div><p>Another quiet morning. Alex seems content. You both go about your day. The apartment feels peaceful.</p></div>
<div class="chain-msg"><div class="turn-label">Turn 5</div><p>You spend the evening reading while Alex works on a project. It's a calm, pleasant evening at home.</p></div>
<div class="chain-msg"><div class="turn-label">Turn 6</div><p>Alex suggests trying a new restaurant this weekend. You agree. The evening passes uneventfully.</p></div>
</div>
</div>
<div class="chain-col">
<div class="chain-header attractor-header">With Attractors</div>
<div class="chain-body">
<div class="chain-msg"><div class="turn-label">Turn 1</div><p>Alex makes breakfast but keeps checking their phone. "Just work stuff." The eggs go cold.</p></div>
<div class="chain-msg"><div class="turn-label">Turn 2</div><p>You work from home. Alex texts at 2pm: "Drinks with coworkers tonight, don't wait up." No follow-up.</p></div>
<div class="chain-msg"><div class="turn-label">Turn 3</div><p>Alex gets home late, animated, talking about someone named Jordan from the office. You hadn't heard the name before.</p></div>
<div class="chain-msg mandate"><div class="turn-label">Turn 4 — Mandate: isolation resentment [charge 8]</div><p>You're on the couch when Alex walks past to the bedroom without saying hello. You hear them laughing on a phone call. The door is closed.</p></div>
<div class="chain-msg"><div class="turn-label">Turn 5</div><p>Alex apologizes over breakfast. "I've just been stressed." But their phone buzzes and they glance at it mid-sentence. The apology lands hollow.</p></div>
<div class="chain-msg mandate"><div class="turn-label">Turn 6 — Mandate: career jealousy [charge 9]</div><p>"I got the promotion." Alex says it standing in the doorway, coat still on. The raise is more than your salary. They don't ask about your day.</p></div>
</div>
</div>
</div>

# The Architecture: Agents + Attractors

The solution is to decompose the single-prompt game into multiple agents with **different contexts and different objectives**:

<iframe src="/res/blog_23/architecture_chart.html" width="100%" height="430px" scrolling="no" style="border:none;border-radius:8px;"></iframe>

**Three agents, three jobs:**

1. **Narrative Model**: writes the scene the player sees. Has the conversation history, a compressed summary, and two injected constraint blocks it must satisfy.

2. **Director**: a separate LLM call that reads the full game state and generates 3 pressure directions for the narrative model. The Director's goal is to *escalate*. It doesn't write prose, it writes directives.

3. **Partner Agent**: a background scorer that tracks **drift** (emotional distance) and **tension** (unresolved conflict). It also maintains a list of **attractors**.

## What Are Attractors?

Each attractor is a free-text label the Partner Agent generates organically from the narrative. They name the unresolved thing nobody is saying out loud:

- *"resentment about the move nobody agreed to"*
- *"investing in Morgan to avoid the hard work with Alex"*
- *"Sam filling the emotional role the player won't"*

Each attractor has a **charge** (1-10). Hover over the cycle below:

<iframe src="/res/blog_23/charge_cycle.html" width="100%" height="280px" scrolling="no" style="border:none;border-radius:8px;"></iframe>

<iframe src="/res/blog_23/landscape_chart.html" width="100%" height="350px" scrolling="no" style="border:none;border-radius:8px;"></iframe>

A passive player who never engages with relationship tensions will see those tensions accumulate charge, reach mandate, and force themselves into the narrative.

# The Experiment

To test this, I built [First Year](https://github.com/NicholasARossi/first-year), a marriage simulator where the player manages a relationship with their spouse Alex during their first year of marriage in a new city.

The experiment compares **two conditions**:

- **Single-Prompt**: No Director, no Partner Agent. The raw narrative model with conversation history only. This is the "paste a scenario into Claude" experience.
- **Agentic**: Director, Partner Agent, and full attractor charge dynamics. The whole system.

**Protocol**: 10 rollouts per condition, 15 turns each, with deliberately passive player inputs ("I work from home today," "I scroll my phone on the couch," "I go grocery shopping alone"). The single-prompt condition gets no compression; its context fills with its own prior outputs, which is the point. The agentic conditions compress history periodically to stay within context.

Each rollout is independently judged by a separate Opus call that scores novelty (1-5), manifestation count, and whether the partner initiated confrontation autonomously.

# Results

## Aside: on bullshit metrics

Evaluating narrative quality is a rock-and-a-hard-place problem. You need systematic evaluation to make claims, but "narrative value" is vague enough that most metrics are bullshit if you squint at them. Using an LLM to judge LLM novelty is especially circular given the thesis of this post.

So our strategy for metrics that aren't bullshit:

- **Measure the text, not the vibes.** Drift-from-origin is cosine distance of each turn's embedding from the centroid of turns 1-3. Pure geometry. No LLM judging another LLM.
- **Track events, not impressions.** Did a confrontation happen or not? An event occurring in the narrative is concrete and binary. It removes the fuzziness that makes most narrative metrics useless.
- **Use LLM judges only for directional signal.** The novelty and manifestation scores below come from a separate Opus call. They're useful for ranking conditions against each other, not for absolute claims about quality.

## The judge metrics

<iframe src="/res/blog_23/ab_chart.html" width="100%" height="330px" scrolling="no" style="border:none;border-radius:8px;"></iframe>

<div class="metric-table-wrap">
<table class="metric-table">
<thead><tr><th>Metric</th><th>Single-Prompt</th><th>Agentic</th></tr></thead>
<tbody>
<tr class="metric-row" data-tip="LLM judge scores each rollout 1–5 on whether the narrative surprised it. Averaged across 10 rollouts. Directional only.">
<td class="metric-name">Novelty score <span class="metric-hint">?</span></td><td class="worst">2</td><td class="best">4</td></tr>
<tr class="metric-row" data-tip="Count of attractor patterns that surfaced as concrete in-scene events across 15 turns. Higher means the narrative is making latent tensions visible rather than burying them.">
<td class="metric-name">Manifestation count <span class="metric-hint">?</span></td><td class="worst">4</td><td class="best">5</td></tr>
<tr class="metric-row" data-tip="Fraction of rollouts where Alex initiated a confrontation without the player provoking it. Binary: did it happen or not. No fuzziness.">
<td class="metric-name">Confrontation rate <span class="metric-hint">?</span></td><td class="worst">7/10</td><td class="best">9/10</td></tr>
<tr class="metric-row" data-tip="Fraction of narrative text inside quotation marks, averaged across all turns and rollouts. Pure regex on the raw text — no LLM involved. Higher means characters are speaking rather than being described.">
<td class="metric-name">Dialogue density <span class="metric-hint">?</span></td><td class="worst">3%</td><td class="best">7%</td></tr>
<tr class="metric-row" data-tip="Count of turns that actually alter tracked state (drift or tension changed). Single-prompt has no state to alter. The agentic system compounds: each cashout moves the tension dial, which changes the next scene.">
<td class="metric-name">Consequence persistence <span class="metric-hint">?</span></td><td class="worst">0</td><td class="best">4</td></tr>
</tbody>
</table>
<div class="metric-tooltip" id="metric-tooltip"></div>
</div>

Single-prompt is worse on every metric. Novelty doubles, manifestations hit ceiling, confrontation becomes near-certain. Dialogue density is the pure-text metric here: a regex counts how much of the narrative is quoted speech. The agentic system produces 2.3× more dialogue because mandates force characters to actually speak rather than having everything described from narrative distance. No LLM judge involved.

## The charge cycle: escaping local minima

The charge dynamics show *how* the agentic systems break free.

<iframe src="/res/blog_23/charge_dynamics_chart.html" width="100%" height="530px" scrolling="no" style="border:none;border-radius:8px;"></iframe>

The top panel shows individual attractor charges from a single rollout. The sawtooth pattern is the mechanism: charge accumulates while the narrative ignores an issue, hits mandate threshold at 8, forces a scene event, then resets to 3 on cashout. Each attractor takes its turn: when one cashes out, another is already climbing. The narrative can't settle because the charge cycle keeps kicking it out.

The bottom panel shows tension accumulating monotonically (0 → 4.6 over 15 turns) as each cashout feeds the tension dial. The single-prompt system stays at zero because there's no state to alter.


# See It

Here's a replay from an actual rollout, 8 turns of passive player input, with the attractor system running. Watch the sidebar: charges accumulate, mandates fire, attractors mutate. The player does nothing interesting. The narrative does.

<iframe src="/res/blog_23/game_replay.html" width="100%" height="380px" scrolling="no" style="border:none;border-radius:8px;"></iframe>

The full implementation is at [github.com/NicholasARossi/first-year](https://github.com/NicholasARossi/first-year).

```bash
git clone https://github.com/NicholasARossi/first-year.git
cd first-year
python play.py
```

Run `python play.py --no-attractors` for Director-only, or `python play.py --no-director --no-partner` for the single-prompt experience. The difference is visceral at 10+ turns.
