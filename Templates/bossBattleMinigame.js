//Boss battle MiniGame by Piero\\
var bossPlayer = null;
const knightOutfit = new Outfit()
    .body("#626262")
    .torso("#bdb4b0")
    .head("#f3b700")
    .hat1(1467)
    .hat2()
    .hat3()
    .face(317930)
    .tshirt(318731)
    .shirt()
    .pants()
const bossOutfit = new Outfit()
    .body("#4c2f2d")
    .leftArm("#95b90b")
    .rightArm("#95b90b")
    .head("#95b90b")
    .face(690)
    .hat1(1)
    .hat2(1)
    .hat3(1)
    .shirt()
    .pants()
    .tshirt()


//Varibles\\
const miniGame = {};
miniGame.role = {"knight": 0, "boss": 1};
miniGame.gameState = 0; //0 - waiting, 1 - intermission, 2 - fighting
miniGame.roundTime = 30;
miniGame.roundConfig = {
    "intermisson" : 20
};

//Functions\\
function intermission(){
    miniGame.gameState = 1
    miniGame.roundTime = miniGame.roundConfig.intermisson
}
function randomBoss(){
    miniGame.gameState = 2
    for(let player of Game.players){
        if(!player) return;
        player.role = 0;
    }
    bossPlayer = Game.players[Math.floor(Math.random()*Game.players.length)]
    if(bossPlayer){
        bossPlayer.role = 1
        Game.centerPrintAll(`The monster ${bossPlayer.username} has rising!`, 3)
    }
};
function endRound(){
    miniGame.gameState = 1
    miniGame.roundTime = miniGame.roundConfig.intermisson
    Game.topPrintAll(``)
    for(let player of Game.players){
        if (player.role === 1){
            player.setOutfit(knightOutfit)
            player.setScale(new Vector3(1,1,1))
            player.unequipTool(hammer) //weird Node Hill glitch
            player.destroyTool(hammer)
            player.equipTool(sword)
            player.setHealth(100)
        }
    }
}

//When someone joins
Game.on("playerJoin", (player) =>{
    player.on("avatarLoaded", () =>{
        player.loadTool = false;
        player.setOutfit(knightOutfit)
    });
    player.on("initialSpawn", () => {
        player.equipTool(sword)
    })
});
//If the boss leaves mid-game
Game.on("playerLeave", (player) => {
    if(player.role === 1){
        Game.centerPrintAll(`The monster ${player.username} disappear unoticed!`, 5);
        endRound()
    }
});

//Main interval\\
var numberNeeded = 2
setInterval(() => {
    if(miniGame.gameState === 0){
        if(Game.players.length < numberNeeded){
            Game.bottomPrintAll(`Waiting for ${numberNeeded - Game.players.length} more warriors!`, 100000)
            Game.topPrintAll(``)
        }
        else{
            intermission()
            Game.bottomPrintAll(``)
        }
    }else if (miniGame.gameState === 1){
        if(Game.players.length < numberNeeded){
            miniGame.gameState = 0
        }
        if(miniGame.roundTime--){
            Game.bottomPrintAll(``)
            Game.topPrintAll(`The next batter will begin in ${miniGame.roundTime}!`, 100000)
        }
        else{
            randomBoss()
        }
    } else if (miniGame.gameState === 2){
        for(let player of Game.players){
            if(player.role === 1){
                player.setOutfit(bossOutfit);
                player.setScale(new Vector3(2,2,2));
                player.unequipTool(sword) //weird Node Hill glitch
                player.destroyTool(sword)
                player.equipTool(hammer)
                player.setHealth(250)
                if(player.alive){
                    Game.topPrintAll(`| Health : ${player.health} |`, 100000)
                }
                else{
                    endRound()
                    Game.centerPrintAll(`The monster ${player.username} was defeated!`);
                    Game.topPrintAll(``)
                }
            }
        }
    }
}, 1000);

