let enemies = [];
let spits = []; //spit will be in its own area because enemies will follow the player. spit just goes in one direction
class Enemy {
    constructor(){
    }
    spawnEnemy(type, rangeIndex){
        
        let enemy;
       switch (type){
            case "range":
                enemy = new createjs.Sprite(slingyScrunklySpritesheet, "spawn");
                    enemy.scale = .12;
                    enemy.damage = 10;
                    enemy.health = 2;
                    enemy.speed = Math.random() * (10-7)+7;
                    enemy.deathTime = 14/24 //19 frames in death animation and 24 fps
                    enemy.distanceAway = 300;
                    enemy.cooldown = 0;
                    enemy.isShooting = false;
            break;
            case 'brute':
                enemy = new createjs.Shape();
                
                enemy.graphics.beginFill("#046137").drawRect(0,0,70,70);
                enemy.setBounds(0,0,70,70);
                enemy.damage = 30;
                enemy.health = 20;
                enemy.speed = Math.random() * (8-5)+5;
            break;
            case 'spit':
                enemy = new createjs.Shape();

                enemy.graphics.beginFill("#ccffcc").drawRect(0,0,10,10);
                enemy.setBounds(0,0,10,10);
                enemy.damage = 5;
                enemy.health = 1;
                enemy.speed = Math.random() * (13-7)+7;
            break;
            case 'normal':
            default:
                enemy = new createjs.Sprite(starScrunklySpritesheet, "spawn")
                    enemy.scale = .1;     
                    enemy.damage = 10;   
                    enemy.health = 2; 
                    enemy.speed = Math.random() * (13-7)+7;
                    enemy.deathTime = 19/24 //19 frames in death animation and 24 fps

            break;
        }
        enemy.on("animationend", function(event){
            if (event.name =='dead'){
                enemySpawnManager.enemyKill(enemy);
            }
        })
        enemy.enemyNumber = enemies.length;
        enemy.isEnemy = true;
        enemy.isDead = false;
        
        if (type  == undefined){
            enemy.aName = "normal " + enemy.enemyNumber;
        } else{
            enemy.aName = type +" " + enemy.enemyNumber;
        }

        if (type !== 'spit'){
            let random = Math.round(Math.random()); //either spawn enemy on left and right or top and bottom
            let spawnX = Math.random()*(canvas.width-0);
            let spawnY = Math.random()*(canvas.height-0);
    
            if (random == 0){ //left and right only
                if ((spawnX >= walkspace.x) && (spawnX <= walkspace.width)){ //if the spawnX value is placed inside the rectangle
                    if (spawnX >= walkspace.width/2){//if spawn x is closer to the right side of the rectangle, just move it there                
                        spawnX = Math.random()*((walkspace.width + wallThickness) - walkspace.width) + walkspace.width;
                    } else { //otherwise calculate a new spawnX to the left side of the rectangle
                        spawnX = Math.random()*(walkspace.x - (walkspace.x - wallThickness)) + (walkspace.x - wallThickness);
                    }
                }
                //no need to set spawn y otherwise enemies will spawn on the corners of the map only
            }
            if (random == 1){ //top and bottom only
                if ((spawnY >= walkspace.y) && (spawnY <= walkspace.height)){ 
                    if (spawnY >= walkspace.height/2){              
                        spawnY = Math.random()*((walkspace.height + wallThickness) - walkspace.height) + walkspace.height;
                    } else {
                        spawnY = Math.random()*(walkspace.y - (walkspace.y - wallThickness)) + (walkspace.y - wallThickness);
                    }
                }
            }
    
            enemy.x = spawnX;
            enemy.y = spawnY;
        }
        else {
            enemy.x =enemies[rangeIndex].x;
            enemy.y =enemies[rangeIndex].y;
            this.calculateTravelAngle(enemy, rangeIndex)
            gameStage.addChildAt(enemy, gameStage.getChildIndex(phil.model))
            spits.push(enemy)
            return;
        }
        

        gameStage.addChildAt(enemy, gameStage.getChildIndex(phil.model))
        enemies.push(enemy)
        waveCleared = false;
    }
    enemyIntersects(player, array){
        
        for(let i = 0; i < array.length; i++){
            let enemy =  array[i].getTransformedBounds();
            let playerBounds = player.getTransformedBounds();
            if (enemy.intersects(playerBounds)){
                let damage = array[i].damage;
                gameStage.removeChild(array[i]);
                array.splice(i,1);
                phil.playerDamage(damage);
            }
        }
    }
    calculateTravelAngle(spit){ 
        let changeX = spit.x - phil.model.x; 
        let changeY = spit.y - phil.model.y;

        if (Math.abs(changeX) > Math.abs(changeY)){
            spit.deltaX = changeX / Math.abs(changeX) 
            spit.deltaY = changeY / Math.abs(changeX) 

        } else if (Math.abs(changeX) < Math.abs(changeY)){
            spit.deltaX = changeX / Math.abs(changeY)
            spit.deltaY = changeY / Math.abs(changeY)   
        } else {
            spit.deltaX = changeX / Math.abs(changeY)
            spit.deltaY = changeY / Math.abs(changeX)
        }
        spit.deltaX *= -1;
        spit.deltaY *= -1;
        
    }
    enemyMovement(){
        if (enemies.length == 0 && !waveCleared){
            playingPhoneAnim = false;
            waveCurrentlyGoing = false;
            collectEndTime()
        }
            
        for (let i = 0; i < spits.length; i++) { //spit movement
            let specificProjectile = spits[i];
            
            const xIncrease = specificProjectile.deltaX * spits[i].speed;
            const yIncrease = specificProjectile.deltaY * spits[i].speed;
    
            specificProjectile.x += xIncrease;
            specificProjectile.y += yIncrease; 

            if ((specificProjectile.x > walkspace.width || specificProjectile.x < walkspace.x)||(specificProjectile.y > walkspace.height || specificProjectile.y < walkspace.y)){
                gameStage.removeChild(specificProjectile);
                spits.splice(i, 1);     
            }   
            this.enemyIntersects(phil.model, spits); 
        }
        
        for(let i = 0; i < enemies.length; i++){ //enemy movement
            let specificEnemy = enemies[i];
            
            if (String(specificEnemy.currentAnimation) == 'moving' || String(specificEnemy.currentAnimation) == 'idle'){
                
                let changeX = phil.model.x - specificEnemy.x; //distance away from the player
                let changeY = phil.model.y - specificEnemy.y;
        
                if(changeX < 0){
                    specificEnemy.scaleX = .1
                } else if (changeX >= 0){
                    specificEnemy.scaleX = -.1;
                }
    
                if (Math.abs(changeX) > Math.abs(changeY)){ 
                    specificEnemy.deltaX = changeX / Math.abs(changeX)
                    specificEnemy.deltaY = changeY / Math.abs(changeX) 
                } else if (Math.abs(changeX) < Math.abs(changeY)){
                    specificEnemy.deltaX = changeX / Math.abs(changeY)
                    specificEnemy.deltaY = changeY / Math.abs(changeY)   
                } else {
                    specificEnemy.deltaX = changeX / Math.abs(changeY)
                    specificEnemy.deltaY = changeY / Math.abs(changeX)
                }
    
                let xIncrease = specificEnemy.deltaX * specificEnemy.speed;
                let yIncrease = specificEnemy.deltaY * specificEnemy.speed;
                
                if (specificEnemy.aName == ("range " + specificEnemy.enemyNumber) && specificEnemy.isShooting == false){ //this code will only go for ranged enemies
                    if (changeX*changeX + changeY*changeY <=  specificEnemy.distanceAway * specificEnemy.distanceAway){ //If the enemy is within the player range
                        
                        if (phil.leftright || phil.updown){ //if the player is moving
                            xIncrease *=-0.33*(specificEnemy.speed); //go backwards in x
                            yIncrease *=-0.33 *(specificEnemy.speed); //go backwards in y
                            specificEnemy.gotoAndPlay("moving")
                        }
                        else{
                            xIncrease = 0; //dont move, you're right where you want to be
                            yIncrease = 0;
                            specificEnemy.cooldown++;
                            specificEnemy.gotoAndPlay('idle');
                        }
                        
                        if (specificEnemy.cooldown >=50){
                            specificEnemy.isShooting = true;
                            specificEnemy.gotoAndPlay('shooting')
                            setTimeout(function () {
                                enemySpawnManager.spawnEnemy('spit', i);
                                specificEnemy.isShooting = false;
                                specificEnemy.cooldown = 0;

                            }, 600)
                        }
                    } 
                }
                specificEnemy.x += xIncrease;     
                specificEnemy.y += yIncrease;     
                    
                this.enemyIntersects(phil.model, enemies); 
            }
        }
    }
    enemyKill(enemy){
        let enemyIndex;
        for (let i = 0; i < enemies.length; i++){
            if (enemies[i] == enemy){
                enemyIndex = i;
            }
        }
        gameStage.removeChild(enemy);
        enemies.splice(enemyIndex, 1);
    }
}