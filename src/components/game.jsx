import { useState, useEffect, useRef } from 'react';
import OguriRunning from '../assets/oguri_cap_running_transparent.gif';
import carrot from '../assets/carrot.png';
import tamamoImg from '../assets/tamamo-cross.png';
import ogurirestart from '../assets/ogurirestart.png';
import theme from '../assets/music/theme.mp3';
import harikitte from '../assets/music/harikitte-ikou.mp3';
import tamamoConfident from '../assets/music/tamamo-cross-confident.mp3';
import tamamoAhh from '../assets/music/ahhhh-tamamo-cross-uma-musumee.mp3';
import tmLaugh from '../assets/music/tm-opera-on-laugh-uma-musume-pretty-derby_QvkzCd2.mp3';
import sneeze from '../assets/music/sneezeOguri.mp3';

//-----CONSTANTS-----//
const OBSTACLE_SIZES = ['xs', 's', 'm', 'l'];

// Twin carrot
const DOUBLE_START_SCORE = 1500;
const DOUBLE_ALLOWED_SIZES = ['xs', 's'];

// Controls
const JUMP_VELOCITY = 880;
const GRAVITY = 2200;
const GRAVITY_HELD = 1700;

// Collision
const ALPHA_THRESHOLD = 40;
const HITBOX_FORGIVENESS = {
  player:   { x: 0.08, top: 0.05, bottom: 0.08 },
  obstacle: { x: 0.12, top: 0.10 },
  tamamo:   { x: 0.18, top: 0.15, bottom: 0.15 },
};

// Speed / difficulty (px per second)
const SCORE_RATE = 10;          // score kada segundo
const BASE_SPEED = 350;         // bilis sa simula
const MAX_SPEED = 760;          // pinakamabilis
const RAMP_START = 1800;        // dito pa lang magsisimulang bumilis
const RAMP_RATE = 1.0;          // dagdag na px/s kada 1 score

// Tamamo Cross
const TAMAMO_START_SCORE = 2000;
const TAMAMO_GAP_SCORE = 120;        // mas madalas lumabas
const TAMAMO_WARN_SEC = 0.9;         // gaano katagal ang "!" bago pumasok
const TAMAMO_HEIGHTS = [175, 190];   // bottom (px), mas mataas sa ulo ni Oguri

// Music / effects
const FADE_MS = 1500;
const BLINK_MS = 3000;

// Background
const SUNSET_EVERY = 250;       // sunset sa 250, morning sa 500, sunset sa 750...

function getSavedVolume() {
  const saved = parseFloat(localStorage.getItem('volume'));
  return isNaN(saved) ? 0.5 : Math.min(Math.max(saved, 0), 1);
}

