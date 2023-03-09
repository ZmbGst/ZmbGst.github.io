let bg, patioBottom, patioTop, pottedScrunkly, playingPhoneAnim, waveCurrentlyGoing, moveEyes, environmentWalls, wallThickness, walkspace
function createGameEnvironment(){
    bg = new createjs.Bitmap(queue.getResult('bg'));
        bg.scaleX = canvas.width / bg.image.width;
        bg.scaleY = canvas.height / bg.image.height;
        bg.x = 0;
        bg.y = 0;
        bg.aName = 'background'
    
    patioBottom = new createjs.Bitmap(queue.getResult('patioBottom'));
        patioBottom.scaleX = .2
        patioBottom.scaleY = .2
        patioBottom.x = canvas.width / 1.5;
        patioBottom.y = canvas.height / 2;
        
    patioTop = new createjs.Bitmap(queue.getResult('patioTop'));
        patioTop.scaleX = .2
        patioTop.scaleY = .2
        patioTop.x = patioBottom.x -30;
        patioTop.y = patioBottom.y -30;
        
    pottedScrunkly = new createjs.Sprite(pottedScrunklySpritesheet, "idle")
        pottedScrunkly.x = patioTop.x + 7;
        pottedScrunkly.y = patioTop.y + (patioTop.image.height *.2)-45;
        pottedScrunkly.scale = .25;
    playingPhoneAnim = true;
    waveCurrentlyGoing = false;
    moveEyes = false;

    environmentWalls = [];//Dynamically create a wall around the playspace
    wallThickness = 100;//Set a univeral wall thickness.
    //this will also help set up a invisible rectangle thatll prevent the player / bullets from walking offscreen (see walkspace declaration)
for (let i = 0; i < 4; i++){
    environmentWalls.push(new createjs.Bitmap(queue.getResult('hedgeBottom'))) //each of the four walls are set up dynamically, only using 0, canvas width, and height
    environmentWalls[i].scaleX = .35
    environmentWalls[i].scaleY = wallThickness/environmentWalls[i].image.height + .05;
    environmentWalls[i].height = environmentWalls[i].scaleY * environmentWalls[i].image.height;
    environmentWalls[i].width = .3 * environmentWalls[i].image.width;
    environmentWalls[i].regX = environmentWalls[i].image.width/2;
    environmentWalls[i].regY = wallThickness/2;
    
    switch (i) {
        case 0://x,y,width,height
            environmentWalls[i].x = canvas.width/2;
            environmentWalls[i].y = -5;
            environmentWalls[i].rotation = 0;
        break;
        case 1:
            environmentWalls[i].x = -15 + wallThickness;
            environmentWalls[i].y = canvas.height/2;
            environmentWalls[i].rotation = 90;
            
        break;
        case 2:
            environmentWalls[i].x = canvas.width/2;
            environmentWalls[i].y = canvas.height;
            environmentWalls[i].rotation = 180;

        break;
        case 3:
            environmentWalls[i].x = canvas.width - wallThickness +15;
            environmentWalls[i].y = canvas.height/2;
            environmentWalls[i].rotation = 270;

        break;
        default:
            environmentWalls[i].x = 0;
            environmentWalls[i].y = 1200;
            environmentWalls[i].rotation = 90;

    }
    environmentWalls[i].aName = 'environment wall '+i
}
for (let i = 4; i < 8; i++){
    environmentWalls.push(new createjs.Bitmap(queue.getResult('hedgeTop'))) //each of the four walls are set up dynamically, only using 0, canvas width, and height
    environmentWalls[i].scaleX = .35
    environmentWalls[i].scaleY = wallThickness/environmentWalls[i].image.height + .05;
    environmentWalls[i].height = environmentWalls[i].scaleY * environmentWalls[i].image.height;
    environmentWalls[i].width = .3 * environmentWalls[i].image.width;
    environmentWalls[i].regX = environmentWalls[i].image.width/2;
    environmentWalls[i].regY = wallThickness/2;
    
    switch (i) {
        case 4:
            environmentWalls[i].x = canvas.width/2;
            environmentWalls[i].y = -5;
            environmentWalls[i].rotation = 0;
        break;
        case 5:
            environmentWalls[i].x = -15 + wallThickness;
            environmentWalls[i].y = canvas.height/2;
            environmentWalls[i].rotation = 90;
            
        break;
        case 6:
            environmentWalls[i].x = canvas.width/2;
            environmentWalls[i].y = canvas.height;
            environmentWalls[i].rotation = 180;

        break;
        case 7:
            environmentWalls[i].x = canvas.width - wallThickness +15;
            environmentWalls[i].y = canvas.height/2;
            environmentWalls[i].rotation = 270;

        break;
        default:
            environmentWalls[i].x = 0;
            environmentWalls[i].y = 1200;
            environmentWalls[i].rotation = 90;

    }
    environmentWalls[i].aName = 'environment wall '+i
}


walkspace = new createjs.Rectangle(wallThickness, wallThickness, canvas.width-wallThickness, canvas.height-wallThickness);
    walkspace.aName = 'walkspace';


    console.log('environment loaded')
    createUI();
}
