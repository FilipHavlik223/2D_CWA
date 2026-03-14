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