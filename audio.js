/* ============================================================
   audio.js — shared across every page
   - Generates a gentle looping guitar-style arpeggio with the
     Web Audio API, so the site has music with zero external
     files needed. (See the note at the bottom of this file if
     you'd rather use a real song you own.)
   - Provides a firework "boom" sound.
   - Remembers mute state + page count across the site via
     sessionStorage, so the journey feels continuous.
   ============================================================ */

const BDAY = (() => {
  let ctx = null;
  let master = null;
  let started = false;
  let muted = sessionStorage.getItem('abhinav_muted') === '1';
  let loopTimer = null;

  function ensureCtx(){
    if (!ctx){
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.55;
      master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
  }

  // one gentle "plucked string" note
  function pluck(freq, time, dur = 1.1, vol = 0.22){
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;

    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 2200;

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(filt).connect(gain).connect(master);
    osc.start(time);
    osc.stop(time + dur + 0.05);
  }

  // gentle chord progression, arpeggiated — an easy, warm guitar feel
  const PROGRESSION = [
    [220.00, 261.63, 329.63, 392.00],   // Am7-ish
    [174.61, 220.00, 261.63, 349.23],   // F
    [196.00, 246.94, 293.66, 392.00],   // C/G-ish
    [196.00, 246.94, 329.63, 392.00],   // G
  ];

  function scheduleLoop(){
    if (!ctx) return;
    const now = ctx.currentTime + 0.1;
    const noteDur = 0.62;
    let t = now;
    PROGRESSION.forEach(chord => {
      chord.forEach((freq, i) => pluck(freq, t + i * noteDur, noteDur * 1.9, i === 0 ? 0.16 : 0.12));
      t += noteDur * chord.length;
    });
    const totalDur = (t - now) * 1000;
    loopTimer = setTimeout(scheduleLoop, totalDur - 40);
  }

  function start(){
    ensureCtx();
    if (started) return;
    started = true;
    scheduleLoop();
  }

  function setMuted(val){
    muted = val;
    sessionStorage.setItem('abhinav_muted', muted ? '1' : '0');
    if (master) master.gain.setTargetAtTime(muted ? 0 : 0.55, ctx.currentTime, 0.15);
  }

  function toggleMute(){ setMuted(!muted); return muted; }

  // a short noise-burst "boom" for fireworks
  function boom(){
    ensureCtx();
    const dur = 0.6;
    const bufferSize = ctx.sampleRate * dur;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++){
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2.2);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.setValueAtTime(1800, ctx.currentTime);
    filt.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(muted ? 0 : 0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

    noise.connect(filt).connect(gain).connect(ctx.destination);
    noise.start();
  }

  // wire the fixed sound-toggle button that every page includes
  function wireToggleButton(){
    const btn = document.querySelector('.sound-toggle');
    if (!btn) return;
    const render = () => { btn.textContent = muted ? '🔇' : '🔊'; };
    render();
    btn.addEventListener('click', () => {
      start();
      const isMuted = toggleMute();
      render();
    });
  }

  // start music on the first interaction anywhere on the page
  // (browsers require a gesture; this makes it feel automatic)
  function autoStartOnFirstGesture(){
    if (muted) { /* still need a context ready for later unmute */ }
    const kick = () => { start(); window.removeEventListener('click', kick); window.removeEventListener('touchstart', kick); window.removeEventListener('keydown', kick); };
    window.addEventListener('click', kick, { once:true });
    window.addEventListener('touchstart', kick, { once:true });
    window.addEventListener('keydown', kick, { once:true });
  }

  function scatterStars(container, count = 60){
    if (!container) return;
    for (let i = 0; i < count; i++){
      const s = document.createElement('span');
      s.style.left = Math.random() * 100 + 'vw';
      s.style.top = Math.random() * 100 + 'vh';
      s.style.animationDelay = (Math.random() * 3.5) + 's';
      s.style.width = s.style.height = (Math.random() < 0.15 ? 3 : 2) + 'px';
      container.appendChild(s);
    }
  }

  function note(freq){
    ensureCtx();
    pluck(freq, ctx.currentTime, 1.3, 0.3);
  }

  return { start, toggleMute, wireToggleButton, autoStartOnFirstGesture, boom, scatterStars, note };
})();

document.addEventListener('DOMContentLoaded', () => {
  const starHost = document.querySelector('.stars');
  if (starHost) BDAY.scatterStars(starHost);
  BDAY.wireToggleButton();
  BDAY.autoStartOnFirstGesture();
});

/* ------------------------------------------------------------
   Want a real song instead of the generated guitar loop?
   Drop an mp3 you own the rights to at assets/audio/bgm.mp3
   and replace scheduleLoop()'s call site with a simple:
     const el = new Audio('assets/audio/bgm.mp3');
     el.loop = true; el.volume = 0.5; el.play();
   This file uses a generated loop by default so the page works
   immediately with no extra files and no copyright concerns.
------------------------------------------------------------- */
