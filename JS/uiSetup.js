let UIStuff = new createjs.Container();
    UIStuff.x = 0
    UIStuff.y = 0
    UIStuff.aName = "UI";


let toolEquippedSprite = new createjs.Sprite(toolEquippedSpritesheet, "torch");
    toolEquippedSprite.x = canvas.width - (canvas.width *0.2);
    toolEquippedSprite.y = canvas.height - (canvas.height *0.2);
    toolEquippedSprite.scale = .45;

let toolEquippedFadeOut = new createjs.Tween(toolEquippedSprite, {override:true}, true)
    .set({alpha:1})
    .to({scale: 0.25},100)
    .wait(3000)
    .to({alpha:0}, 1000);
    toolEquippedFadeOut.gotoAndStop(4099)


let profileCard = new createjs.Container();
    profileCard.aName = "stats"
    profileCard.x = 0 + (canvas.width *0.035);
    profileCard.y = canvas.height - (canvas.height *0.35);
    profileCard.scale = 0.2;
    profileCard.alpha = 0.9;

let profileCardBG = new createjs.Bitmap("Animate/PNG/profile card.png")
    profileCard.addChild(profileCardBG);

let pfp = new createjs.Sprite(portaitSpritesheet, "100") //change this later
    profileCard.addChild(pfp);
   
    pfp.x = profileCardBG.image.width * 0.2
    pfp.y = profileCardBG.image.height * 0.55

let playerName = new createjs.Text("Phil - Unlikely Hero", "150px Tahoma", "#24221d");
    profileCard.addChild(playerName)
    playerName.x = profileCardBG.image.width * 0.4
    playerName.y = pfp.y-190;

let playerStats = new createjs.Text("Damage: 1. Speed: 25", "120px Tahoma", "#24221d")
profileCard.addChild(playerStats)
    playerStats.x = playerName.x;
    playerStats.y = playerName.y + 175;

let playerHealth = new createjs.Container();
    playerHealth.name = "Player Health";
    playerHealth.healthMax = 100;

let playerHealthBorder = new createjs.Shape()
    playerHealth.addChild(playerHealthBorder);
    playerHealthBorder.graphics.s('white').ss(18).f('black').dr(playerStats.x,playerStats.y +250, profileCardBG.image.width * 0.5, 100);

let playerHealthGreens = new createjs.Shape();
    playerHealth.addChild(playerHealthGreens);
    playerHealthGreens.graphics.f('green').dr(playerHealthBorder.graphics.command.x,playerHealthBorder.graphics.command.y,playerHealthBorder.graphics.command.w,playerHealthBorder.graphics.command.h);
    profileCard.addChild(playerHealth)

let profileFadeOut = new createjs.Tween(profileCard, {override:true}, true)
    .to({scale: 0.25},100)
    .wait(3000)
    .to({alpha:0}, 1000);
    profileFadeOut.gotoAndStop(4099)

let waveBanner = new createjs.Container();
    waveBanner.x = canvas.width/2;
    waveBanner.y = -1000;
    waveBanner.scale =0.25;
    waveBanner.alpha = 0.9;

let waveBannerBG = new createjs.Bitmap("Animate/PNG/wave banner.png")
    waveBanner.addChild(waveBannerBG);
    waveBanner.x -= waveBannerBG.image.width/8

let waveText = new createjs.Text("", "bold 180px Tahoma", "#042b0c")
    waveBanner.addChild(waveText);
    waveText.textAlign = "center";
    waveText.x = waveBannerBG.image.width/2+ 100;
    waveText.y = waveBannerBG.y + 400;

let waveDescription = new createjs.Text("", "130px Tahoma", "#042b0c")
    waveBanner.addChild(waveDescription);
    waveDescription.textAlign = "center";
    waveDescription.lineWidth = 1600
    waveDescription.x = waveText.x;
    waveDescription.y = waveText.y +200;

let waveBannerAnimation = new createjs.Tween(waveBanner, {override:true}, true)
    .to({y:0},400)
    .wait(4000)
    .to({alpha:0}, 1000);
    waveBannerAnimation.gotoAndStop(5399)
    
UIStuff.addChild(waveBanner);
UIStuff.addChild(toolEquippedSprite);
UIStuff.addChild(profileCard);