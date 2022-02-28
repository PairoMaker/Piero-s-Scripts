let snowBall = new Tool("Snowball")
snowBall.model = 224753
function giveSnowball(player){
    for(player of Game.players){
        player.equipTool(snowBall)
    }
}
Game.on("playerJoin", (player) => {
    player.on("initialSpawn", () => {
        player.loadTool = false
    })
 })

 //Throwing snowball
 const debug = -57.7
 snowBall.on("activated", (thrower) => {
    if(!thrower.alive) return
   console.log(thrower.username + " threw a snowball!")
   let snow = new Brick(new Vector3(thrower.position.x, thrower.position.y + 1.4, thrower.position.z + 3), new Vector3(0.5,0.5,0.5),"#ffffff")
   snow.setCollision(false)
   snow.model = 224753
   let time = 0
   let speed = 1
   Game.newBrick(snow)
   snow.setInterval(()=> {
        let rotx = snow.position.x += speed * Math.sin(thrower.rotation.z / debug)
        let roty = snow.position.y -+ speed * Math.cos(thrower.rotation.z / debug)
        let rotz = snow.position.z
        snow.setPosition(new Vector3(rotx,roty,rotz))
        time++
        if(time > 40){
            time++
            speed -= 0.02
            if(time > 80 && !snow.destroyed){
                snow.destroy()
            }
        }
   }, 15)
   snow.touching(debounce((player) => {
        player.setPosition(player.position.add(0,5,0))
        snow.destroy()
        Game.messageAll(`[#FF0000][SERVER]: [#00ff00]${player.username} was hit by a snowball from ${thrower.username}!`)
        thrower.setScore(thrower.score += 1)
   }, 500))
   thrower.unequipTool(snowBall)
   thrower.destroyTool(snowBall)
 })

 setInterval(giveSnowball, 1000) //gives a snowball every second
