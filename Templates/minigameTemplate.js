const game = {};
game.gameState = 0 //0 waiting, 1 intermission, 2 round
game.gameStates = [{"waiting": 0, "intermission": 1, "round": 2}]
game.roundTime = 30
game.timeConfig = {
    "intermission": 30,
    "roundTime": 120,
}



//functions

function intermission() {
    game.roundTime -= 1
}
function startRound() { //Code for when the game starts
    Game.centerPrintAll(`The game has started!`, 3)
}
function endRound() { //Code for when the game ends
    Game.centerPrintAll(`The game has ended!`, 3)
}


var numberNeeded = 2 //Players needed to play

setInterval(() =>{
    if(game.gameState === 0){
        if(Game.players.length < numberNeeded){
            Game.bottomPrintAll(`Waiting for ${numberNeeded - Game.players.length} players...`, 100000)
        }
        else{
            game.roundTime = game.timeConfig.intermission
            game.gameState = 1
        }
    } else if(game.gameState === 1){
        if(Game.players.length < numberNeeded){
            game.gameState = 0
        }
        if(game.roundTime > 0){
            intermission()
            Game.bottomPrintAll(`The game will start in ${game.roundTime} seconds!`, 1000000)
        }
        else{
            startRound()
            game.roundTime = game.timeConfig.roundTime
            game.gameState = 2
        }
    } else if(game.gameState === 2){
        if(game.roundTime > 0){
            intermission()
            Game.bottomPrintAll(`The game has ${game.roundTime} seconds left!`, 100000)
        }
        else{
            game.gameState = 1
            roundEnd()
        }
    }

}, 1000)
