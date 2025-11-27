//selecion de INTRO nave
if (document.body.id === "page-intro") {

  const ships = document.querySelectorAll('.ship');

  ships.forEach(function (ship) {

    ship.addEventListener('click', function () {
      const shipId = ship.getAttribute('data-ship');
      localStorage.setItem('selectedShip', shipId);
      window.location.href = 'game.html';
    });
  });
}




const game = document.getElementById("game");
const gameWidth = game.clientWidth;
const gameHeight = game.clientHeight;
 // JUGADOR
class Player {
  constructor() {
    this.width = 60;
    this.height = 80;
    this.positionX = gameWidth / 2 - this.width / 2;
    this.positionY = 20;
    this.selectedShip = localStorage.getItem('selectedShip') || 1;
    this.hitboxOffsetX = 12;
    this.hitboxOffsetY = 10;
    this.hitboxWidth = this.width - 24; 
    this.hitboxHeight = this.height - 20; 

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





//METEORITOS
class Meteor {
  constructor(size = "big", positionX = null, positionY = null) {
    this.size = size;
    if (size === "big") {
      this.width = 150;
      this.height = 150;
      this.health = 3;
      //hitbox
      this.hitboxOffsetX = 18;
      this.hitboxOffsetY = 18;
      this.hitboxWidth = this.width - 36;
      this.hitboxHeight = this.height - 36;
    } else if (size === "medium") {
      this.width = 60;
      this.height = 60;
      this.health = 2;
      //hitbox
      this.hitboxOffsetX = 10;
      this.hitboxOffsetY = 10;
      this.hitboxWidth = this.width - 20;
      this.hitboxHeight = this.height - 20;
    } else {
      this.width = 40;
      this.height = 40;
      this.health = 1;
      this.directionX = Math.random() < 0.5 ? -1 : 1;
      this.speedX = 2 + Math.random() * 2;
      //hitbox
      this.hitboxOffsetX = 6;
      this.hitboxOffsetY = 6;
      this.hitboxWidth = this.width - 12;
      this.hitboxHeight = this.height - 12;
    }
    this.positionX = positionX !== null ? positionX : Math.random() * (gameWidth - this.width);
    this.positionY = positionY !== null ? positionY : gameHeight;
    this.MeteorELM = null;

    this.createMeteor();
    this.updateUI();
  }

  createMeteor() {
    this.MeteorELM = document.createElement("div");
    this.MeteorELM.className = `Meteor ${this.size}`;
    // asignacion imagenes meteoritos
    if (this.size === "big") {
      this.MeteorELM.style.backgroundImage = `url(./Assets/SetAssets2/meteor.png)`;
    } else if (this.size === "medium") {
      this.MeteorELM.style.backgroundImage = `url(./Assets/space_background_pack/asteroid-1.png)`;
    } else {
      this.MeteorELM.style.backgroundImage = `url(./Assets/SetAssets2/flaming_meteor.png)`;
    }
    game.appendChild(this.MeteorELM);
  }

  updateUI() {
    this.MeteorELM.style.width = this.width + "px";
    this.MeteorELM.style.height = this.height + "px";
    this.MeteorELM.style.left = this.positionX + "px";
    this.MeteorELM.style.bottom = this.positionY + "px";
  }

  moveDown() {
    let speed = 2;
    if (this.size === "medium") speed = 3;
    if (this.size === "small") {
      speed = 4;
      this.positionX += this.directionX * this.speedX;
      if (this.positionX <= 0 || this.positionX >= gameWidth - this.width) {
      this.directionX *= -1;
    }
  }
    this.positionY -= speed;
    this.updateUI();
  }
}
// SHOOTING
class Shooting {
  constructor() {
    this.width = 10;
    this.height = 15;
    this.positionX = player.positionX + player.width / 2 - this.width / 2;
    this.positionY = player.positionY + player.height;
    this.hitboxOffsetX = 0
    this.hitboxOffsetY = 0
    this.hitboxWidth = this.width
    this.hitboxHeight = this.height
    this.ShootingElm = null;
  }

  createShoot() {
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
  moveUp() {
    this.positionY += 10
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
  const newMeteor = new Meteor("big");
  MeteorsArr.push(newMeteor);
}, 5000);

//METEOR COLLISION
setInterval(() => {
  MeteorsArr.forEach((MeteorInstance, index) => {
    MeteorInstance.moveDown();


    if (MeteorInstance.positionY + MeteorInstance.height < 0) {
      MeteorInstance.MeteorELM.remove();
      MeteorsArr.splice(index, 1);
      updatePlanetHealth(10);
    }
    if (isCollision(player, MeteorInstance)) {
       playerHealth -= 1;
       updatePlayerHealth();
      MeteorInstance.MeteorELM.remove();
      MeteorsArr.splice(index, 1);
    }
    
  });
}, 50);

//SHOOTING COLLISION AND METEORITES SIZE CREATIONS(BUG DISPAROS FROZEN: FIXED)
setInterval(() => {
  for (let bIndex = shootArr.length - 1; bIndex >= 0; bIndex--) {
    const bullet = shootArr[bIndex];
    bullet.moveUp();

    if (bullet.positionY > gameHeight) {
      bullet.ShootingElm.remove();
      shootArr.splice(bIndex, 1);
      continue;
    }

    for (let mIndex = MeteorsArr.length - 1; mIndex >= 0; mIndex--) {
      const meteor = MeteorsArr[mIndex];
      if (isCollision(bullet, meteor)) {
        bullet.ShootingElm.remove();
        shootArr.splice(bIndex, 1);

        meteor.health -= 1; // RESTA VIDA

        if (meteor.health <= 0) {
          meteor.MeteorELM.remove();
          MeteorsArr.splice(mIndex, 1);
          

          if (meteor.size === "big") {
            for (let i = 0; i < 2; i++) {
              const offsetX = meteor.positionX + (i === 0 ? -40 : 40);
              const mediumMeteor = new Meteor("medium", Math.max(0, Math.min(gameWidth - 80, offsetX)), meteor.positionY);
              MeteorsArr.push(mediumMeteor);
            }
          } else if (meteor.size === "medium") {
            for (let i = 0; i < 3; i++) {
              const offsetX = meteor.positionX + (i - 1) * 30;
              const smallMeteor = new Meteor("small", Math.max(0, Math.min(gameWidth - 40, offsetX)), meteor.positionY);
              MeteorsArr.push(smallMeteor);
            }
          }
          onMeteorDestroyed();
        }
        break;
      }
    }
  }
}, 20);

//KEY BINDINGS
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

//  SMOOTH MOVEMENTS
function smoothPlayerMove() {
  if (keysPressed.left) player.moveLeft();
  if (keysPressed.right) player.moveRight();
  if (keysPressed.up) player.moveForward();
  if (keysPressed.down) player.moveBackwards();
  requestAnimationFrame(smoothPlayerMove);
}
smoothPlayerMove();

// SCORE
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

//PLANET HEALTH
let planetHealth = 100; 
const planetHealthBar = document.getElementById('planet-health');

function updatePlanetHealth(damage) {
  planetHealth -= damage;
  if (planetHealth < 0) planetHealth = 0;
  planetHealthBar.style.width = planetHealth + "%";

  
  if (planetHealth <= 30) {
    planetHealthBar.style.background = "rgba(255, 94, 0, 0.94)"; 
  } else if (planetHealth <= 60) {
    planetHealthBar.style.background = "#ff0"; 
  } else {
    planetHealthBar.style.background = "#0f0"; 
  }

  if (planetHealth === 0) {
    setTimeout(() => {
      location.href = "gameover.html";
    }, 500);
  }
}
// PLAYER HEALTH
let playerHealth = 3;
const playerHearts = document.querySelectorAll('.heart');

function updatePlayerHealth() {
  playerHearts.forEach((heart, idx) => {
    heart.style.opacity = idx < playerHealth ? "1" : "0.2";
  });
  if (playerHealth <= 0) {
    setTimeout(() => {
      location.href = "gameover.html";
    }, 500);
  }
}
//hitbox collision
function isCollision(objA, objB) {
  return (
    objA.positionX + objA.hitboxOffsetX < objB.positionX + objB.hitboxOffsetX + objB.hitboxWidth &&
    objA.positionX + objA.hitboxOffsetX + objA.hitboxWidth > objB.positionX + objB.hitboxOffsetX &&
    objA.positionY + objA.hitboxOffsetY < objB.positionY + objB.hitboxOffsetY + objB.hitboxHeight &&
    objA.positionY + objA.hitboxOffsetY + objA.hitboxHeight > objB.positionY + objB.hitboxOffsetY
  );
}