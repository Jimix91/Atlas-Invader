class Player {
    constructor() {
        this.width = 10;
        this.height = 5;
        this.positionX = 50 - this.width/2;
        this.positionY = 0;
    }
    updateUIplayer (){

        const playerELM = document.getElementById("player")
        playerELM.style.width = this.width + "vw"
        playerELM.style.height = this.height + "vh"
        playerELM.style.bottom = this.positionY + "vh"
        playerELM.style.left  =this.positionX + "vw"


    }
        
    moveLeft() {
        if(this.positionX > 0) {
            this.positionX--;
            this.updateUIplayer()
        }
       
    }
    moveRight() {
        if(this.positionX < 100 - this.width)
        this.positionX++
        this.updateUIplayer()
    }
}

class Obstacle{
    constructor() {
        this.width = 10;
        this.height = 20;
        this.positionX = Math.floor(Math.random() * (100 - this.width + 1))
        this.positionY = 100;
        this.obstacleELM = null

        this.createObstacle()
        this.updateUIobstacle()
        
    } 
    createObstacle(){
        this.obstacleELM = document.createElement("div")
        this.obstacleELM.className = "obstacle"
        
        const  parentELM = document.getElementById("board")
        parentELM.appendChild(this.obstacleELM)
    }

    updateUIobstacle (){

       
        this.obstacleELM.style.width = this.width + "vw"
        this.obstacleELM.style.height = this.height + "vh"
        this.obstacleELM.style.bottom = this.positionY + "vh"
        this.obstacleELM.style.left  =this.positionX + "vw"

    }
   
    movedown(){
        this.positionY--
        this.updateUIobstacle()
    }
}


const player = new Player()
let obstaclesArr = []

setInterval(()=>{
    const newobstacle = new Obstacle()
    obstaclesArr.push(newobstacle)
}, 5000)

setInterval(() => {
    obstaclesArr.forEach(obstacleInstance => {
        obstacleInstance.movedown()

         if (
            player.positionX < obstacleInstance.positionX + obstacleInstance.width &&
            player.positionX + player.width > obstacleInstance.positionX &&
            player.positionY < obstacleInstance.positionY + obstacleInstance.height &&
            player.positionY + player.height > obstacleInstance.positionY
         ){
            console.log("game over my fren!!");
            location.href = "gameover.html"
         }
    })
   
}, 100);


document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowLeft') {
    player.moveLeft()
  } else if (e.code === 'ArrowRight') {
    player.moveRight()
  }
});

