let projectiles = [];
let tablesawCooldown = 0;
let propaneCooldown = 0;
let damageBoost = 0;

let toolsAvailable = ["torch"];

class Tool {
    constructor(model){
        this.model = model;
    }

    createProjectile(tool, event){ //create the model as well as its necessary stuff

        if (tool == 'tablesaw' && tablesawCooldown <= 40){
            return;
        }
        if (tool == 'propane' && propaneCooldown <= 25){
            return;
        }
        
        let bullet = new createjs.Shape();

        switch (tool){
            case "torch":
                bullet.graphics.beginFill("#FFA500").drawRect(phil.model.x,phil.model.y,5,5);//get the model ready, as well as its speed and damage
                bullet.intendedSpeed = 20;
                bullet.setBounds(phil.model.x, phil.model.y, 5,5);
                bullet.maxDistance = 250;
                bullet.damage = 1 + damageBoost;
                break;
            case "tablesaw":
                bullet.graphics.beginFill("#FFFFFF").drawRect(phil.model.x,phil.model.y,25,25);
                bullet.setBounds(phil.model.x, phil.model.y, 5,25)
                bullet.intendedSpeed = 50;
                bullet.maxDistance = 10000;
                bullet.damage = 2 + damageBoost;
                tablesawCooldown = 0;
                break;
            case "propane":
                bullet.graphics.beginFill("#00FF00").drawRect(phil.model.x,phil.model.y,15,15);
                bullet.setBounds(phil.model.x, phil.model.y, 15,15)
                bullet.intendedSpeed = 10;
                bullet.maxDistance = 600;
                bullet.damage = 10 + damageBoost;
                propaneCooldown = 0;
                break;
            default:
                bullet.graphics.beginFill("#000000").drawRect(phil.model.x,phil.model.y,5,5);
                bullet.setBounds(phil.model.x, phil.model.y, 5,5)
                bullet.intendedSpeed = 5;
                bullet.maxDistance = 250;
                break;
        }

        bullet.bulletNumber = projectiles.length; //maybe delete later and just use the projectiles array?????????
        bullet.isImportant = true;
        bullet.aName = tool
        bullet.distanceTravelled = 0;

        this.calculateTravelAngle(bullet, event);
        projectiles.push(bullet);//push the bullet into an array that'll update all of the bullets' positions on screen
        gameStage.addChild(bullet)
    }

    swapTool (){//push q to cycle between at most three unique tools
        if (keysPressed['81']){
            let toolUsing = toolsAvailable[0];
            toolsAvailable.splice(0,1);
            toolsAvailable.push(toolUsing);
            toolEquipped.model = toolsAvailable[0]
        }
    }

    calculateTravelAngle(bullet, event){ //Determine how the bullet should travel in terms of angle
        bullet.globalX = phil.model.x; //get the bullet's global x and y positions. This'll be used for environment stuff
        bullet.globalY = phil.model.y;

        let changeX = event.stageX - phil.model.x; //distance away from the player based on where the mouse was clicked
        let changeY = event.stageY - phil.model.y;


        if (Math.abs(changeX) > Math.abs(changeY)){ //if the x distance is further than the y distance.
            bullet.deltaX = changeX / Math.abs(changeX) //create a ratio determined by the x distance as the denominator
            bullet.deltaY = changeY / Math.abs(changeX) /*/X is the demoninator because it will result in a decimal point for the shorter side 
            instead of a number larger than 1 for the longer side (that will result in bullets that travel faster if the user tries to click
            a 90, 180, 270, or 360° triangle/*/
        } else if (Math.abs(changeX) < Math.abs(changeY)){
            bullet.deltaX = changeX / Math.abs(changeY)
            bullet.deltaY = changeY / Math.abs(changeY)   
        } else {
            bullet.deltaX = changeX / Math.abs(changeY)
            bullet.deltaY = changeY / Math.abs(changeX)
        }
    }

    updateBullets(){ //move the projectile. If they get off the intended walkarea, delete the projectile
        tablesawCooldown++;
        propaneCooldown++;

        for (let i = 0; i < projectiles.length; i++) {
            let specificProjectile = projectiles[i];
            for (let i = 0; i < enemies.length; i++){
                if (this.bulletIntersects(i) == false){//check to see if the bullet spawns on something it can kill already
                    return //if the bullet did hit something, then dont do the rest of this code so there wont be errors in console.log
                }; 
            }
            const xIncrease = specificProjectile.deltaX * projectiles[i].intendedSpeed;//Move the bullet based on the ratio calculated in createProjectile
            const yIncrease = specificProjectile.deltaY * projectiles[i].intendedSpeed;
    
            specificProjectile.x += xIncrease;
            specificProjectile.globalX += xIncrease;//make sure to add that increase to the local and global x and y values
    
            specificProjectile.y += yIncrease; //specificProjectile.y moves the bullet onscreen. specificProjectile.globalY is used to see where the bullet is on the canvas
            specificProjectile.globalY += yIncrease;
            
            let distanceTravelled = xIncrease*xIncrease + yIncrease*yIncrease;

            specificProjectile.distanceTravelled += Math.sqrt(distanceTravelled);
           
            if ((specificProjectile.globalX > walkspace.width || specificProjectile.globalX < walkspace.x)||(specificProjectile.globalY > walkspace.height || specificProjectile.globalY < walkspace.y)){
                this.bulletDestroy(specificProjectile, i)
            }   
            if (specificProjectile.distanceTravelled >= specificProjectile.maxDistance){
                this.bulletDestroy(specificProjectile, i);
            }

        }
    }

    bulletDestroy(specificBullet, i){
        gameStage.removeChild(specificBullet);
        projectiles.splice(i, 1);          
    }
    bulletIntersects(enemy){
        for(let i = 0; i < projectiles.length; i++){
            let projectile =  projectiles[i].getTransformedBounds();
            let enemyBounds = enemies[enemy].getTransformedBounds();
            if (projectile.intersects(enemyBounds)){
                enemies[enemy].health = enemies [enemy].health - projectiles[i].damage
                if (projectiles[i].aName == 'torch'){ //destroy the bullet if its not a tablesaw
                    this.bulletDestroy(projectiles[i], i);
                }          
                if (enemies[enemy].aName == 'brute ' + enemy){
                    this.bulletDestroy(projectiles[i], i);
                }         
                if (enemies[enemy].health <= 0){
                    gameStage.removeChild(enemies[enemy]);
                    enemies.splice(enemy,1);
                }
                return false;
            }  
        }
    }
}

