const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

// Fyzika
const GRAVITY = 0.55;
const JUMP_FORCE = -13;
const MOVE_SPEED = 4.5;

// Stav hry
let state = 'menu';
let score = 0;
let lives = 3;
let currentLevel = 0;
const TOTAL_LEVELS = 3;

// Stav hvězd
let savedStarState = null;
let savedScore = 0;

const keys = {};
window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) {
        e.preventDefault();
    }
});
window.addEventListener('keyup', e => {
    keys[e.code] = false;
});

const msgBox = document.getElementById('message-box');
const msgBtn = document.getElementById('msg-btn');
const msgTitle = document.getElementById('msg-title');
const msgBody = document.getElementById('msg-body');

msgBtn.addEventListener('click', () => {
    if (state === 'menu' || state === 'gameover' || state === 'allwin') {
        lives = 3;
        score = 0;
        currentLevel = 0;
        savedStarState = null;
        savedScore = 0;
        loadLevel(0);
    } else if (state === 'dead') {
        loadLevel(currentLevel, true);
    } else if (state === 'levelwin') {
        currentLevel++;
        savedStarState = null;
        savedScore = 0;
        loadLevel(currentLevel);
    }
});