# Oguri Archive

A fan-made website about **Oguri Cap** from *Umamusume: Pretty Derby*. It features her story, fun facts, racing career, and a playable browser game called **Oguri-Run**.

> **Disclaimer:** This is an unofficial, non-commercial fan project. It is not affiliated with, endorsed by, or sponsored by Cygames, Inc. *Umamusume: Pretty Derby*, its characters, names, images, and audio are the property and trademarks of Cygames, Inc. Oguri-Run is inspired by the Chrome Dinosaur Game and is not affiliated with Google.

---

<img width="200" height="200" alt="Oguri-dancing" src="https://github.com/user-attachments/assets/3cec7902-c187-4535-8f42-7eeaf06e8940" />


## Features

### Home
- Hero section with title, description, and an animated chibi Oguri GIF
- Main picture and two thumbnails with a **floating hover effect** and a **click-to-zoom lightbox** (close with a click on the background or the `Esc` key)
- **Explore Her Story** button: reveals a four-part "Her Story" section with a fade-up animation and smooth scroll
- Zigzag story layout (text and image alternate sides)
- Page-load fade-in animation on the hero elements
- The footer appears on Home only after the story is opened

### Facts
- 10 facts split into sections (01-03, 04-06, 07-09, and a wide card for Fact 10)
- Gold numbered badges, card hover float, and click-to-zoom images
- **Scroll fade** using `IntersectionObserver`, with a small delay between cards in the same row
- Data-driven: all facts live in one `factsData` array and are rendered with `.map()`

### Career
- "Racing Career" header image (hover float and lightbox)
- Career Milestones timeline (4 entries) rendered from a `careerData` array
- Scroll fade and hover float on each milestone

### Game: Oguri-Run
A dino-style endless runner, rewritten from plain JavaScript into React.

- Jump with `Space`, `Arrow Up`, or a click/tap inside the game box. Holding the key makes the jump slightly higher.
- Dodge carrots in four sizes (`xs`, `s`, `m`, `l`). Twin carrots appear later in the run.
- **Tamamo Cross** flies above Oguri. Do not jump when she shows up. A gold "!" warning appears first, then she fades in smoothly. Hitting her ends the game with *"YOU ATE TAMAMO CROSS!"* and a *TRY AGAIN* button.
- **Difficulty** stays easy for a long time, then speeds up gradually at higher scores.
- **Background** fades smoothly between morning and sunset every 250 points.
- **Score and high score** are saved in `localStorage`. When you beat your previous high score, the score and high score blink for 3 seconds while the game keeps running.
- **Pixel-based hitboxes**: sprite transparency is read from a canvas so collisions follow the visible shape, with a small forgiveness margin.
- **Audio**
  - START plays *Harikitte Ikou*, then crossfades into the theme music
  - The theme loops until game over
  - TM Opera O's laugh (boosted with the Web Audio API and a compressor) plays on a new high score
  - Tamamo Cross has an entry sound (first 1 second only) and an "ahh" sound when she hits Oguri
  - A sneeze sound plays when a carrot hits Oguri
  - Mute button and volume slider, with the volume saved in `localStorage`
- A single `requestAnimationFrame` game loop moves the carrots, Tamamo, score, speed, and collision checks together.
- Cleanup on page leave: timers, listeners, and music are stopped when you navigate away.

### Site-wide
- **Dark mode** toggle (sun/moon switch in the navbar), saved in `localStorage` and defaulting to the system preference
- **Responsive layout** for desktop, tablet, and phone (`responsive.css`)
- **Footer** with the fan-project and Cygames/Google disclaimer
- **React Router** navigation with no page reloads
- Navbar hover float effect with gold highlight

---

## Tech Stack

