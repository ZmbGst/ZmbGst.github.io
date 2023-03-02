let philModel = new createjs.Container()//The container that'll hold all the assets for Phil. Kinda like a nested Animate symbol
    philModel.aName = 'phil';

let philHuman = new createjs.Shape()
    philHuman.graphics.beginFill("#888888").drawRect(-10,-10,20,20)

let philGun = new createjs.Shape()
    philGun.graphics.beginFill("#FFFFFF").drawRect(0,-20, 5, 10)


    philModel.addChild(philGun);
    philModel.addChild(philHuman);
    philModel.setBounds(-10,-10,20,20)
    


    
let phil; //create the variable that'll hold the player class as well as phil model.
let philHitboxForgiveness = 10; //Be nice to the player and make their hitbox smaller 

class Player {
    constructor(speed, hp, model){
        this.hp = hp;//set up HP
        this.speed = speed;//set up speed
        this.model = model;//sprite / container asset to use
    }
    getPlayerInfo(){ //return all info about the player
        console.log(this);
        return this;
    }
    playerMovement() { //move the player based on wasd or arrow keys. Apply first comments to rest of if statements
        
        let model= this.model;
        for (let i = 0; i < gameStage.children.length; i++){
            if(gameStage.children[i].property== 'powerup'){
                this.playerIntersects(gameStage.children[i])
            }
        }

        model.y += 0;
        phil.updown = false;
        if (keysPressed['87']||keysPressed['38']){
            model.y -= this.speed;
            phil.updown = true;
            if (model.y < walkspace.y) { //If the player's y value gets below the allowed walkspace's y value 
                model.y = walkspace.y //then make their y value the allowed walkspace's y value
            }
        }              
        if (keysPressed['83'] ||keysPressed['40']){
            model.y += this.speed;
            phil.updown = true;
            if (model.y > walkspace.height) {
                model.y = walkspace.height;
            }
        }
            
        model.x += 0;   
        phil.leftright = false;
        if (keysPressed['65'] ||keysPressed['37']){
            model.x -= this.speed;
            phil.leftright = true;
            if (model.x < walkspace.x) {
                model.x = walkspace.x;
            }
        }         
        if (keysPressed['68'] ||keysPressed['39']){
            model.x += this.speed;
            phil.leftright = true;
            if (model.x > walkspace.width) {
                model.x = walkspace.width;
            }
        }
    }
    playerRotation(event){ //rotate the player based on the mouse. Helpful to see where the player is aiming.
        let changeX = event.stageX - this.model.x
        let changeY = event.stageY - this.model.y//Make a right triangle based on the distance the model is away from the cursor.

        let direction = Math.atan2(changeY, changeX); //inner angle based on the triangle
        this.model.rotation = (direction *180/Math.PI)+90
    }
    playerDamage(hp){
        this.hp -= hp
     
        if (this.hp <=0){
            this.playerDeath();
            this.hp=0
        }
        console.log(this.hp + " hp left")
    }
    playerDeath(){
        createjs.Ticker.removeEventListener("tick", update);
        createjs.Ticker.removeEventListener("tick", startNextWave);

        gameStage.removeEventListener("stagemousemove", rotatePlayer);
        gameStage.removeEventListener("click", shoot)
        
        window.removeEventListener("keydown", keysDown);
        window.removeEventListener("keypress", toolEquipped.swapTool);
        window.removeEventListener("keyup", keysUp);
        console.log('dead');
    }
    playerIntersects(powerup){
        let phil =  this.model.getTransformedBounds();
        let secondaryObjectBounds = powerup.getTransformedBounds();
        if (phil.intersects(secondaryObjectBounds)){
            switch (powerup.aName){
                case "tablesaw": 
                    toolsAvailable.push('tablesaw');
                    console.log('unlcoked tablesaw, press q to cycle between your tools')
                break;
                case "propane":
                    toolsAvailable.push('propane');
                    console.log('unlcoked propane, press q to cycle between your tools')

                break;
                case 'killAll':
                    for (let i = 0; i < enemies.length; i++){
                        gameStage.removeChild(enemies[i]);
                        enemies.splice(i,1);
                    }
                break;
                case 'statBoost':
                    damageBoost++;
                    this.speed= this.speed +5;
                    console.log('you are now stronger and faster!');
                break;
                case 'health':
                default:
                    this.hp = this.hp + 20;
                    if (this.hp > 100){
                        this.hp = 100;
                    }
                    console.log('your hp is now ' + this.hp)
            }
            powerups.splice(powerup,1);
            gameStage.removeChild(powerup);
            
            collectEndTime();
            return true;
        } else
        return false;
    }
}

