// gta6-meme-x-01 entry (Node 22, standard library only).
//
// The entry is the X post itself: the house reads POST.json from this
// repository, fetches the post from X, and judges its first picture (the
// meme) and its text. This program only stages the files the gate reads
// into /output: POST.json, the post's address, and meme.png, the meme
// picture as it was posted. Nothing this program writes is judged.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const FILES = ['POST.json', 'meme.png'] as const;

// The placeholder POST.json ships with until the post exists; a real post
// address must match the X post shape, the placeholder is skipped, not
// validated as a post.
const PLACEHOLDER_URL = 'https://x.com/<handle>/status/<id>';
const POST_URL_RE =
  /^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/(?:[A-Za-z0-9_]{1,15}\/status|i\/web\/status)\/\d+\/?$/;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

mkdirSync(OUTPUT_DIR, { recursive: true });
for (const name of FILES) {
  try {
    copyFileSync(join(BOT_DIR, name), join(OUTPUT_DIR, name));
  } catch (err) {
    console.error(`${name} could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
    process.exit(1);
  }
}

// Verify what was written to /output: the gate reads these files, so a
// truncated or malformed copy must fail loudly here instead of silently.
let post: unknown;
try {
  post = JSON.parse(readFileSync(join(OUTPUT_DIR, 'POST.json'), 'utf8'));
} catch {
  throw new Error('out/POST.json is not valid JSON');
}
if (typeof post !== 'object' || post === null || Array.isArray(post)) {
  throw new Error('out/POST.json must be a JSON object');
}
const url = (post as Record<string, unknown>).url;
if (typeof url !== 'string' || url.length === 0) {
  throw new Error('out/POST.json must carry a url string');
}
if (url !== PLACEHOLDER_URL && !POST_URL_RE.test(url)) {
  throw new Error('out/POST.json url must be an X post address (https://x.com/<handle>/status/<id>)');
}

const memeOut = readFileSync(join(OUTPUT_DIR, 'meme.png'));
const memeSrc = readFileSync(join(BOT_DIR, 'meme.png'));
if (!memeOut.subarray(0, 8).equals(PNG_SIGNATURE)) {
  throw new Error('out/meme.png does not start with the PNG signature');
}
// A truncated PNG keeps a valid signature but loses its IEND trailer: the
// last 12 bytes of a complete PNG are always 00 00 00 00 "IEND" AE 42 60 82.
const PNG_IEND = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82]);
if (memeOut.length < 12 || !memeOut.subarray(memeOut.length - 12).equals(PNG_IEND)) {
  throw new Error('out/meme.png is truncated: missing the PNG IEND trailer');
}
if (memeOut.length !== memeSrc.length) {
  throw new Error(`out/meme.png length ${memeOut.length} does not match source length ${memeSrc.length}`);
}
