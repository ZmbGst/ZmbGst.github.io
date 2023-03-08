function moveEye(){
    if (String(pottedScrunkly.currentAnimation) == "phoneCall" || String(pottedScrunkly.currentAnimation) == "phoneCallEnd"){
        moveEyes = false;
    } else {
        moveEyes = true;
    }

    if (waveCurrentlyGoing && moveEyes){
        if (phil.model.y >= pottedScrunkly.y){
            if (phil.model.x > pottedScrunkly.x){
                pottedScrunkly.gotoAndPlay('bottomright')
            } else if (phil.model.x < pottedScrunkly.x) {
                pottedScrunkly.gotoAndPlay('bottomleft')
            } else {
                pottedScrunkly.gotoAndPlay('bottommiddle')
            }
        } else if (phil.model.y < pottedScrunkly.y){
            if (phil.model.x > pottedScrunkly.x){
                pottedScrunkly.gotoAndPlay('topright')
            } else if (phil.model.x < pottedScrunkly.x) {
                pottedScrunkly.gotoAndPlay('topleft')
            } else {
                pottedScrunkly.gotoAndPlay('topmiddle')
            }
        }
        
    }
    
}