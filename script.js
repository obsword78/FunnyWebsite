// =====================
// ELEMENTS
// =====================
const blob = document.querySelector(".blob");
const speech = document.getElementById("speech");

// =====================
// CONFIG
// =====================
const SIZE = 80;
const OFFSET_Y = -60;

const BOUNDS = () => ({
  maxX: window.innerWidth - SIZE,
  maxY: window.innerHeight - SIZE,
});

// =====================
// STATE
// =====================
let speaking = false;
let lineIndex = 0;

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;

let vx = 0;
let vy = 0;

let targetX = randomX();
let targetY = randomY();

// =====================
// SCRIPT
// =====================
const script = [
  "Hi",
  "Welcome to Zach's stupid website.",
  "For some reason, instead of putting his Web Media Artefact on a normal website, like YouTube",
  "He instead decided to make a website for it instead",
  "Why? Because why not? He said.",
  "He couldn't even be bothered to maintain it, so here I am.",
  "I'm meant to be your awesome assistant blob friend, by the way.",
  "Now, before you watch the artefact, I just want to say that it's not really that good.",
  "Also, sign this Agreement before you watch the artefact.",
];

// =====================
// HELPERS
// =====================
function randomX() {
  return Math.random() * (window.innerWidth - SIZE);
}

function randomY() {
  return Math.random() * (window.innerHeight - SIZE);
}

function setNewTarget() {
  targetX = randomX();
  targetY = randomY();
}

function clampPosition() {
  const { maxX, maxY } = BOUNDS();
  x = Math.max(0, Math.min(maxX, x));
  y = Math.max(0, Math.min(maxY, y));
}

// =====================
// MOVEMENT
// =====================
function updateMovement() {
  const wobble = Math.sin(Date.now() * 0.005) * (speaking ? 0.2 : 1);
  vx += (targetX - x) * 0.0005;
  vy += (targetY - y) * 0.0005;

  vx *= speaking ? 0.7 : 0.9;
  vy *= speaking ? 0.7 : 0.9;

  x += vx + wobble;
  y += vy + wobble;

  clampPosition();
}

// =====================
// RENDER LOOP
// =====================
function animate() {
  updateMovement();
  blob.style.transform = `translate(${x}px, ${y}px)`;

  const wobble = Math.sin(Date.now() * 0.005) * 5;

  speech.style.transform = `translate(${x - SIZE}px, ${y + OFFSET_Y + wobble}px)`;

  requestAnimationFrame(animate);
}

// =====================
// SPEECH SYSTEM
// =====================
function speak(text, duration = 2500) {
  speaking = true;

  speech.textContent = text;
  speech.style.opacity = 1;

  setTimeout(() => {
    speech.style.opacity = 0;
    speaking = false;
  }, duration);
}

function runScript() {
  if (lineIndex >= script.length) return;

  speak(script[lineIndex]);
  lineIndex++;

  setTimeout(runScript, 3000);
}

// =====================
// INIT
// =====================
fetch("agreement.txt")
  .then((res) => res.text())
  .then((text) => {
    document.getElementById("agreement").textContent = text;
  });
setTimeout(runScript, 3000);
setInterval(setNewTarget, 2000 + Math.random() * 2000);
animate();
