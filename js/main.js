function setupAudio() {
  // Sonidos del juego
  const shootSound = new Audio("./Assets/audio/laser-gun-shot-sound-future-sci-fi-lazer-wobble-chakongaudio-174883.mp3");
  shootSound.volume = 0.5;
  shootSound.preload = "auto";

  const hitSound = new Audio("./Assets/audio/SE-Explosion3-C.ogg");
  hitSound.volume = 1;
  hitSound.preload = "auto";

  const hitGroundSound = new Audio("./Assets/audio/SE-Explosion3-D.ogg");
  hitGroundSound.volume = 0.9;
  hitGroundSound.preload = "auto";

  // Música de index
  const introMusic = document.getElementById("introMusic-index");
  if (introMusic) {
    introMusic.volume = 0.5;
    introMusic.preload = "auto";

    // Se reproduce al primer click del usuario
    const playIntroMusic = () => {
      introMusic.play().catch(() => {});
      window.removeEventListener("click", playIntroMusic);
    };
    window.addEventListener("click", playIntroMusic, { once: true });
  }

  // Música de game
  const gameMusic = document.getElementById("music-index");
  if (gameMusic) {
    gameMusic.volume = 0.4;
    gameMusic.preload = "auto";
    gameMusic.play().catch(() => {});
  }

  return { shootSound, hitSound, hitGroundSound, introMusic, gameMusic };
}

const audio = setupAudio();

/* -------------------------------
   SELECCIÓN DE NAVE (INTRO)
--------------------------------*/
if (document.body.id === "page-intro") {
  const ships = document.querySelectorAll('.ship');
  ships.forEach(ship => {
    ship.addEventListener('click', () => {
      localStorage.setItem('selectedShip', ship.getAttribute('data-ship'));
      window.location.href = 'game.html';
    });
  });
}

/* -------------------------------
   INSTRUCCIONES DE JUEGO
--------------------------------*/
window.addEventListener('load', () => {
  const instructionBox = document.getElementById('instruction-box');
  if (!instructionBox) return;

  instructionBox.style.display = 'block';
  setTimeout(() => instructionBox.style.display = 'none', 10000);
});


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
    this.active = true;
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
    if (!this.active) return; // solo mover meteoritos activos

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

  destroy() {
    this.active = false; // desactiva el meteorito
    this.MeteorELM.remove();
  }
}

// SHOOTING
class Shooting {
  constructor() {
    this.width = 40;
    this.height = 40;
    this.positionX = player.positionX + player.width / 2 - this.width / 2;
    this.positionY = player.positionY + player.height;
    this.hitboxOffsetX = 0;
    this.hitboxOffsetY = 0;
    this.hitboxWidth = this.width;
    this.hitboxHeight = this.height;
    this.ShootingElm = null;
  }

  createShoot() {
    this.ShootingElm = document.createElement("div");
    this.ShootingElm.className = "bullet";

    // background de la bala
    this.ShootingElm.style.backgroundImage = "url('./Assets/micromuzzle.PNG')";
    this.ShootingElm.style.backgroundSize = "contain";
    this.ShootingElm.style.backgroundRepeat = "no-repeat";

    game.appendChild(this.ShootingElm);
    this.updateUI();
  }

  updateUI() {
    this.ShootingElm.style.width = this.width + "px";
    this.ShootingElm.style.height = this.height + "px";
    this.ShootingElm.style.left = this.positionX + "px";
    this.ShootingElm.style.bottom = this.positionY + "px";
    this.ShootingElm.style.position = "absolute";
  }

  moveUp() {
    this.positionY += 10;
    this.updateUI();
  }


  updateUI() {
    if (!this.ShootingElm) return;
    this.ShootingElm.style.width = this.width + "px";
    this.ShootingElm.style.height = this.height + "px";
    this.ShootingElm.style.left = this.positionX + "px";
    this.ShootingElm.style.bottom = this.positionY + "px";
    this.ShootingElm.style.position = "absolute";
    this.ShootingElm.style.zIndex = "50";
  }

