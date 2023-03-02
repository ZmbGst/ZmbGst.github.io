let enemies = [];
let spits = []; //spit will be in its own area because enemies will follow the player. spit just goes in one direction
class Enemy {
    constructor(){
    }
    spawnEnemy(type, rangeIndex){
        
        let enemy = new createjs.Shape();

        switch (type){
            case "range":
                enemy.graphics.beginFill("#25b95f").drawRect(0,0,20,20);
                enemy.setBounds(0,0,20,20);
                enemy.damage = 10;
                enemy.health = 2;
                enemy.distanceAway = 300;
                enemy.cooldown = 0;
                enemy.speed = Math.random() * (10-7)+7;
            break;
            case 'brute':
                enemy.graphics.beginFill("#046137").drawRect(0,0,70,70);
                enemy.setBounds(0,0,70,70);
                enemy.damage = 30;
                enemy.health = 20;
                enemy.speed = Math.random() * (8-5)+5;
            break;
            case 'spit':
                enemy.graphics.beginFill("#ccffcc").drawRect(0,0,10,10);
                enemy.setBounds(0,0,10,10);
                enemy.damage = 10;
                enemy.health = 1;
                enemy.speed = Math.random() * (13-7)+7;
            break;
            case 'normal':
            default:
                enemy.graphics.beginFill("#269a39").drawRect(0,0,30,30);      
                enemy.setBounds(0,0,30,30);   
                enemy.damage = 20;   
                enemy.health = 2; 
                enemy.speed = Math.random() * (13-7)+7;
            break;
        }

        enemy.enemyNumber = enemies.length;
        enemy.isEnemy = true;
        
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
            gameStage.addChild(enemy)
            spits.push(enemy)
            return;
        }
        

        gameStage.addChild(enemy)
        enemies.push(enemy)
        waveCleared = false;
    }
    enemyIntersects(player, array){
        
        for(let i = 0; i < array.length; i++){
            let enemy =  array[i].getTransformedBounds();
            let playerBounds = player.getTransformedBounds();
            if (enemy.intersects(playerBounds)){
                console.log(array[i].aName + " is colliding with " + player.aName);
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
            
            let changeX = phil.model.x - specificEnemy.x; //distance away from the player
            let changeY = phil.model.y - specificEnemy.y;
    
            let direction = Math.atan2(changeY, changeX); //inner angle based on the triangle
            specificEnemy.rotation = (direction *180/Math.PI)+90

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
            
            if (specificEnemy.aName == ("range " + specificEnemy.enemyNumber)){ //this code will only go for ranged enemies
                if (changeX*changeX + changeY*changeY <=  specificEnemy.distanceAway * specificEnemy.distanceAway){ //If the enemy is within the player range
                    
                    if (phil.leftright || phil.updown){
                        xIncrease *=-1*(specificEnemy.speed); //go backwards in x
                        yIncrease *=-1 *(specificEnemy.speed); //go backwards in y
                    }
                    else{
                        xIncrease = 0; //dont move, you're right where you want to be
                        yIncrease = 0;
                    }
                    specificEnemy.cooldown++;
                    if (specificEnemy.cooldown >=50){
                        specificEnemy.cooldown = 0;
                        this.spawnEnemy('spit', i);
                    }
                } 
            }
            specificEnemy.x += xIncrease;     
            specificEnemy.y += yIncrease;     
                
            this.enemyIntersects(phil.model, enemies); 
        }
    }
}