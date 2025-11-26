//selecion de nave
if (document.body.id === "page-intro") {

  const ships = document.querySelectorAll('.ship');

  ships.forEach(function(ship) {

    ship.addEventListener('click', function() {
      const shipId = ship.getAttribute('data-ship');
      localStorage.setItem('selectedShip', shipId);
      window.location.href = 'game.html';
    });
  });
}




const game = document.getElementById("game");
const gameWidth = game.clientWidth;
const gameHeight = game.clientHeight;

class Player {
  constructor() {
    this.width = 60;   
    this.height = 80;  
    this.positionX = gameWidth / 2 - this.width / 2;
    this.positionY = 20;
    this.selectedShip = localStorage.getItem('selectedShip') || 1;

    this.updateUI();
  }

  updateUI() {
    const playerELM = document.getElementById("player");
    playerELM.style.width = this.width + "px";
    playerELM.style.height = this.height + "px";
    playerELM.style.left = this.positionX + "px";
    playerELM.style.bottom = this.positionY + "px";
    playerELM.style.backgroundImage = `url(./Assets/SetAssets2/ship_${this.selectedShip}.png)`;
    playerELM.style.backgroundSize = "contain";
    playerELM.style.backgroundRepeat = "no-repeat";
  }

  moveLeft() {
    if (this.positionX > 0) {
      this.positionX -= 10;
      this.updateUI();
    }
  }

  moveRight() {
    if (this.positionX < gameWidth - this.width) {
      this.positionX += 10;
      this.updateUI();
    }
  }

  moveForward() {
    if (this.positionY < gameHeight - this.height) {
      this.positionY += 10;
      this.updateUI();
    }
  }

  moveBackwards() {
    if (this.positionY > 0) {
      this.positionY -= 10;
      this.updateUI();
    }
  }
}




  

class Meteor {
  constructor() {
    this.width = 150;   
    this.height = 150;  
    this.positionX = Math.random() * (gameWidth - this.width);
    this.positionY = gameHeight;
    this.MeteorELM = null;

    this.createMeteor();
    this.updateUI();
  }

  createMeteor() {
    this.MeteorELM = document.createElement("div");
    this.MeteorELM.className = "Meteor";
    game.appendChild(this.MeteorELM);
  }

  updateUI() {
    this.MeteorELM.style.width = this.width + "px";
    this.MeteorELM.style.height = this.height + "px";
    this.MeteorELM.style.left = this.positionX + "px";
    this.MeteorELM.style.bottom = this.positionY + "px";
  }

  moveDown() {
    this.positionY -= 4;
    this.updateUI();
    
  }
}

class Shooting{
  constructor(){
    this.width = 10;
    this.height = 15;
    this.positionX = player.positionX + player.width / 2 - this.width / 2;
    this.positionY = player.positionY + player.height;
    this.ShootingElm = null;
  }

  createShoot(){
      this.ShootingElm = document.createElement("div");
      this.ShootingElm.className = "bullet";
      game.appendChild(this.ShootingElm);
  }
    updateUI() {
    this.ShootingElm.style.width = this.width + "px";
    this.ShootingElm.style.height = this.height + "px";
    this.ShootingElm.style.left = this.positionX + "px";
    this.ShootingElm.style.bottom = this.positionY + "px";
  }
  moveUp(){
    this.positionY += 6
    this.updateUI()
  }
  
}




const player = new Player();
let MeteorsArr = [];
let shootArr = []
let keysPressed = {
  left: false,
  right: false,
  up: false,
  down: false
};

setInterval(() => {
  const newMeteor = new Meteor();
  MeteorsArr.push(newMeteor);
}, 2000);

setInterval(() => {
  MeteorsArr.forEach((MeteorInstance, index) => {
    MeteorInstance.moveDown();

    
    if (MeteorInstance.positionY + MeteorInstance.height < 0) {
      MeteorInstance.MeteorELM.remove();
      MeteorsArr.splice(index, 1);
    }
    if (
      player.positionX < MeteorInstance.positionX + MeteorInstance.width &&
      player.positionX + player.width > MeteorInstance.positionX &&
      player.positionY < MeteorInstance.positionY + MeteorInstance.height &&
      player.positionY + player.height > MeteorInstance.positionY
    ) {
      location.href = "gameover.html";
    }
  });
}, 50);

setInterval(() => {
 shootArr.forEach((bullet, bIndex) => {
    bullet.moveUp();
   
    if (bullet.positionY > gameHeight) {
      bullet.ShootingElm.remove();
      shootArr.splice(bIndex, 1);
      return;
    }
    MeteorsArr.forEach((meteor, mIndex) => {
      if (
        bullet.positionX < meteor.positionX + meteor.width &&
        bullet.positionX + bullet.width > meteor.positionX &&
        bullet.positionY < meteor.positionY + meteor.height &&
        bullet.positionY + bullet.height > meteor.positionY
      ) {
        
        bullet.ShootingElm.remove();
        shootArr.splice(bIndex, 1);

        meteor.MeteorELM.remove();
        MeteorsArr.splice(mIndex, 1);
        onMeteorDestroyed()
      }

    });
  });
}, 20);



document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") keysPressed.left = true;
  if (e.code === "ArrowRight") keysPressed.right = true;
  if (e.code === "ArrowUp") keysPressed.up = true;
  if (e.code === "ArrowDown") keysPressed.down = true;
  if (
    e.code === "ArrowUp" ||
    e.code === "ArrowDown" ||
    e.code === "ArrowLeft" ||
    e.code === "ArrowRight"
  ) {
    e.preventDefault();
  }
  if (e.code === "Space") {
    const bullet = new Shooting();
    bullet.createShoot();
    shootArr.push(bullet);
  }
});

  document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft") keysPressed.left = false;
  if (e.code === "ArrowRight") keysPressed.right = false;
  if (e.code === "ArrowUp") keysPressed.up = false;
  if (e.code === "ArrowDown") keysPressed.down = false;
});

//  smooth movement
function smoothPlayerMove() {
  if (keysPressed.left) player.moveLeft();
  if (keysPressed.right) player.moveRight();
  if (keysPressed.up) player.moveForward();
  if (keysPressed.down) player.moveBackwards();
  requestAnimationFrame(smoothPlayerMove);
}
smoothPlayerMove();
// score
let score = 0;
const scoreDisplay = document.getElementById('score');

function updateScore(points) {
  score += points;
  scoreDisplay.textContent = `Score: ${score}`;
}
setInterval(() => {
  updateScore(10);
}, 5000);

function onMeteorDestroyed() {
  updateScore(10);
}