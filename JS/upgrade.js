let powerups = [];
class Upgrade {
    constructor(){
    }
    createPowerup(type){
        let powerup = new createjs.Shape();
        switch (type){
            case "tool":
                powerup.graphics.beginFill("#FFC0CB").drawRect(0,0,30,30);
                powerup.setBounds(0,0,50,50);
                if (toolsAvailable.length == 1){
                    powerup.aName = 'tablesaw'
                }
                if (toolsAvailable.length == 2){
                    powerup.aName = 'propane'
                }
                if (toolsAvailable.length >= 3){
                    powerup.aName = 'killAll'
                }
            break;
            case "statBoost":
                powerup.graphics.beginFill("#FF5349").drawRect(0,0,30,30);
                powerup.setBounds(0,0,50,50);
                powerup.aName = type;
                powerup.randomProperty = Math.round(Math.random()*(2) +1);
            break;
            case "health":
            default:
                powerup.graphics.beginFill("#FE2C54").drawRect(0,0,30,30);
                powerup.setBounds(0,0,50,50);
                powerup.aName = type;
            break;
        }
        powerup.property = 'powerup'
        powerup.x = canvas.width/2;
        powerup.y = canvas.height/2;
        if ((phil.model.x < powerup.x +100 && phil.model.x >powerup.x-100 && (phil.model.y < powerup.y +100 && phil.model.y >powerup.y-100))){
            powerup.x = canvas.width/3;
            powerup.y = canvas.width/3;
        }
        gameStage.addChild(powerup);
        powerups.push(powerup);
    }
}