function Game() {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const obstacleRef = useRef(null);
  const twinRef = useRef(null);
  const tamamoRef = useRef(null);
  const warnRef = useRef(null);
  const audioRef = useRef(null);
  const api = useRef({});

  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [overReason, setOverReason] = useState('carrot');
  const [score, setScoreState] = useState(0);
  const [highScore, setHighScoreState] = useState(() => Number(localStorage.getItem('highscore')) || 0);
  const [volume, setVolumeState] = useState(getSavedVolume);
  const [muted, setMuted] = useState(() => getSavedVolume() === 0);
  const [sunset, setSunset] = useState(false);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const element = playerRef.current;
    const obstacleElement = obstacleRef.current;
    const twinElement = twinRef.current;
    const tamamoElement = tamamoRef.current;
    const warnElement = warnRef.current;
    const audioControl = audioRef.current;

    let isStarted = false;
    let isGameOver = false;
    let isDouble = false;

    //-----MUSIC + SOUND EFFECTS-----//
    let master = getSavedVolume();
    let bgmFactor = 1;
    let bgmStarted = false;
    let intro = null;
    let fadeTimer = null;
    let audioCtx = null;

    const bgm = new Audio(theme);
    bgm.loop = true;
    bgm.muted = master === 0;

    function applyBgmVolume() {
      bgm.volume = master * bgmFactor;
    }
    applyBgmVolume();

    // one-shot na sound effect. maxMs = putulin pagkatapos ng ilang ms. gain = lakas
    function playSfx(src, maxMs, gain = 1) {
      const a = new Audio(src);
      a.volume = Math.min(1, master * gain);
      a.muted = bgm.muted;
      a.play().catch(() => {});
      if (maxMs) setTimeout(() => a.pause(), maxMs);
      return a;
    }

    // mas malakas kaysa 100%: gamit ang Web Audio (may compressor para hindi pumutok)
    function playBoosted(src, gain) {
      const a = new Audio(src);
      a.muted = bgm.muted;
      try {
        audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaElementSource(a);
        const g = audioCtx.createGain();
        g.gain.value = master * gain;
        const comp = audioCtx.createDynamicsCompressor();
        source.connect(g);
        g.connect(comp);
        comp.connect(audioCtx.destination);
        audioCtx.resume();
      } catch (e) {
        a.volume = Math.min(1, master);
      }
      a.play().catch(() => {});
      return a;
    }

    // smooth na lipat: fade out ang intro, fade in ang theme
    function startCrossfade() {
      if (bgmStarted || isGameOver) return;
      bgmStarted = true;
      bgm.currentTime = 0;
      bgmFactor = 0;
      applyBgmVolume();
      bgm.play().catch(() => {});

      const steps = 30;
      let i = 0;
      const currentIntro = intro;
      clearInterval(fadeTimer);
      fadeTimer = setInterval(() => {
        i++;
        const t = Math.min(i / steps, 1);
        bgmFactor = t;
        applyBgmVolume();
        if (currentIntro) currentIntro.volume = master * (1 - t);
        if (t >= 1) {
          clearInterval(fadeTimer);
          if (currentIntro) currentIntro.pause();
        }
      }, FADE_MS / steps);
    }

    function playIntro() {
      intro = new Audio(harikitte);
      intro.volume = master;
      intro.muted = bgm.muted;
      const thisIntro = intro;

      thisIntro.addEventListener('timeupdate', () => {
        if (thisIntro.duration && thisIntro.duration - thisIntro.currentTime <= FADE_MS / 1000) {
          startCrossfade();
        }
      });
      thisIntro.addEventListener('ended', startCrossfade);
      thisIntro.play().catch(startCrossfade);   // pag na-block, theme na lang agad
    }

    function stopAllMusic() {
      clearInterval(fadeTimer);
      bgm.pause();
      if (intro) intro.pause();
    }

    function resumeMusicOnInput() {
      if (isStarted && !isGameOver && bgmStarted && bgm.paused) {
        bgm.play().catch(() => {});
      }
    }

    function setVolume(value) {
      master = value;
      bgm.muted = value === 0;
      if (intro) intro.muted = bgm.muted;
      applyBgmVolume();
      localStorage.setItem('volume', value);
      setVolumeState(value);
      setMuted(value === 0);
    }

    function toggleMute() {
      if (bgm.muted || master === 0) {
        setVolume(master === 0 ? 0.5 : master);
        bgm.muted = false;
        if (intro) intro.muted = false;
        setMuted(false);
      } else {
        bgm.muted = true;
        if (intro) intro.muted = true;
        setMuted(true);
      }
    }

    //-----JUMP-----//
    let jumping = false;
    let jumpHeld = false;
    let jumpY = 0;
    let jumpVelocity = 0;
    let jumpLastTime = null;
    let jumpFrame = null;

    function startJump() {
      if (!isStarted || isGameOver || jumping) return;
      jumping = true;
      jumpY = 0;
      jumpVelocity = JUMP_VELOCITY;
      jumpLastTime = null;
      jumpFrame = requestAnimationFrame(jumpStep);
    }

    function jumpStep(now) {
      if (jumpLastTime === null) jumpLastTime = now;
      const dt = Math.min((now - jumpLastTime) / 1000, 0.05);
      jumpLastTime = now;

      const gravity = (jumpHeld && jumpVelocity > 0) ? GRAVITY_HELD : GRAVITY;
      jumpVelocity -= gravity * dt;
      jumpY += jumpVelocity * dt;

      if (jumpY <= 0 && jumpVelocity < 0) {
        resetPlayer();
        return;
      }

      element.style.transform = `translateY(${-jumpY}px)`;
      jumpFrame = requestAnimationFrame(jumpStep);
    }

    function resetPlayer() {
      cancelAnimationFrame(jumpFrame);
      jumping = false;
      jumpY = 0;
      jumpVelocity = 0;
      jumpLastTime = null;
      element.style.transform = '';
    }

    //-----COLLISION-----//
    const sprites = {
      player:   { src: OguriRunning, nw: 0, nh: 0, box: { l: 0, t: 0, r: 1, b: 1 } },
      obstacle: { src: carrot,       nw: 0, nh: 0, box: { l: 0, t: 0, r: 1, b: 1 } },
      tamamo:   { src: tamamoImg,    nw: 0, nh: 0, box: { l: 0, t: 0, r: 1, b: 1 } },
    };

    function loadSprite(sprite) {
      const img = new Image();
      img.onload = () => {
        sprite.nw = img.naturalWidth;
        sprite.nh = img.naturalHeight;

        try {
          const canvas = document.createElement('canvas');
          canvas.width = sprite.nw;
          canvas.height = sprite.nh;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(img, 0, 0);
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

          let minX = sprite.nw, minY = sprite.nh, maxX = -1, maxY = -1;
          for (let y = 0; y < sprite.nh; y++) {
            for (let x = 0; x < sprite.nw; x++) {
              if (data[(y * sprite.nw + x) * 4 + 3] > ALPHA_THRESHOLD) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }

          if (maxX >= 0) {
            sprite.box = {
              l: minX / sprite.nw,
              t: minY / sprite.nh,
              r: (maxX + 1) / sprite.nw,
              b: (maxY + 1) / sprite.nh,
            };
          }
        } catch (error) {
          console.warn('Hindi mabasa yung pixels ng sprite.', error);
        }
      };
      img.src = sprite.src;
    }

    function getHitbox(rect, sprite, forgive) {
      let drawn = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };

      if (sprite.nw && sprite.nh) {
        const scale = Math.min(rect.width / sprite.nw, rect.height / sprite.nh);
        const w = sprite.nw * scale;
        const h = sprite.nh * scale;
        drawn = {
          left: rect.left + (rect.width - w) / 2,
          top: rect.top + (rect.height - h) / 2,
          width: w,
          height: h,
        };
      }

      let left = drawn.left + drawn.width * sprite.box.l;
      let right = drawn.left + drawn.width * sprite.box.r;
      let top = drawn.top + drawn.height * sprite.box.t;
      let bottom = drawn.top + drawn.height * sprite.box.b;

      const w = right - left;
      const h = bottom - top;
      left += w * (forgive.x || 0);
      right -= w * (forgive.x || 0);
      top += h * (forgive.top || 0);
      bottom -= h * (forgive.bottom || 0);

      return { left, right, top, bottom };
    }

    function overlaps(a, b) {
      return b.right > a.left && b.left < a.right && a.bottom > b.top && a.top < b.bottom;
    }

    // ibabalik: 'carrot' | 'tamamo' | null
    function checkCollision() {
      const player = getHitbox(element.getBoundingClientRect(), sprites.player, HITBOX_FORGIVENESS.player);
      const obstacle = getHitbox(obstacleElement.getBoundingClientRect(), sprites.obstacle, HITBOX_FORGIVENESS.obstacle);
      if (overlaps(player, obstacle)) return 'carrot';

      if (isDouble) {
        const twin = getHitbox(twinElement.getBoundingClientRect(), sprites.obstacle, HITBOX_FORGIVENESS.obstacle);
        if (overlaps(player, twin)) return 'carrot';
      }

      // sa Tamamo, kapag halos kita na siya (tapos na ang fade-in)
      if (tamamoActive && tamamoVisible > 0.6) {
        const tm = getHitbox(tamamoElement.getBoundingClientRect(), sprites.tamamo, HITBOX_FORGIVENESS.tamamo);
        if (overlaps(player, tm)) return 'tamamo';
      }

      return null;
    }

    //-----SCORE-----//
    let score = 0;        // buong numero na nakikita
    let scoreF = 0;       // eksaktong score (may decimal)
    let highscore = Number(localStorage.getItem('highscore')) || 0;
    let runStartHigh = highscore;
    let highScoreBroken = false;
    let blinkTimeout;

    function setScore(newScore) {
      score = newScore;
      setScoreState(newScore);
    }

    function setHighScore(newScore) {
      highscore = newScore;
      setHighScoreState(newScore);
      localStorage.setItem('highscore', newScore);
    }

    function checkForHighScore() {
      if (score > highscore) setHighScore(score);

      // nalagpasan ang dating highscore (isang beses kada laro, hindi sa unang laro)
      if (!highScoreBroken && runStartHigh > 0 && score > runStartHigh) {
        highScoreBroken = true;
        playBoosted(tmLaugh, 3);
        setBlink(true);
        clearTimeout(blinkTimeout);
        blinkTimeout = setTimeout(() => setBlink(false), BLINK_MS);
      }
    }

    //-----SPEED + OBSTACLE-----//
    let worldSpeed = BASE_SPEED;
    let obsX = 0;

    function getSpeed() {
      const extra = Math.max(0, scoreF - RAMP_START) * RAMP_RATE;
      return Math.min(MAX_SPEED, BASE_SPEED + extra);
    }

    function getDoubleChance() {
      return Math.min(0.6, 0.35 + Math.max(0, score - 1500) / 1500);
    }

    function shouldDouble(size) {
      return score >= DOUBLE_START_SCORE
        && DOUBLE_ALLOWED_SIZES.includes(size)
        && Math.random() < getDoubleChance();
    }

    function respawnObstacle() {
      const W = container.clientWidth;
      const size = OBSTACLE_SIZES[Math.floor(Math.random() * OBSTACLE_SIZES.length)];
      isDouble = shouldDouble(size);
      obstacleElement.className = `obstacle obstacle-${size}` + (isDouble ? ' obstacle-double' : '');

      obsX = W + Math.random() * 150;

      // kapag may Tamamo (o paparating pa lang), ilagay ang carrot sa likod niya
      if (tamamoActive || tamamoWarning) obsX = Math.max(obsX, tamamoX + 500);
    }

    function resetObstacle() {
      isDouble = false;
      obstacleElement.className = 'obstacle';
      obsX = container.clientWidth;
      obstacleElement.style.left = `${obsX}px`;
    }

    //-----TAMAMO CROSS-----//
    let tamamoActive = false;
    let tamamoWarning = false;
    let tamamoWarnLeft = 0;
    let tamamoX = 0;
    let tamamoAge = 0;
    let tamamoBase = 175;
    let tamamoVisible = 0;
    let nextTamamoScore = TAMAMO_START_SCORE;

    function scheduleTamamo() {
      nextTamamoScore = score + TAMAMO_GAP_SCORE + Math.random() * 100;
    }

    // pwede lang pumasok si Tamamo kapag nakalampas na ang carrot kay Oguri
    function safeToSpawnTamamo() {
      const player = element.getBoundingClientRect();
      const carrotRight = obstacleElement.getBoundingClientRect().right;
      const twinRight = isDouble ? twinElement.getBoundingClientRect().right : 0;
      return Math.max(carrotRight, twinRight) < player.left;
    }

    // 1) warning muna: "!" sa kanan + confident sound
    function startTamamoWarning() {
      if (score < TAMAMO_START_SCORE) return;
      tamamoWarning = true;
      tamamoWarnLeft = TAMAMO_WARN_SEC;
      tamamoX = container.clientWidth + 20;
      tamamoBase = TAMAMO_HEIGHTS[Math.floor(Math.random() * TAMAMO_HEIGHTS.length)];
      warnElement.style.bottom = `${tamamoBase + 15}px`;
      warnElement.classList.add('show');
      playSfx(tamamoConfident, 1000, 1.6);   // 0-1 sec lang
    }

    // 2) pagkatapos ng warning, saka siya papasok
    function spawnTamamo() {
      tamamoWarning = false;
      warnElement.classList.remove('show');

      tamamoActive = true;
      tamamoAge = 0;
      tamamoVisible = 0;
      tamamoX = container.clientWidth + 20;

      tamamoElement.style.opacity = '0';
      tamamoElement.style.left = `${tamamoX}px`;
      tamamoElement.style.bottom = `${tamamoBase + 70}px`;
      tamamoElement.style.display = 'block';
    }

    function despawnTamamo() {
      tamamoActive = false;
      tamamoWarning = false;
      tamamoVisible = 0;
      warnElement.classList.remove('show');
      tamamoElement.style.display = 'none';
      tamamoElement.style.opacity = '0';
    }

    function updateTamamo(dt) {
      if (tamamoWarning) {
        tamamoWarnLeft -= dt;
        if (tamamoWarnLeft <= 0) spawnTamamo();
        return;
      }

      if (tamamoActive) {
        tamamoAge += dt;

        // dahan-dahang bumibilis sa simula
        const ease = Math.min(tamamoAge / 1.5, 1);
        tamamoX -= worldSpeed * 1.1 * (0.5 + 0.5 * ease) * dt;

        // mahabang smooth na pagpasok: fade in + bumababa papunta sa lipad niya
        const enter = Math.min(Math.max((container.clientWidth + 20 - tamamoX) / 450, 0), 1);
        const smooth = enter * enter * (3 - 2 * enter);
        tamamoVisible = smooth;
        const bob = Math.sin(tamamoAge * 3) * 6;

        tamamoElement.style.left = `${tamamoX}px`;
        tamamoElement.style.bottom = `${tamamoBase + (1 - smooth) * 70 + bob}px`;
        tamamoElement.style.opacity = smooth;

        if (tamamoX < -200) {
          despawnTamamo();
          scheduleTamamo();
        }
      } else if (score >= nextTamamoScore && safeToSpawnTamamo()) {
        startTamamoWarning();
      }
    }

    //-----MAIN GAME LOOP-----//
    let frame = null;
    let lastTime = null;

    function loop(now) {
      if (isGameOver || !isStarted) return;

      if (lastTime === null) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // score
      scoreF += dt * SCORE_RATE;
      const whole = Math.floor(scoreF);
      if (whole !== score) {
        setScore(whole);
        checkForHighScore();
        setSunset(Math.floor(whole / SUNSET_EVERY) % 2 === 1);
      }

      // bilis
      worldSpeed = getSpeed();

      // carrot
      obsX -= worldSpeed * dt;
      if (obsX < -300) respawnObstacle();
      obstacleElement.style.left = `${obsX}px`;

      // Tamamo
      updateTamamo(dt);

      // collision
      const hit = checkCollision();
      if (hit) {
        stopGame(hit);
        return;
      }

      frame = requestAnimationFrame(loop);
    }

    //-----START / STOP-----//
    function stopGame(reason) {
      if (isGameOver) return;

      isGameOver = true;
      jumpHeld = false;
      cancelAnimationFrame(frame);
      stopAllMusic();

      if (reason === 'tamamo') {
        playBoosted(tamamoAhh, 2);
      } else {
        playSfx(sneeze);
      }

      setOverReason(reason);
      setGameOver(true);
    }

    function startGame() {
      isGameOver = false;
      setGameOver(false);
      setBlink(false);
      setSunset(false);
      resetPlayer();
      resetObstacle();
      despawnTamamo();

      score = 0;
      scoreF = 0;
      setScore(0);
      worldSpeed = BASE_SPEED;
      nextTamamoScore = TAMAMO_START_SCORE;

      runStartHigh = highscore;
      highScoreBroken = false;

      // music: intro muna, tapos crossfade sa theme
      stopAllMusic();
      bgmStarted = false;
      bgmFactor = 1;
      applyBgmVolume();
      playIntro();

      lastTime = null;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(loop);
    }

    function start() {
      if (isStarted) return;
      isStarted = true;
      setStarted(true);
      document.activeElement?.blur();
      startGame();
    }

    function restart() {
      if (!isGameOver) return;
      document.activeElement?.blur();
      startGame();
    }

    api.current = {
      start,
      restart,
      toggleMute: () => { toggleMute(); resumeMusicOnInput(); document.activeElement?.blur(); },
      setVolume: (v) => { setVolume(v); resumeMusicOnInput(); },
    };

    //-----LISTENERS-----//
    function onKeyDown(event) {
      if (event.key === ' ' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (event.repeat) return;
        jumpHeld = true;
        startJump();
      }
    }
    function onKeyUp(event) {
      if (event.key === ' ' || event.key === 'ArrowUp') jumpHeld = false;
    }
    function onPointerDown() {
      jumpHeld = true;
      startJump();
    }
    function onPointerUp() {
      jumpHeld = false;
    }
    function stop(event) {
      event.stopPropagation();
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('keydown', resumeMusicOnInput);
    document.addEventListener('pointerdown', resumeMusicOnInput);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('pointerdown', onPointerDown);
    audioControl.addEventListener('pointerdown', stop);
    audioControl.addEventListener('keydown', stop);

    // ang JS na ang gumagalaw sa carrot, kaya patayin ang CSS animation niya
    obstacleElement.style.animation = 'none';
    obstacleElement.style.left = `${container.clientWidth * 0.8}px`;

    loadSprite(sprites.player);
    loadSprite(sprites.obstacle);
    loadSprite(sprites.tamamo);

    //-----CLEANUP (pag umalis sa Game page)-----//
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('keydown', resumeMusicOnInput);
      document.removeEventListener('pointerdown', resumeMusicOnInput);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('pointerdown', onPointerDown);
      audioControl.removeEventListener('pointerdown', stop);
      audioControl.removeEventListener('keydown', stop);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(jumpFrame);
      clearTimeout(blinkTimeout);
      if (audioCtx) audioCtx.close().catch(() => {});
      stopAllMusic();
    };
  }, []);

  const level = muted ? 0 : volume;
  const ateTamamo = overReason === 'tamamo';

  return (
    <>
      <section className='title-section'>
        <h1 className='game-title'>OGURI-RUN</h1>
        <p className='sub-title-game'>Oguri Cap has gained a little weight. Help her get back in racing shape—and take a break from carrots for now!</p>
        <p className='meta-desc-game'>Inspired by Google Chrome's Dinosaur Game. This is a fan-made project created purely for entertainment and is not affiliated with or endorsed by Google.

All characters, music, and other Uma Musume-related assets featured in this project are the property of <b>Cygames</b>, Inc. This fan-made project is not affiliated with, endorsed by, or officially associated with Cygames in any way.

All rights to their respective properties belong to their original owners.</p>
      </section>

      <section className='game-section'>
        <div
          ref={containerRef}
          className={`game-container ${!started ? 'waiting' : ''} ${gameOver ? 'stop' : ''}`}
        >

          {/*Sunset background (nagfa-fade in/out)*/}
          <div className={`bg-sunset ${sunset ? 'show' : ''}`}></div>

          <div className={`score-card ${blink ? 'blink' : ''}`}>
            <span className="label">HIGH SCORE</span>
            <span className="high-score">{highScore}</span>
            <span className="label">SCORE</span>
            <span className="score">{score}</span>
          </div>

          <div className="audio-control" ref={audioRef}>
            <button
              className={`btn-mute ${level === 0 ? 'is-muted' : ''} ${level > 0 && level < 0.5 ? 'is-low' : ''}`}
              type="button"
              aria-label="Mute or unmute music"
              onClick={() => api.current.toggleMute()}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path className="speaker" d="M3 9v6h4l5 4V5L7 9H3z" />
                <path className="wave wave-1" d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path className="wave wave-2" d="M18 6a8.5 8.5 0 0 1 0 12" />
                <path className="x" d="M16 9l5 6M21 9l-5 6" />
              </svg>
            </button>
            <input
              className="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={level}
              style={{ '--fill': `${level * 100}%` }}
              onChange={(e) => api.current.setVolume(parseFloat(e.target.value))}
              onPointerUp={(e) => e.currentTarget.blur()}
              aria-label="Music volume"
            />
          </div>

          <div className="player" ref={playerRef}></div>

          <div className="obstacle" ref={obstacleRef}>
            <div className="obstacle-twin" ref={twinRef}></div>
          </div>

          {/*Tamamo Cross (lumilipad)*/}
          <div
            className="tamamo"
            ref={tamamoRef}
            style={{ backgroundImage: `url(${tamamoImg})` }}
          ></div>
          <div className="tamamo-warn" ref={warnRef}>!</div>

          <div className={`start-game ${!started ? 'show' : ''}`}>
            <div className="content">
              <span className="text">START</span>
              <button
                onClick={() => api.current.start()}
                className="btn-start-game"
                style={{ backgroundImage: `url(${ogurirestart})` }}
              ></button>
            </div>
          </div>

          <div className={`restart-game ${gameOver ? 'show' : ''}`}>
            <div className="over-msg">
              {ateTamamo ? 'YOU ATE TAMAMO CROSS!' : 'GAME OVER'}
            </div>
            <div className="content">
              <span className="text">{ateTamamo ? 'TRY AGAIN' : 'RESTART'}</span>
              <button
                onClick={() => api.current.restart()}
                className="btn-reset-game"
                style={{ backgroundImage: `url(${ogurirestart})` }}
              ></button>
            </div>
          </div>

        </div>
      </section>

      <section className='how-to'>
        <h2 className='how-to-heading'>How to Play</h2>

        <div className='how-to-item'>
          <span className='how-to-icon'>
            <svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </span>
          <div>
            <h3 className='how-to-title'>Jump</h3>
            <p className='how-to-text'>Press Space, press the Up Arrow key, or left-click to make Oguri jump.</p>
          </div>
        </div>

        <div className='how-to-item'>
          <span className='how-to-icon'>
            <svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /></svg>
          </span>
          <div>
            <h3 className='how-to-title'>Dodge the carrots and Tamamo Cross</h3>
            <p className='how-to-text'>Avoid as many carrots as you can and keep running! Tamamo Cross flies high, so don't jump when she shows up.</p>
          </div>
        </div>

        <div className='how-to-item'>
          <span className='how-to-icon'>
            <svg viewBox="0 0 24 24"><path d="M8 5l11 7-11 7V5z" /></svg>
          </span>
          <div>
            <h3 className='how-to-title'>Start &amp; restart</h3>
            <p className='how-to-text'>Click Oguri's face to start. After Game Over, click her face again to restart.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Game;