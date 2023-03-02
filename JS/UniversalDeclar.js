//Make the canvas the full screen of the HTML block (which for this instance, is the size of the entire window)
let gameStage = new createjs.Stage("canvas");
let canvas = document.getElementById('canvas');
let timePassed= -1;
let allWaves = [
    {"wave": 0, "normal": 3, "ranged": 0, "brute": 0, "event": 0},
    {"wave": 1, "normal": 4, "ranged": 0, "brute": 0, "event": 0},
    {"wave": 2, "normal": 5, "ranged": 0, "brute": 0, "event": 0},
    {"wave": 3, "normal": 6, "ranged": 0, "brute": 0, "event": 0},
    {"wave": 4, "normal": 7, "ranged": 0, "brute": 0, "event": 0},
    {"wave": 5, "normal": 9, "ranged": 0, "brute": 0, "event": 0},
    {"wave": 6, "normal": 13, "ranged": 0, "brute": 0, "event": 0},
    {"wave": 7, "normal": 0, "ranged": 0, "brute": 0, "event": 1},
    {"wave": 8, "normal": 6, "ranged": 0, "brute": 0, "event": 0},
    {"wave": 9, "normal": 10, "ranged": 0, "brute": 0, "event": 0},
    {"wave": 10, "normal": 0, "ranged": 2, "brute": 0, "event": 0},
    {"wave": 11, "normal": 5, "ranged": 2, "brute": 0, "event": 0},
    {"wave": 12, "normal": 9, "ranged": 4, "brute": 0, "event": 0},
    {"wave": 13, "normal": 12, "ranged": 5, "brute": 0, "event": 0},
    {"wave": 14, "normal": 0, "ranged": 0, "brute": 0, "event": 1},
    {"wave": 15, "normal": 10, "ranged": 1, "brute": 0, "event": 0},
    {"wave": 16, "normal": 15, "ranged": 3, "brute": 0, "event": 0},
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

let bg = new createjs.Shape()
    bg.graphics.beginFill("#222222").drawRect(0,0,canvas.width, canvas.height);
    bg.aName = 'background'


let environmentWalls = [];//Dynamically create a border wall around the playspace
let wallThickness = 100;//Set a univeral wall thickness.
//this will also help set up a invisible rectangle thatll prevent the player / bullets from walking offscreen (see walkspace declaration)
for (let i = 0; i < 4; i++){
    environmentWalls.push(new createjs.Shape()) //each of the four walls are set up dynamically, only using 0, canvas width, and height
    switch (i) {
        case 0://x,y,width,height
            environmentWalls[i].graphics.beginFill("#DDDDDD").drawRect(0,0, canvas.width, wallThickness);
        break;
        case 1:
            environmentWalls[i].graphics.beginFill("#DDDDDD").drawRect(canvas.width-wallThickness,0, wallThickness, canvas.height);
        break;
        case 2:
            environmentWalls[i].graphics.beginFill("#DDDDDD").drawRect(0,canvas.height-wallThickness, canvas.width, wallThickness);
        break;
        case 3:
            environmentWalls[i].graphics.beginFill("#DDDDDD").drawRect(0,0, wallThickness, canvas.height);
        break;
        default:
            environmentWalls[i].graphics.beginFill("#AAAAAA").drawRect((canvas.width/2)-50, (canvas.height/2)-50, wallThickness,wallThickness);
    }
    environmentWalls[i].aName = 'environment wall '+i
}


let walkspace = new createjs.Rectangle(wallThickness, wallThickness, canvas.width-wallThickness, canvas.height-wallThickness);
    walkspace.aName = 'walkspace';

let testCollide = new createjs.Shape()
    testCollide.graphics.beginFill("#888888").drawRect(0,0,30,80);
    testCollide.setBounds(0,0,30,30);

    testCollide.x = 500;
    testCollide.y = 500;
    testCollide.isEnemy = true;
    testCollide.aName = 'test';

   
function init(){
    philModel.x = canvas.width/2;
    philModel.y = canvas.height/2;

    gameStage.addChild(bg);

    for (let i = 0; i < environmentWalls.length; i++){
        gameStage.addChild(environmentWalls[i])
    }
    gameStage.addChild(testCollide);
    gameStage.addChild(philModel);

    phil = new Player(25, 100, philModel);
    toolEquipped = new Tool("torch");
    enemySpawnManager = new Enemy();
    powerupSpawnManager = new Upgrade();
    gameStage.update();
    

    createjs.Ticker.addEventListener("tick", update);
    createjs.Ticker.addEventListener("tick", startNextWave);

    gameStage.addEventListener("stagemousemove", rotatePlayer);
    gameStage.addEventListener("click", shoot)
    
    window.addEventListener("keydown", keysDown);
    window.addEventListener("keypress", toolEquipped.swapTool);
    window.addEventListener("keyup", keysUp);
    waveCleared = false;
}

function keysDown(event)//when a key is pressed, mark its keycode and set it as true or false.
//Then somewhere else in the code I can just check this array to see if the keycode is true or false for input.
{
    keysPressed[event.keyCode] = true;
}
function keysUp(event)
{
    keysPressed[event.keyCode] = false;
}

function rotatePlayer(event){
    phil.playerRotation(event)
}
function shoot(event){
    toolEquipped.createProjectile(toolEquipped.model, event)
}

function update(event){
    gameStage.update()
    phil.playerMovement();
    toolEquipped.updateBullets();
    enemySpawnManager.enemyMovement();
}

function startNextWave(){
    if (timePassed + 5 <= Math.floor(createjs.Ticker.getTime()/1000)&& waveCleared){
        curWave++;
        if (allWaves[curWave]== undefined){
            createjs.Ticker.removeEventListener("tick", startNextWave);

        }
        console.log(allWaves[curWave])
        if (allWaves[curWave].event == 1){
            console.log('creating a event instead')
            if (curWave == 7 || curWave == 14){
                powerupSpawnManager.createPowerup("tool");
            }
            if (curWave == 14){
                powerupSpawnManager.createPowerup('health');
                powerupSpawnManager.createPowerup('health');
            }
            if (curWave == 21){
                powerupSpawnManager.createPowerup('statBoost');
                powerupSpawnManager.createPowerup('health');
                powerupSpawnManager.createPowerup('health');
            }
            if (curWave == 28){
                powerupSpawnManager.createPowerup('statBoost');
                powerupSpawnManager.createPowerup('health');
                powerupSpawnManager.createPowerup('health');
            }
            if (curWave == 35){
                powerupSpawnManager.createPowerup('health');
                powerupSpawnManager.createPowerup('health');
                powerupSpawnManager.createPowerup('health');
            }
   
        } else {
            for (let i =0; i < allWaves[curWave].normal; i++){
                enemySpawnManager.spawnEnemy('normal')
            }
            for (let i =0; i < allWaves[curWave].ranged; i++){
                    enemySpawnManager.spawnEnemy('range')
            }
            for (let i =0; i < allWaves[curWave].brute; i++){
                enemySpawnManager.spawnEnemy('brute')
            }
        }
        
        waveCleared = false;
        console.log("wave "+ curWave +"!")
    }
}

function collectEndTime(){
    if (powerups.length ==0 && enemies.length ==0){
        timePassed = Math.floor(createjs.Ticker.getTime()/1000);
        waveCleared = true;
    }
    
}
function spawnEnemies(){
    enemySpawnManager.spawnEnemy("range");
    enemySpawnManager.spawnEnemy("normal");
    enemySpawnManager.spawnEnemy("brute");
    enemySpawnManager.spawnEnemy("normal", 10);
    enemySpawnManager.spawnEnemy("normal", 10);
    enemySpawnManager.spawnEnemy("normal", 9);
}