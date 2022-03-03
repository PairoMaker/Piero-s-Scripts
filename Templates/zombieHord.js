//Zombie hord, writing by Piero\\

//Machete for players to use
var machete = new Tool("Machete")
machete.model = 15119
var macheteRange = 4

//Spawning a Zombie
const zombieSpawn = Game.world.bricks.filter(brick => brick.name == "SpawnBrick") //Finds all the bricks on the map named SpawnBrick!
function spawnZombies(){
    const zombieBot = new Bot("Zombie") 
    const zombieOutfit = new Outfit()
    .body("#0d9436")
    .torso("#694813")
    .rightLeg("#694813")
    .leftLeg("#694813")
    .face(76559)

    zombieBot.setOutfit(zombieOutfit)
    zombieBot.setInterval(() => {
        let target = zombieBot.findClosestPlayer(20)
        if (!target) return zombieBot.setSpeech("")
        zombieBot.moveTowardsPlayer(target, 3) //Default speed is 4
        zombieBot.setSpeech("BRAINS!")
    }, 10)
    zombieBot.touching((player) => {
        player.setHealth(player.health - 5)
        if(!player.alive){
            Game.messageAll(`[#FF0000][SERVER]: [#00ff00]${player.username} was killed by a Zombie!`)
        }
    })
    let randomSpawn = zombieSpawn[Math.floor(Math.random() * zombieSpawn.length)]
    zombieBot.setPosition(randomSpawn.position)
    Game.newBot(zombieBot)
    machete.on("activated", (defender) => {
        if(!defender.alive) return
        if(Game.pointDistance3D(defender.position, zombieBot.position) <= macheteRange){
            if(!zombieBot.destroyed){
                zombieBot.destroy()
                Game.messageAll(`[#FF0000][SERVER]: [#00ff00]${defender.username} killed a Zombie!`)
                defender.setScore(defender.score + 2)
            }
        }
    })
}

//Player joins
Game.on("playerJoin", (player) =>{
    player.loadTool = false
    player.equipTool(machete)
    player.centerPrint(`[#00ff00]Fend off the zombies!`, 10)
});


setInterval(spawnZombies, 8000)//Spawns a zombie every 8 seconds 