// Settings \\
swordDamage = 9.5 // How much damage does the sword deal when clicked?
swordRange = 8 // How far can the sword hit players?
swordModelID = 2930 // The mesh of the sword from the store ID

effectsEnabled = true // Enable or disable particles effects? Note: This will disable all related settings (Disable if your server crashes or lags when this is enabled)
    particleSize = new Vector3(0.5,0.5,0.5) // The size of the particles
    hitParticles = true // If true then particles will emit from damaged players
    redBlood = true // If false then particles will be a random color
    deathExplosion = true // When the player dies they make a big brick explosion

legacyBug = false // Enable the "player can still kill players if dead" bug

var sword = new Tool("Sword")
sword.model = swordModelID
sword.on("activated", (attacker) => {
    if (attacker.alive == false && legacyBug == false && miniGame.gameState !== 2) return
    for (let player of Game.players) {
        if (Game.pointDistance3D(attacker.position, player.position) <= swordRange) {
            if (player.role !== attacker.role) {
            if (player.alive == true) { // A check to see if the player is attacking themselfs or their target is already dead
                    player.setHealth(player.health - swordDamage) // Damage the player
                    if (effectsEnabled == true && hitParticles == true) {
                        damagecolor = 0
                        if (redBlood == false) {
                            damagecolor = randomColor()
                        } else {
                            damagecolor = "ff0000"
                        }
                        playerexplode(player,damagecolor) 
                    }
                    if (player.alive == false) { // Was the player killed? Award the killer with a point
                    attacker.setScore(attacker.score += 10)
                    }
                }
            }
        }
    }
})
hammerDamage = 12 // How much damage does the sword deal when clicked?
hammerRange = 10 // How far can the sword hit players?
var hammer = new Tool("Hammer")
hammer.model = 20681
hammer.on("activated", (attacker) => {
    if (attacker.alive == false && legacyBug == false) return
    for (let player of Game.players) {
        if (Game.pointDistance3D(attacker.position, player.position) <= hammerRange) {
            if (player.username !== attacker.username) {
            if (player.alive == true) { // A check to see if the player is attacking themselfs or their target is already dead
                    player.setHealth(player.health - hammerDamage) // Damage the player
                    if (effectsEnabled == true && hitParticles == true) {
                        damagecolor = 0
                        if (redBlood == false) {
                            damagecolor = randomColor()
                        } else {
                            damagecolor = "ff0000"
                        }
                        playerexplode(player,damagecolor) 
                    }
                    if (player.alive == false) { // Was the player killed? Award the killer with a point
                    attacker.setScore(attacker.score += 3)
                    Game.messageAll(`[#FF0000][SERVER]: [#00ff00]${attacker.username} killed ${player.username}`)
                    }
                }
            }
        }
    }
})

function playerexplode(player,color) {
    let brick = new Brick(player.position,particleSize,color)
    Game.newBrick(brick)
    var grav = 0.8
    var time = 0
    var prot = randomIntFromInterval(0,9999)
    brick.setInterval(() => {
        var rotx = brick.position.x += 1 * Math.sin(prot)
        var roty = brick.position.y - 1 * Math.cos(prot)
        var rotz = brick.position.z += grav
        grav -= 0.1
        brick.setPosition(new Vector3(rotx,roty,rotz))
        time++
        if (time > 80 && !brick.destroyed) {
            brick.destroy()
        }
    }, 35)
}

Game.on('playerJoin', (p) => {
    p.on("died", () => {
        if (effectsEnabled == false || deathExplosion == false) return // If effects or explosions are disabled then dont run anything
        deathcolor = 0
        if (redBlood == false) {
            deathcolor = randomColor()
        } else {
            deathcolor = "#ff0000"
        }
        for (i = 0; i < 5; i++) { //repeat 5 times for 5 blocks
            playerexplode(p,deathcolor)
        }
    })
})

function randomColor() {
    return '#' + ('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6)
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