  moveUp() {
    this.positionY += 10;
    this.updateUI();
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
}, 8000);

//METEOR COLLISION
// METEOR COLLISION & GROUND IMPACT
setInterval(() => {
  for (let i = MeteorsArr.length - 1; i >= 0; i--) {
    const meteor = MeteorsArr[i];

    if (!meteor.active) continue;

    meteor.moveDown();

    // Meteorito llega al suelo
    if (meteor.positionY <= 0) {
      meteor.active = false;
      meteor.MeteorELM.remove();

      audio.hitGroundSound.currentTime = 0;
      audio.hitGroundSound.play();

      createGif(
        meteor.positionX,
        0,
        meteor.width,
        meteor.height,
        './Assets/Explosion Audio Pack/explosion pack 1/Explosions pack/meteor small contra suelo/Preview.gif',
        500
      );

      updatePlanetHealth(10);
      MeteorsArr.splice(i, 1);
      continue;
    }

    // Colisión con el jugador
    if (!meteor.hitPlayer && isCollision(player, meteor)) {
      meteor.hitPlayer = true;
      meteor.active = false;

      // eliminamos el meteorito antes de mostrar el GIF
      meteor.MeteorELM.remove();

      playerHealth -= 1;
      updatePlayerHealth();

      audio.hitSound.currentTime = 0;
      audio.hitSound.play();

      // Mostrar GIF en la posición del meteorito
      createGif(
        meteor.positionX,
        meteor.positionY,
        meteor.width,
        meteor.height,
        './Assets/Explosion Audio Pack/explosion pack 1/Explosions pack/bullet contra meteor/Preview.gif',
        400
      );

      // Eliminamos del array
      MeteorsArr.splice(i, 1);
    }
  }
}, 50);

// Función para crear GIF en pantalla
function createGif(x, y, width, height, url, duration) {
  const gif = document.createElement("div");
  gif.style.backgroundImage = `url('${url}')`;
  gif.style.backgroundSize = "contain";
  gif.style.backgroundRepeat = "no-repeat";
  gif.style.width = width + "px";
  gif.style.height = height + "px";
  gif.style.position = "absolute";
  gif.style.left = x + "px";
  gif.style.bottom = y + "px";
  gif.style.zIndex = "100";

  game.appendChild(gif);

  setTimeout(() => {
    gif.remove();
  }, duration);
}



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

        audio.hitSound.currentTime = 0;
        audio.hitSound.play();

        const explosion = document.createElement("div");
        explosion.className = "explosion";
        explosion.style.backgroundImage = "url('./Assets/Explosion Audio Pack/explosion pack 1/Explosions pack/bullet contra meteor/Preview.gif')";
        explosion.style.backgroundSize = "contain";
        explosion.style.backgroundRepeat = "no-repeat";
        explosion.style.width = meteor.width + "px";
        explosion.style.height = meteor.height + "px";
        explosion.style.position = "absolute";
        explosion.style.left = meteor.positionX + "px";
        explosion.style.bottom = meteor.positionY + "px";
        explosion.style.zIndex = "100";

        game.appendChild(explosion);

        
        setTimeout(() => {
          if (explosion) explosion.remove();
  }, 400);

        meteor.health -= 1; // RESTA VIDA AL METEORITO

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
    audio.shootSound.currentTime = 0;
    audio.shootSound.play();
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

//dificultat
let meteorSpawnInterval = 8000; // intervalo inicial de aparición 
let lastMeteorSpawn = Date.now();

function adjustDifficulty() {
  if (score >= 1000) {
    meteorSpawnInterval = 4000; 
  }
  if (score >= 2000) {
    meteorSpawnInterval = 2500; 
  }
  
}

function spawnMeteor() {
  const newMeteor = new Meteor("big");
  MeteorsArr.push(newMeteor);
}

setInterval(() => {
  adjustDifficulty();
  
  const now = Date.now();
  if (now - lastMeteorSpawn >= meteorSpawnInterval) {
    spawnMeteor();
    lastMeteorSpawn = now;
  }
}, 100);