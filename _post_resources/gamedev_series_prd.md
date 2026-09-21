# Game Dev Blog Series — Writing PRD

The goal of this doc: define how the Bubblegum Blitz posts (and later the ARPG posts) get written, using the existing blog as the standard. The fundamental constraint is **no bloat**. Accessible, human, clear — and aesthetically forward, meaning the post *looks like its subject* before a word is read.

## What the existing posts do right

These principles are extracted from the posts that work (`PythonAnimations`, `Glyphs`, `Uncertainty Pt 1`, `RomanEmperors`), and they are the spec.

**1. Show first, explain second.**
Every strong post opens with an artifact — an animation, a figure, a clickable demo — before any prose. `PythonAnimations` opens with an animated SVG at line 1. `Uncertainty` opens with a figure. The reader should know what the post is about from the first screen without reading a sentence.

**2. Length is set by the artifact, not by ambition.**
`RomanEmperors` is three lines and a clickable image, because the scrollytelling *is* the post. Nothing is padded to feel "complete." If a section exists only to make the post feel thorough, cut it.

**3. The post wears its own aesthetic.**
Each post carries a small inline stylesheet that gives it an identity: the pink header blocks of blog_15, the textured titles of blog_17, the Mister Pixel font of blog_21/22. The aesthetic lives in the chrome and the figures — never in adjectives. For this series: a shared bubblegum-palette stylesheet used by both posts so the series reads as one thing.

**4. Anchor abstractions to a human question.**
The uncertainty post doesn't open with heteroscedasticity — it opens with "can you guess how much someone spent on lunch based on how much they make?" and gets to the formal term *after* the intuition. Every technical concept in this series gets the same treatment: the concrete case first, the term second.

**5. Humor is dry, occasional, and one line long.**
"Mark ZUCC might have a banana and some bread for lunch (cheap) or he might eat some endangered animal (expensive)." That's the register — a single aside inside otherwise plain prose. Never a bit that runs longer than a sentence.

**6. Code shows the shape of the idea; the repo holds the rest.**
Snippets are 5–20 lines and show the load-bearing move, not the plumbing. Full code is linked, and the link comes *early* — `Glyphs` puts a **TLDR** with the notebook and repo links in the second paragraph, so a skimmer can leave satisfied.

**7. Sections are short with plain declarative headers.**
"Step 1: Creating the Backbone." "The Power of Easing." Headers say what the section does. No clever titles, no puns doing the work the content should do.

## What bloat looks like (anti-goals)

- Throat-clearing intros ("In this post, we will explore…"). Start inside the subject.
- Restating what a figure already shows. The caption-sentence either adds something or doesn't exist.
- Conclusions that summarize the post the reader just read. End with the artifact, the links, or the next post — not a recap.
- Marketing framing. No "journey," no "unlock," no "the money shot." Plain names for things.
- Exhaustive code. If a reader wants the whole file, that's what the repo link is for.
- Explaining the same idea twice in different words. Say it once, clearly, next to the figure that shows it.

## Post 1 — Building assets: nanobanana → Meshy → engine

- **Opening artifact:** the same-unit-five-stages strip (prompt → image → raw mesh → cleaned → in-game). The whole post in one image.
- **Human anchor:** one dev, no art team, N units needed that all have to look like one game.
- **The substantive middle:** prompting for 3D-convertibility (what image properties make Meshy succeed), and encoding style into the prompt template so consistency is a pipeline property.
- **Honesty section:** failure gallery + what cleanup actually costs. Failures carry more credibility than successes.
- **Links early:** the game (live subreddit) in the first screen.
- **Assets:** stage strip, failure gallery, turntable gif, in-engine shot. Folder: `res/blog_23`.

## Post 2 — Engagement loops: the daily and the gauntlet

