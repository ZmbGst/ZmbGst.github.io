let queue = new createjs.LoadQueue(true);//https://www.youtube.com/watch?v=s9ujil7FiCs
let gameEnvironmentFiles = [
    {id: "bg", src: "Animate/PNG/bg.png"},
    {id: "hedgeBottom", src: "Animate/PNG/hedge bottom.png"},
    {id: "hedgeTop", src: "Animate/PNG/hedge top.png"},
    {id: "patioBottom", src: "Animate/PNG/floor.png"},
    {id: "patioTop", src: "Animate/PNG/roof.png"},
    {id: "pottedScrunkly", src: "Animate/Spritesheet/star scrunkly in pot.png"}
]
let UIFiles = [
    {id: "toolEquippedUI", src: "Animate/Spritesheet/toolCycle.png"},
    {id: "portrait", src: "Animate/Spritesheet/portraits.png"},
    {id: "portraitCardBG", src: "Animate/PNG/profile card.png"},
    {id: "waveBanner", src: "Animate/PNG/wave banner.png"}
]
let characterSpritesheets = [
    {id: "starScrunkly", src: "Animate/Spritesheet/star scrunkly.png"},
    {id: "slingyScrunkly", src: "Animate/Spritesheet/slingy scrunkly.png"}
]

queue.on("progress", handleFileProgress)
queue.on("fileload", handleFileLoaded)
queue.on("complete", handleFileComplete)

queue.loadManifest(gameEnvironmentFiles)
queue.loadManifest(UIFiles)
queue.loadManifest(characterSpritesheets)



function handleFileProgress(event){
    //console.log('Progress: '+ Math.floor(queue.progress*100) + "%");
}

function handleFileLoaded(event){
    //console.log(event.item.id + " has finished loading")
}

function handleFileComplete(){//spritesheets, then game environment, then UI, then start game
    createSpriteSheets();
}