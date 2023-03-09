function updateHealthbar(health, speed){

    //health
    playerHealthGreens.graphics.command.w = health / playerHealth.healthMax * playerHealthBorder.graphics.command.w
    
    if (health > 75) {
        pfp.gotoAndStop(100);
        console.log(100)
    } 
    if (health <=75 && health > 50){
        pfp.gotoAndStop(25);
        console.log(75)
    }
    if (health <= 50 && health > 25){
        pfp.gotoAndStop(50);
        console.log(50)
    } if (health <=25){
        pfp.gotoAndStop(75);
        console.log(25)
    }

    //speed
    playerStats.text = "Damage: " + (damageBoost + 1) + ". Speed: " + speed;
    profileFadeOut.gotoAndPlay(0);
}