- [React](https://react.dev/) with [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) (`react-router-dom`)
- [Bootstrap 5](https://getbootstrap.com/) (grid and navbar)
- Plain CSS (custom properties, animations, media queries)
- Google Fonts: **Oswald** (headings) and **Inter** (body)
- Minecraft font for the game UI

---

## Project Structure

```
Oguri-archive/
├── public/
├── src/
│   ├── assets/
│   │   ├── music/
│   │   │   ├── theme.mp3
│   │   │   ├── harikitte-ikou.mp3
│   │   │   ├── tamamo-cross-confident.mp3
│   │   │   ├── ahhhh-tamamo-cross-uma-musumee.mp3
│   │   │   ├── tm-opera-on-laugh-uma-musume-pretty-derby_QvkzCd2.mp3
│   │   │   └── sneezeOguri.mp3
│   │   ├── (images, GIFs, and Minecraft.ttf)
│   ├── components/
│   │   ├── navbar.jsx
│   │   ├── darkmode.jsx
│   │   ├── hero.jsx
│   │   ├── facts.jsx
│   │   ├── career.jsx
│   │   ├── game.jsx
│   │   └── footer.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── theme.css
│   ├── responsive.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

### Stylesheet order

The order of imports in `App.jsx` matters, because later files override earlier ones:

```jsx
import './App.css';
import './theme.css';        // dark mode, after App.css
import './responsive.css';   // media queries, after theme.css
```

| File | Purpose |
| --- | --- |
| `App.css` | Base styles for every page, animations, game styles |
| `theme.css` | Dark mode variables, toggle switch, dark overrides |
| `responsive.css` | Footer, flex fixes, tablet and phone breakpoints |

---

## Getting Started

### Requirements
- [Node.js](https://nodejs.org/) (LTS recommended)

### Install and run

```bash
# clone the repository
git clone <your-repo-url>
cd Oguri-archive

# install dependencies
npm install

# make sure these are installed
npm install react-router-dom bootstrap

# start the dev server
npm run dev
```

Open `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

### Bootstrap

Bootstrap is imported in `main.jsx`:

```jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
```

`main.jsx` also wraps the app in `<BrowserRouter>`.

---

## Routes

| Path | Component | Description |
| --- | --- | --- |
| `/` | `Hero` | Home and Her Story |
| `/facts` | `Facts` | 10 facts about Oguri Cap |
| `/career` | `Career` | Racing career timeline |
| `/game` | `Game` | Oguri-Run |

The footer is rendered in `App.jsx` for all routes except `/`. On Home it is rendered inside `hero.jsx`, and only after the story is opened.

---

## Customizing the Game

All tunable values are constants at the top of `src/components/game.jsx`:

| Constant | What it does |
| --- | --- |
| `BASE_SPEED` / `MAX_SPEED` | Starting and top speed (px per second) |
| `RAMP_START` | Score where the game starts getting faster |
| `RAMP_RATE` | How quickly speed increases after `RAMP_START` |
| `DOUBLE_START_SCORE` | Score where twin carrots can appear |
| `TAMAMO_START_SCORE` | Score where Tamamo Cross first appears |
| `TAMAMO_GAP_SCORE` | Minimum score gap between Tamamo appearances |
| `TAMAMO_WARN_SEC` | How long the "!" warning shows before she enters |
| `TAMAMO_HEIGHTS` | Flying heights of Tamamo (px from the bottom) |
| `SUNSET_EVERY` | Score interval for switching morning and sunset |
| `FADE_MS` | Length of the intro-to-theme music crossfade |
| `BLINK_MS` | How long the score blinks on a new high score |
| `JUMP_VELOCITY`, `GRAVITY`, `GRAVITY_HELD` | Jump feel |
| `HITBOX_FORGIVENESS` | How forgiving collisions are |

To test Tamamo quickly, temporarily set `TAMAMO_START_SCORE` to `20`.

### Saved data (`localStorage`)

| Key | Value |
| --- | --- |
| `highscore` | Best score |
| `volume` | Music volume (0 to 1) |
| `theme` | `light` or `dark` |

---

## Notes and Troubleshooting

- **Filenames are case-sensitive on Linux** (for example Vercel). Make sure imports match the exact filename, such as `facts.jsx` and `'./components/facts'`. Windows will not warn you, but a deployed build will fail.
- **Vite imports need extensions** for assets: `'../assets/real2oguri.png'`, not `'../assets/real2oguri'`.
- If a new asset is not found after adding it, restart the dev server (`Ctrl+C`, then `npm run dev`) and hard refresh (`Ctrl+Shift+R`).
- Class names must be written as `className` in JSX, and `.map()` callbacks need `( ... )` or an explicit `return`.
- On phones, the game box height is set in `responsive.css`, and the player and carrot positions use percentages so they stay on the grass.
- Browsers block audio until the user interacts with the page. The game starts audio from the START click.

---

## Credits

- Character, music, and sound effects: Cygames, Inc. (*Umamusume: Pretty Derby*)
- Game concept: inspired by the Google Chrome Dinosaur Game
- Design: made in Figma, then built in React
- Built by **Kylle** as a fan project

All rights to the original works belong to their respective owners. If you are a rights holder and want something removed, please open an issue.