- **Opening artifact:** the loop diagram — play → win → your army becomes a post → someone else's boss fight. One diagram, both loops on it.
- **Human anchor:** the post *is* the game. Reddit's primitives (posts, comments, flair, cron) are the engagement mechanics, not a distribution channel for them.
- **The substantive middle:** determinism as the whole backend — seed → shop → waves means the server never simulates a battle, and the entire multiplayer system is a Redis keyspace. Quote the real code sparingly: `dailySeed`, the score-encoding integer, the hSetNX attempt lock.
- **Honesty section:** the trust model — client-authoritative with clamps, what that costs and why it's the right trade for a Reddit game.
- **Assets:** loop diagram, screenshot of a real gauntlet post, phantom-battle gif, keyspace sketch. Folder: `res/blog_24`.

## How we run this

Both posts follow the same build process. Post 1 goes first end-to-end; post 2 starts once post 1 is through its first audit round, so lessons transfer.

**Phase 0 — Foundation (once, shared).**
Build the series stylesheet (bubblegum palette, applied to headers/chrome the way blog_15/blog_21 do it) and scaffold both post files with section headers and named asset placeholders. Reserve `res/blog_23` and `res/blog_24`.

**Phase 1 — Assets before words.**
Since every post opens with its artifact, and the artifact list is defined above, the assets get made first. Writing against real images prevents the main bloat failure mode: prose written to describe an image that doesn't exist yet always over-describes. Gate: the opening artifact exists before drafting starts.

Asset production is fully automatable from what's on disk and in reach:

- **Pipeline artifacts (post 1):** real image→mesh pairs already exist in `rts-devvit/prototypes/assets/_archived_nano/` (nano PNG + GLB versions of the same unit); `tools/gen-styleframe.mjs` holds the real Gemini prompts and a working image-gen path (key in `leetloop/.env`, `GOOGLE_API_KEY`); a `MESHY` key exists for live image-to-3D runs. The stage strip can be assembled from real intermediates, or one unit can be run through the pipeline live for the post.
- **Gameplay capture (both posts):** the e2e harness (`e2e/game.e2e.mjs`) drives the real client through shop→battle loops against a local preview server with screenshots built in; sequential frames → gif/mp4 via ffmpeg. `prototypes/*.html` (glb-check, combat-demo, assemble) render individual meshes and battles for turntables and close-ups.
- **Live Reddit shots (post 2):** the app runs on r/BubblegumBlitzDev; devvit auth exists for playtest. Daily and gauntlet post screenshots via browser automation.
- **Diagrams:** flowcharts and the loop/keyspace diagrams are hand-built SVGs in the series palette — same aesthetic as the posts, no external tool.
- **Ground truth for the accuracy audit:** `rts-devvit/docs/` (design-bible, visual-language.md, style bibles) plus the server source.

**Phase 2 — Draft.**
Write the full draft against the section spec above. Target: a skimmer who reads only headers, figures, and the first sentence of each section gets the whole story.

**Phase 3 — Audit rounds.**
Three rounds, each with one lens — a single pass trying to check everything catches nothing:

1. **Bloat audit.** Line-level pass against the anti-goals list. Every sentence must either add information or get cut; every figure-adjacent sentence must say something the figure doesn't. Output: a strictly shorter draft.
2. **Accuracy audit.** Check every technical claim against the actual code (`rts-devvit` for post 2, the real prompts/pipeline for post 1). Quoted snippets must match source. Numbers (costs, times, key names) verified, not remembered.
3. **Render audit.** Serve the site locally (`serve.sh`), view the post as published — desktop and phone widths. Check: artifact loads first screen, stylesheet applied, images not broken, videos/gifs play, links resolve, code blocks don't overflow on mobile.

Each round ends by re-running the definition-of-done checklist. A post ships when a round produces no findings; if round 3 forces prose changes, round 1's lens gets a quick re-pass.

**Phase 4 — Ship and carry forward.**
Publish post 1, fold anything learned into this doc before post 2's drafting starts. Same for post 2 → the ARPG series.

## Definition of done, per post

- [ ] An artifact appears before the first paragraph.
- [ ] Repo / game links appear in the first screen.
- [ ] Every figure earns its adjacent sentence (or the sentence is cut).
- [ ] No section exists that a skimmer would skip without loss.
- [ ] The shared series stylesheet is applied and the post looks like Bubblegum Blitz.
- [ ] Read aloud once — anything that sounds like a press release gets rewritten plain.
