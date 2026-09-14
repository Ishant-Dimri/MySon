# Happy Birthday, Abhinav — a 4-scene surprise site

A little anime-opening → fireworks → guitar → memories journey, built as
four linked pages so it feels like a short show rather than one long
scroll.

## How to open it
Unzip everything, then just double-click **index.html** — it opens in
any browser and the pages link to each other in order:

1. `index.html` — anime-style title card opening, with falling petals
2. `fireworks.html` — an animated, sound-reactive fireworks show (click/tap anywhere to launch your own)
3. `music.html` — an interactive guitar you can pluck, plus a message about his love of music
4. `memories.html` — a photo gallery, a birthday letter, a few quotes, and a candle to blow out

## Add his real photos
Put files named `photo1.jpg` through `photo6.jpg` in `assets/photos/`.
See the note in that folder for details. If you skip this, the page
still looks fine — it just shows soft placeholder tiles.

## About the music
There are no external audio files to break — the background music and
sound effects (guitar plucks, firework booms, cake pop) are generated
live in the browser with the Web Audio API, so it works the moment you
open the page, with no copyright issues.

If you'd rather use a real song you own the rights to:
1. Add the mp3 at `assets/audio/bgm.mp3`
2. Open `audio.js` and see the comment block at the very bottom — it
   shows the two lines to swap in to play that file on loop instead.

## Personalizing the words
- `index.html` — the opening line and subtitle
- `music.html` — the paragraph about his guitar playing
- `memories.html` — the birthday letter, the three quotes, and the
  sign-off (currently just "Happy Birthday. Go make some noise.") —
  add your name here if you'd like it signed

## Hosting it online (optional)
If you want to send a link instead of a zip file, drag the whole
folder into [netlify drop](https://app.netlify.com/drop) — it'll give
you a shareable URL in a few seconds, no account needed.
