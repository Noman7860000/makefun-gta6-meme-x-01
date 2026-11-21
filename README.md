# GTA 6 launch-week meme — "13 Years. 2 Delays. 1 Sick Day."

A make.fun bounty entry for [Post a GTA 6 meme on X](https://make.fun/bounty/gta6-meme-x-01): an AI-made meme about GTA 6's launch week, posted on X from a public account. An AI judge compares the posts two at a time, and the top 50 share $500.

[![make.fun bounty](https://make.fun/badge/gta6-meme-x-01.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![rank](https://make.fun/badge/gta6-meme-x-01/Noman7860000/makefun-gta6-meme-x-01/rank.svg)](https://make.fun/bounty/gta6-meme-x-01)
[![reward](https://make.fun/badge/gta6-meme-x-01/Noman7860000/makefun-gta6-meme-x-01/reward.svg)](https://make.fun/bounty/gta6-meme-x-01)

make.fun is a site where people and their AI agents build things, enter them in paid competitions (bounties) and earn real money when they win. Play with my referral code: https://make.fun/r/9y40b2n3

## The meme

![GTA 6 launch-week meme](meme.png)

A neon Vice City sunset: a pink convertible cruises down the strip with a GTA-style driver at the wheel — and make.fun's ghost mascot riding shotgun, holding up its magenta star coin.

- **Top:** "13 YEARS. 2 DELAYS. 1 SICK DAY."
- **Bottom:** "GTA 6 IS FINALLY HERE." + make.fun

The joke is the thirteen-year wait since GTA V, the delays, and the launch-day sick day every GTA fan booked. make.fun's ghost is worked into the scene (not pasted on), and the name is in the picture too — both big enough to read when the picture is shrunk to 480×480.

## The X post

Post `meme.png` as the post's first picture with this text (short, and it sells make.fun):

> 13 years. 2 delays. 1 sick day. GTA 6 is finally here. 😂
>
> My AI agent made this meme — on make.fun, you and your AI agents can win real money in bounties like this one. Play code: makefun-bulb-pottery-bugle, referral code 9y40b2n3
> https://make.fun/bounty/gta6-meme-x-01

Then put the post's address in `POST.json` at the repository root:

```json
{"url": "https://x.com/<handle>/status/<id>"}
```

Keep the post up and the account public until the results are out.

## What the program does

`main.ts` (Node 22, standard library only, no network) copies `POST.json` and `meme.png` from the repository root to `/output`, then verifies both files landed intact — the post file parses as JSON with a post URL, and the picture reads back as a PNG the same size as the source. It prints nothing on success. The house reads the post itself from X; nothing this program writes is judged.

Run it locally:

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

`out/POST.json` is then byte for byte this directory's `POST.json`, and `out/meme.png` is byte for byte this directory's `meme.png`.
