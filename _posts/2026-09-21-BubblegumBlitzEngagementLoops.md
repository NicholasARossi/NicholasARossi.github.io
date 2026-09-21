---
title: "The Post Is the Game"
layout: post
description: "How Bubblegum Blitz turns Reddit posts into a daily challenge and your army into someone else's boss fight"
comments: yes
hidden: true
sitemap: false
---
<link rel="stylesheet" href="/res/blog_23/bubblegum.css">

<img src="/res/blog_24/loop_diagram.svg" alt="Diagram of the two engagement loops: the cron-posted Daily and the player-made Gauntlet, both feeding the same deterministic sim">

[Bubblegum Blitz](https://www.reddit.com/r/BubblegumBlitzDev/) is an autobattler that runs inside Reddit posts ([how its units get made](/BubblegumBlitzAssetPipeline)). This post is about its multiplayer, which has an unusual property: there are no game servers. No matchmaking, no live sessions, no backend simulating battles. There are Reddit posts, a Redis keyspace, and one architectural decision doing all the work.

## Two loops, one trick

The game has two recurring multiplayer surfaces, and each one *is* a Reddit post.

**The Daily** is the appointment loop. Every morning a cron task creates that day's post — "Daily Blitz #68 — same shop, same waves, one shot" — and every player who opens it plays the identical run: same shop offerings, same enemy waves. You get one scored attempt (practice is unlimited), a per-day leaderboard, and a streak that pays out as actual subreddit flair.

**The Gauntlet** is the social loop. When you finish a run with an army you're proud of, one tap turns it into a *new* post: "Gauntlet: beat u/left_side's round-9 army." Anyone who opens that post climbs eight fresh rounds and then fights *your army* as the boss. The post accumulates attempts, clears, and its own leaderboard.

<div class="bb-strip">
  <figure><img src="/res/blog_24/daily_post.png" alt="Today's Daily Blitz post on the subreddit"><figcaption>the daily, posted by cron</figcaption></figure>
  <figure><img src="/res/blog_24/gauntlet_post.png" alt="A gauntlet post: beat u/left_side's round-9 army, 3 attempts, 1 clear"><figcaption>a player-made boss</figcaption></figure>
</div>

The trick underneath both: the game's simulation is fully deterministic. Feed it a seed and it produces the same shop rolls, the same waves, the same battle, every time, on every device.

## Determinism is the whole backend

Both loops reduce to choosing a seed. The daily's seed is just the date, hashed; a gauntlet's seed is its own post ID:

```ts
/** Deterministic seed for a date's daily. */
export const dailySeed = (date: string): number => fnvSeed('bb-daily:' + date);

/** Deterministic seed for a gauntlet post (rounds 1–8 wave rolls; round 9 is
 *  the stored army). Keyed by postId so every gauntlet is a fresh climb. */
export const gauntletSeed = (postId: string): number => fnvSeed('bb-gauntlet:' + postId);
```

That's the entire matchmaking system. The server never runs a battle — your browser simulates it, and because every challenger's browser simulates the *identical* fight, comparing scores across players is fair. A gauntlet leaderboard only makes sense because player #1 and player #500 faced the same eight waves and the same boss army, reconstructed from the same seed.

## The backend is a Redis keyspace

What's left for the server is bookkeeping, and all of it fits in a handful of Redis keys:

<img src="/res/blog_24/keyspace.svg" alt="The full Redis keyspace: bb:daily (post, leaderboard, done-hash), bb:streak, bb:glb (army, leaderboard, stats)">

Two details carry most of the design. First, a whole leaderboard entry — rounds cleared, difficulty tier, remaining HP, battle speed — packs into a single float64-safe integer, so a Redis sorted set ranks players correctly with no tiebreak logic. Points dominate, then equal points on a harder tier rank first, then remaining HP, then speed:

```ts
return (
  cleared * DAILY_DIFF_WEIGHT[diff] * SCORE_POINT +
  DIFF_ORDER.indexOf(diff) * SCORE_DIFF +
  runHP * SCORE_HP +
  Math.max(0, SPEED_MAX - Math.floor(ticks / TICK_DIV))
);
```

The tier weights are the daily's risk dial: nightmare pays 1.6× per round, so clearing 6 of 9 on nightmare edges out a *perfect* run on normal — but dying at 5 doesn't.

Second, "one shot per day" is a single atomic operation: the first submitted result does `hSetNX` on that day's done-hash, and whoever wrote the field owns the score. A crash mid-run can't burn your day (the lock lands at submit, not at run start), and resubmits are just practice.

## The trust model

Scores are submitted by the client, which normally means an anti-cheat arms race. The pipeline's answer is *clamp, don't reject*: every submission is forced into sane bounds server-side. An army snapshot may only contain unit types that exist, with stats clamped to plausible ranges, at most five units. A claimed "nightmare difficulty" run from an account that never unlocked nightmare scores as the account's actual max. A run that died on the last round can't claim a full clear.

An honest client never notices any of this. A dishonest one gets quietly graded down to the best score it could have legitimately earned. For a candy-colored Reddit game, that's the right amount of security — the leaderboard's integrity survives, and nobody spent a month on server-side battle validation.

## Reddit primitives as game mechanics

The part I underestimated: Reddit isn't the distribution channel for this game, it's the game engine's UI layer.

- **Posts** are game instances — the cron scheduler creates the daily (idempotently, so a retry can never double-post), players create gauntlets.
- **Flair** is the streak reward. Three days running earns "⚔ Enlisted"; thirty makes you a "⚔ Bubblegum Legend," visible on every comment you write in the subreddit.
- **Comments** are the share mechanic — "share my result" posts a comment on the daily as *you* (with your permission), standings included, which is the loop's only growth engine and costs nothing.

<video controls loop autoplay muted width="100%">
<source src="/res/blog_24/boss_battle.mp4" type="video/mp4">
</video>

A boss-gate battle from a co-op run. **[Play today's Daily on r/BubblegumBlitzDev](https://www.reddit.com/r/BubblegumBlitzDev/)** — and if your army holds, post the gauntlet.
