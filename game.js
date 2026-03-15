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

function getAllLevels() {
    return [

        // LEVEL 1
        {
            name: 'Level 1 — Základna',
            robotSpeed: 1.1,
            platforms: [
                {x: 0, y: 460, w: 800, h: 40},
                {x: 80, y: 380, w: 110, h: 16},
                {x: 0, y: 300, w: 90, h: 16},
                {x: 240, y: 350, w: 130, h: 16},
                {x: 430, y: 300, w: 120, h: 16},
                {x: 300, y: 220, w: 100, h: 16},
                {x: 620, y: 380, w: 120, h: 16},
                {x: 680, y: 280, w: 120, h: 16},
                {x: 310, y: 130, w: 180, h: 16},
            ],
            stars: [
                {x: 110, y: 355}, {x: 150, y: 355}, {x: 30, y: 275}, {x: 65, y: 275},
                {x: 270, y: 325}, {x: 310, y: 325}, {x: 460, y: 275}, {x: 500, y: 275},
                {x: 320, y: 195}, {x: 355, y: 195}, {x: 645, y: 355}, {x: 680, y: 355},
                {x: 700, y: 255}, {x: 735, y: 255},
            ],
            jetpack: {x: 390, y: 268},
            key: {x: 340, y: 110},
            exit: {x: 440, y: 120},
            robots: [
                {x: 250, y: 334, dir: 1, left: 242, right: 368},
                {x: 440, y: 284, dir: 1, left: 432, right: 548},
                {x: 630, y: 364, dir: 1, left: 622, right: 738},
            ],
            playerStart: {x: 50, y: 420},
        },

        // LEVEL 2
        {
            name: 'Level 2 — Asteroid pás',
            robotSpeed: 1.5,
            platforms: [
                {x: 0, y: 460, w: 150, h: 40},   // start
                {x: 270, y: 460, w: 100, h: 40},
                {x: 510, y: 460, w: 110, h: 40},
                {x: 690, y: 460, w: 110, h: 40},
                {x: 155, y: 395, w: 85, h: 14},   // spodní patro
                {x: 350, y: 375, w: 75, h: 14},
                {x: 500, y: 320, w: 95, h: 14},
                {x: 645, y: 360, w: 80, h: 14},
                {x: 30, y: 285, w: 105, h: 14},   // střední patro
                {x: 210, y: 255, w: 85, h: 14},
                {x: 390, y: 230, w: 100, h: 14},
                {x: 590, y: 265, w: 90, h: 14},
                {x: 110, y: 175, w: 95, h: 14},   // horní patro
                {x: 340, y: 155, w: 80, h: 14},
                {x: 570, y: 170, w: 100, h: 14},
                {x: 100, y: 80, w: 120, h: 14},   // klíčová platforma
                {x: 430, y: 70, w: 180, h: 14},   // exit platforma
            ],
            stars: [
                {x: 185, y: 370}, {x: 375, y: 350}, {x: 535, y: 295}, {x: 670, y: 335},
                {x: 70, y: 260}, {x: 430, y: 205}, {x: 625, y: 240},
                {x: 145, y: 150}, {x: 370, y: 130}, {x: 610, y: 145}, {x: 720, y: 435},
            ],
            jetpack: {x: 245, y: 230},
            key: {x: 155, y: 70},   // klíč
            exit: {x: 560, y: 60},   // exit
            robots: [
                {x: 40, y: 269, dir: 1, left: 32, right: 133},
                {x: 220, y: 239, dir: 1, left: 212, right: 293},
                {x: 400, y: 214, dir: 1, left: 392, right: 488},
                {x: 600, y: 249, dir: 1, left: 592, right: 678},
            ],
            playerStart: {x: 30, y: 420},
        },

        // LEVEL 3
        {
            name: 'Level 3 — Orbitální stanice',
            robotSpeed: 1.9,
            platforms: [
                {x: 0, y: 460, w: 100, h: 40},   // start
                {x: 690, y: 460, w: 110, h: 40},   // pravý okraj
                {x: 145, y: 415, w: 65, h: 14},   // spodní skoky
                {x: 285, y: 395, w: 75, h: 14},
                {x: 435, y: 418, w: 60, h: 14},
                {x: 575, y: 400, w: 80, h: 14},
                {x: 50, y: 328, w: 85, h: 14},   // střední patro
                {x: 205, y: 308, w: 70, h: 14},
                {x: 345, y: 285, w: 90, h: 14},
                {x: 510, y: 315, w: 75, h: 14},
                {x: 665, y: 330, w: 85, h: 14},
                {x: 90, y: 225, w: 75, h: 14},   // horní patro
                {x: 255, y: 205, w: 85, h: 14},
                {x: 430, y: 185, w: 70, h: 14},
                {x: 610, y: 210, w: 80, h: 14},
                {x: 180, y: 110, w: 175, h: 14},   // exit platforma
            ],
            stars: [
                {x: 170, y: 390}, {x: 310, y: 370}, {x: 460, y: 393}, {x: 600, y: 375},
                {x: 82, y: 303}, {x: 235, y: 283}, {x: 385, y: 260},
                {x: 697, y: 305}, {x: 120, y: 200}, {x: 290, y: 180},
                {x: 645, y: 185},
            ],
            jetpack: {x: 520, y: 299},
            key: {x: 462, y: 160},   // klíč
            exit: {x: 280, y: 100},   // exit
            robots: [
                {x: 58, y: 312, dir: 1, left: 52, right: 133},
                {x: 215, y: 292, dir: 1, left: 207, right: 273},
                {x: 355, y: 269, dir: 1, left: 347, right: 433},
                {x: 520, y: 299, dir: 1, left: 512, right: 583},
                {x: 620, y: 194, dir: 1, left: 612, right: 688},
            ],
            playerStart: {x: 20, y: 420},
        },

    ];
}
