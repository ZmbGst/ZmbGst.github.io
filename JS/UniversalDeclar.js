//Make the canvas the full screen of the HTML block (which for this instance, is the size of the entire window)
let gameStage = new createjs.Stage("canvas");
let canvas = document.getElementById('canvas');
let timePassed= -1;
let allWaves = [
    {"wave": 0, "normal": 3, "ranged": 0, "brute": 0, "event": 0, "description": "Welcome to the backyard!"},
    {"wave": 1, "normal": 2, "ranged": 0, "brute": 0, "event": 0, "description": "Those things were Scrunklies. They want to kill you"},
    {"wave": 2, "normal": 3, "ranged": 0, "brute": 0, "event": 0, "description": "The Scrunklies love this backyard and will do anything to stay"},
    {"wave": 3, "normal": 4, "ranged": 0, "brute": 0, "event": 0, "description": "They stole your tools and you're next."},
    {"wave": 4, "normal": 4, "ranged": 0, "brute": 0, "event": 0, "description": "Don't worry about the one in the pot, they just call in reinforcements"},
    {"wave": 5, "normal": 5, "ranged": 0, "brute": 0, "event": 0, "description": "Every seven waves, the Scrunklies need to regroup, perfect for a break."},
    {"wave": 6, "normal": 6, "ranged": 0, "brute": 0, "event": 0, "description": "This would be a lot easier if you had another tool"},
    {"wave": 7, "normal": 7, "ranged": 0, "brute": 0, "event": 1, "description": "Speak of the devil..."},
    {"wave": 8, "normal": 6, "ranged": 0, "brute": 0, "event": 0, "description": "You just got your tablesaw. Press Q and try it out!"},
    {"wave": 9, "normal": 10, "ranged": 0, "brute": 0, "event": 0, "description": "Your tablesaw travels far! Have you tried bunching up Scrunklies?"},
    {"wave": 10, "normal": 0, "ranged": 2, "brute": 0, "event": 0, "description": "Here comes the Slingly Scrunklies, they like to keep their distance."},
    {"wave": 11, "normal": 5, "ranged": 2, "brute": 0, "event": 0, "description": "They FUCKING explode when they die!"},
    {"wave": 12, "normal": 9, "ranged": 4, "brute": 0, "event": 0, "description": "Slingy Scrunklies are vulnerable while they're regrowing their seed head."},
    {"wave": 13, "normal": 12, "ranged": 5, "brute": 0, "event": 0, "description": "I dont know. Oh my god... Wow ok. -Ryna (your boss)"},
    {"wave": 14, "normal": 0, "ranged": 0, "brute": 0, "event": 1, "description": "Wonderful, another tool AND more health"},
    {"wave": 15, "normal": 10, "ranged": 1, "brute": 0, "event": 0, "description": "Your propane tank is a lot slower, but deals a lot more damage"},
    {"wave": 16, "normal": 15, "ranged": 3, "brute": 0, "event": 0, "description": ""},
    {"wave": 17, "normal": 25, "ranged": 0, "brute": 0, "event": 0},
    {"wave": 18, "normal": 10, "ranged": 0, "brute": 1, "event": 0},
    {"wave": 19, "normal": 16, "ranged": 6, "brute": 1, "event": 0},
    {"wave": 20, "normal": 20, "ranged": 8, "brute": 2, "event": 0},
    {"wave": 21, "normal": 0, "ranged": 0, "brute": 0, "event": 1},
    {"wave": 22, "normal": 20, "ranged": 8, "brute": 2, "event": 0},
    {"wave": 23, "normal": 24, "ranged": 10, "brute": 2, "event": 0},
    {"wave": 24, "normal": 27, "ranged": 15, "brute": 1, "event": 0},
    {"wave": 25, "normal": 42, "ranged": 0, "brute": 4, "event": 0},
];

let waveCleared = false;
let curWave = -1;
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let keysPressed  = {}; //see keys up / down function

let toolEquipped;
let enemySpawnManager;
let powerupSpawnManager;

   
