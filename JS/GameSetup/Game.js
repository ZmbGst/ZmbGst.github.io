function init(){
    philModel.x = canvas.width/2;
    philModel.y = canvas.height/2;

    gameStage.addChild(bg);

    for (let i = 0; i < 4; i++){
        gameStage.addChild(environmentWalls[i])
    }
    gameStage.addChild(patioBottom);
    gameStage.addChild(philModel); //add anything after this that'll be above phil and enemies and bullets and all that
    for (let i = 4; i < environmentWalls.length; i++){
        gameStage.addChild(environmentWalls[i])
    }
    
    gameStage.addChild(patioTop);
    gameStage.addChild(pottedScrunkly);
    gameStage.addChild(UIStuff);

    phil = new Player(25, playerHealth.healthMax, philModel);
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
    moveEye();
  
}

function startNextWave(){
    if (!playingPhoneAnim){
        pottedScrunkly.gotoAndPlay("getPhone");
        playingPhoneAnim = true;

    }
    if (timePassed + 5 <= Math.floor(createjs.Ticker.getTime()/1000)&& waveCleared){
        
        curWave++;
        if (allWaves[curWave]== undefined){
            createjs.Ticker.removeEventListener("tick", startNextWave);
        }
        if (allWaves[curWave].event == 1){
            if (curWave == 7 || curWave == 14){
                powerupSpawnManager.createPowerup("tool");
            }
            else if (curWave == 14){
                powerupSpawnManager.createPowerup('health');
                powerupSpawnManager.createPowerup('health');
            }
            else if (curWave == 21){
                powerupSpawnManager.createPowerup('statBoost');
                powerupSpawnManager.createPowerup('health');
                powerupSpawnManager.createPowerup('health');
            }
            else if (curWave == 28){
                powerupSpawnManager.createPowerup('statBoost');
                powerupSpawnManager.createPowerup('health');
                powerupSpawnManager.createPowerup('health');
            }
            else if (curWave == 35){
                powerupSpawnManager.createPowerup('health');
                powerupSpawnManager.createPowerup('health');
                powerupSpawnManager.createPowerup('health');
            }
            else {
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
        waveCurrentlyGoing = true;
        waveText.text = "Wave " + (curWave+1)
        waveDescription.text = allWaves[curWave].description;
        waveBannerAnimation.gotoAndPlay(0);
    }
}

function collectEndTime(){
    if (powerups.length ==0 && enemies.length ==0){
        timePassed = Math.floor(createjs.Ticker.getTime()/1000);
        waveCleared = true;
    }
    
}