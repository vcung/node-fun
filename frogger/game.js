/*time = new Date();
timer = time.getMinutes();
then = Date.now();
var frogger;
*/
var CANVAS_W;
var CANVAS_H;

//Initializes a Frog and draws it in given coordinates
var Frog = function (x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.initX = x;
  this.initY = y;
  this.alive = true;
};

//Draw the frog
Frog.prototype.draw = function() {
  ctx.drawImage(sprites, 11, 369, this.h, this.w, this.x, this.y, this.h, this.w);
};
//Draw the frog in initial position
Frog.prototype.resetPosition = function() {
  this.x = this.initX;
  this.y = this.initY;
  this.draw();
};


//An Obstacle has x, y coordinates of their position on the canvas, the image width and height,
//the x, y coordinates of the image on the sprite sheet, a row offset, and speed
var Obstacle = function (x, y, w, h, spriteX, spriteY, offset, speed) {
  this.x = x + offset;
  this.y = y;
  this.w = w;
  this.h = h;
  this.spriteX = spriteX;
  this.spriteY = spriteY;
  this.offset = offset;
  this.speed = speed;
};

//Draw the vehicle
Obstacle.prototype.draw = function() {
  ctx.drawImage(sprites, this.spriteX, this.spriteY, this.w, this.h, this.x, this.y, this.w, this.h);
};

//set some stats
function initStats() {
	home_frogs = 0;
	lives = 4;
	lvl = 1;
	score = 0;
	highsc = 0;
	prev_score = 0;
	frog_on_log = false;
	on_log = null;
	veh_speed = 0;
	log_speed = 0;
	frog_hop = 0;
	base_score = 0;
	lanes = new Array(5);
	logs = new Array(5);
}

//Initiate 5 rows of vehicles starting from the bottom
function initCars(){
	lanes[0] = new Array(2);
	lanes[1] = new Array(4);
	lanes[2] = new Array(2);
	lanes[3] = new Array(3);
	lanes[4] = new Array(2);

	for (var i=0; i < lanes.length; i++) {
		var speed = Math.floor((Math.random() * 9) + 3);
		for (var j = 0; j < lanes[i].length; j++) {
			if (i == 0) {
				lanes[i][j] = new Obstacle(-103, 315, 24, 25, 81, 264, 250*(j+1), -speed);
			}
			if (i == 1) {
				lanes[i][j] = new Obstacle(163, 375, 28, 28, 44, 263, -170*(j*10+1), speed);
			}
			if (i == 2) {
				lanes[i][j] = new Obstacle(-47, 410, 34, 22, 6, 265, 200*(j+1), -speed);
			}
			if (i == 3) {
				lanes[i][j] = new Obstacle(-59, 348, 47, 16, 105, 303, 128*(j+1), -speed);
			}
			if (i == 4) {
				lanes[i][j] = new Obstacle(73, 445, 28, 22, 70, 300, -130*(j*10+1), speed);
			}
		}
	}
}
//initiate log objects
function initLogs(){
	logs[0] = new Array(4);
	logs[1] = new Array(4);
	logs[2] = new Array(2);
	logs[3] = new Array(2);
	logs[4] = new Array(3);
//x, y, w, h, spriteX, spriteY, offset, speed
	for (var i=0; i < logs.length; i++) {
		var speed = Math.floor((Math.random() * 7) + 2);
		var rand_x = Math.floor((Math.random() * CANVAS_W-100) + 0);
		for (var j = 0; j < logs[i].length; j++) {
			if (i == 0) {
				var offset = 150*(j+1);
				logs[i][j] = new Obstacle(-rand_x, 105, 83, 40, 7, 221, offset, -speed);
			}
			if (i == 1) {
				var offset = -160*(j+1);
				logs[i][j] = new Obstacle(rand_x, 205, 83, 40, 7, 221, offset, speed);
			}
			if (i == 2) {
				var offset = 260*(j+1);
				logs[i][j] = new Obstacle(-rand_x, 135, 178, 44, 7, 153, offset, -speed);
			}
			if (i == 3) {
				var offset = 310*(j+1);
				logs[i][j] = new Obstacle(-rand_x, 235, 178, 44, 7, 153, offset, -speed);
			}
			if (i == 4) {
				var offset = -230*(j+1);
				logs[i][j] = new Obstacle(rand_x, 170, 116, 42, 7, 187, offset, speed);
			}
		}
	}
}
//initiate fly object
function initFly() {
	fly = new Object;
	fly.w = 20
	fly.h = 20
	fly.x = Math.floor((Math.random() * CANVAS_W)+1);
	fly.y = Math.floor((Math.random() * 385)+100);
	m = fly.x;
	n = fly.y;
}
//initiate lady objects
function initLady() {
	lady = new Object;
	lady.w = 30
	lady.h = 28
	lady.x = Math.floor((Math.random() * CANVAS_W)+1);
	lady.y = Math.floor((Math.random() * 385)+100);
	ladyx = lady.x;
	ladyy = lady.y;
}

//fills in water blue and street back
function fillBG() {
  ctx.fillStyle = '#191970';
  ctx.fillRect(0, 0, 399, 280);
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 307, 399, 280);
}

//draws the background: The purple street, the green finish line, & the title
function drawBG() {
  title = ctx.drawImage(sprites, 13, 11, 321, 34, 0, 0, 399, 34);
  greenTop = ctx.drawImage(sprites, 0, 53, 399, 56, 0, 53, 399, 53);
  purpleTop = ctx.drawImage(sprites, 0, 117, 399, 37, 0, 272, 399, 37);
  purpleBot = ctx.drawImage(sprites, 0, 117, 399, 37, 0, 473, 399, 37);
}

function redrawBG() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fillBG();
  drawBG();
}

//draws the stats at the bottom of the game
//including lives left, level, score, and highscore
function drawStats(numFrogs, lvl, score, highsc) {
  for (i=0; i<numFrogs; i++){
    ctx.drawImage(sprites, 12, 333, 18, 24, i*18, 511, 18, 24);
  }
  ctx.fillStyle = "green";
  ctx.font = "bold 18px Arial";
  ctx.fillText("Level "+ lvl, 324, 529);
  ctx.fillText("Score: "+ score, 2, 560);
  ctx.fillText("Highscore: "+highsc, 120, 530);

  //ctx.fillText("Time: ", 220, 560); 
  //if (timer >= -10000) {
  //  time_left = Math.round(150-(timer/10000));
  //  ctx.fillRect(275, 548, time_left, 12);
  //}
}

//Moves and draws all five lanes of vehicles
function drawVehicles(){
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 307, 399, 280);
  ctx.drawImage(sprites, 0, 117, 399, 37, 0, 473, 399, 37);
  moveObstacle(lanes);
  drawStats(lives, lvl, score, highsc);
}

//Draws the logs
function drawLogs() {
  ctx.fillStyle = '#191970';
  ctx.fillRect(0, 0, 399, 280);
  ctx.drawImage(sprites, 13, 11, 321, 34, 0, 0, 399, 34);
  ctx.drawImage(sprites, 0, 53, 399, 56, 0, 53, 399, 53);
  moveObstacle(logs);
}

//Update the x, y coordinates of given array of Obstacles
function moveObstacle (obstacles) {
  for (var i=0; i < obstacles.length; i++) {
    for (var j = 0; j < obstacles[i].length; j++) {
      var x = obstacles[i][j].x;
      var offset = obstacles[i][j].offset;
      var width = obstacles[i][j].w;
     
      if (i == 0) { //row 1 moving left
        if (x <= (0 - width)) {
          x = CANVAS_W + width;
        } else {
          x += obstacles[i][j].speed;
        }
      }
      if (i == 1) { //row 2 moving right
        if (x >= (CANVAS_W + width)) {
          x = 0 - width;
        } else {
          x += obstacles[i][j].speed;
        }
      }
      if (i == 2) {
        if (x <= (0 - width)) { //row 3 moving left
          x = CANVAS_W;
        } else {
          x += obstacles[i][j].speed;
        }
      }
       if (i == 3) { //row 4 moving left
        if (x <= (0 - width)) {
          x = CANVAS_W;
        } else {
          x += obstacles[i][j].speed;
        }
      }
      if (i == 4) {
        if (x >= (CANVAS_W + width)) { //row 5 moving right
          x = 0 - width;
        } else {
          x += obstacles[i][j].speed;
        }
      }
      obstacles[i][j].x = x;
      obstacles[i][j].draw();
    }
  }
}

//redraw the fly somewhere random on the canvas
function moveFly() {
  fly.x = (Math.random() * (CANVAS_W));
  fly.y = Math.floor((Math.random() * 405)+80);
  m = fly.x;
  n = fly.y;
  drawFly();
}

function drawFly(){
  ctx.drawImage(sprites, 138, 234, 20, 20, m, n, 20, 20);
}
//redraw lady frog somewhere random on the canvas
function moveLady() {
  lady.x = (Math.random() * (CANVAS_W));
  lady.y = Math.floor((Math.random() * 405)+80);
  ladyx = lady.x;
  ladyy = lady.y;
  drawLady();
}
function drawLady(){
  ctx.drawImage(sprites, 231, 405, 30, 28, ladyx, ladyy, 30, 28);
}

//Start the game, called when canvas renders on the dom
function initGame() {
  canvas = document.getElementById("game");
  CANVAS_W = canvas.width;
  CANVAS_H = canvas.height;
  // Check if canvas is supported on browser
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
    setupCanvas();
  } else {
    alert('Sorry, canvas is not supported on your browser!');
  }
} 
//Start drawing Frogger the canvas
function setupCanvas() {
  sprites = new Image();
  sprites.src = "assets/frogger_sprites.png";
  //When the sprites finish loading
  sprites.onload = function () {
    addEventListener('keydown', onKeyDown, false);
    initStats();
    //Creates a Frog at the center of the game of size 17 x 24
    frogger = new Frog(175, 485, 17, 24);
    frogger.draw();
    frog_home=0;
    fillBG();
    drawBG();
    drawStats(lives, lvl, score, highsc);
    initCars();
    initLogs();
    drawVehicles(veh_speed);
    drawLogs(log_speed);
    //Create bonus fly
    initFly();
    setInterval(moveFly, 2000);
    //Create lady frog
    initLady();
    setInterval(moveLady, 3000);
    //Start the game loop
    setInterval(drawGame, 140);
  }
}

//Updates the game - check stats and redraw elements
//Checks if the user loses the game
function drawGame() {
  if (lives != 0 && !checkWin()) {
    //timer = timer + time.getMinutes();
    //var now = Date.now();
    //var diffInTime = now - then;	

    //change = diffInTime / 1000;
    frog_hop = 8;
    redrawBG();
    drawLogs();
    drawVehicles();
    if (frog_on_log) {
      moveWithLog(on_log);
    }
    frogger.draw();
    drawStats(lives, lvl, score, highsc);
    detectCollision();
    drawFly(m, n);
    drawLady(ladyx, ladyy);
    //then = now;
    checkLife();
  }
  else {
    resetGame();
  }
}

//Moves Frogger according to keyboard arrow input from user
function onKeyDown(e) {
  var y = frogger.y;
  var x = frogger.x;
  switch(e.keyCode) {
    //Up key pressed
    case 38: 
      if(y > 60)  {
        y = -frog_hop;
        changeScore(10);
      }
      break;
    //Down key pressed
    case 40:
      if (y < frogger.initY){
        y = frog_hop;
        if (score > 0) {
          changeScore(-10);
        }
      }
      break;
    //Left key pressed
    case 37:
      if (x > 1){
        x = -frog_hop;
      }
      break;
    //Right key pressed
    case 39: 
      if (x < (CANVAS_W - (frogger.w*2))) {
        x = frog_hop;
      }
      break;
  }

  if (x == frogger.x) {
    x = 0;
  }
  if (y == frogger.y) {
    y = 0;
  }
  frogger.x += x;
  frogger.y += y;
}

//Increments score by given amount. Value can be negative to decrease score
//Score cannot go below base score
function changeScore(num) {
  if (num < 0 && score == base_score) {
    return;
  } else {
    score += num;
  }
}

//Check if Frogger collides with any elements in the game
//Adjust score and end game if the frog collides with another object
function detectCollision() {
  if (hasCollided(fly)) {
    moveFly();
    score+=200;
  }
  if (hasCollided(lady)){
    moveLady();
    score+=200;
  }
  //Check if Frogger is in the water area
  if (frogger.y < 265) {
    //Check the Frogger is on a log
    for (var i=0; i < logs.length; i++) {
      for (var j = 0; j < logs[i].length; j++) {

        if (isOnLog(logs[i][j])) {
          frog_on_log = true;
          on_log = logs[i][j];
          return;
        }
      }
    }

    loseLife();
    frogger.resetPosition();
  }
  else {
    //Check collision with vehicles
    frog_on_log = false;
    on_log = null;
    for (var i=0; i < lanes.length; i++) {
      for (var j = 0; j < lanes[i].length; j++) {
        if (hasCollided(lanes[i][j])) {
          loseLife();
          frogger.resetPosition();
          return;
        }
      }
    }
  }
}

//Returns true if Frogger has collided with given object
//Object must have x, y coordinates and a set width and height
function hasCollided(obj) {
  frogx= frogger.x;
  frogy= frogger.y;	 
  //collision from right
  if (frogx + frogger.w < obj.x) {
    return false;
  }
  //front-on collision
  if (frogy + frogger.h < obj.y) {
    return false;
  }
  //collision from left
  if (frogx > obj.x + obj.w) {
    return false;
  }
  //collision from bottom
  if (frogy > obj.y + obj.h){
    return false;
  }
  return true;
}

//Returns true if frog is on log, false otherwise
function isOnLog(obj) {
  x= frogger.x;
  y= frogger.y;	

  return  ((x >= obj.x)&&(x <= obj.x + obj.w) && 
    (y + frogger.h < obj.y + obj.h + 8) && (y >= obj.y - 8));
}

//Update stats when the user loses a life
function loseLife(){
  lives--;
  base_score == score;
  drawStats(lives, lvl, score, highsc);
}

//Resets the game, update highscore
function resetGame() {
  //score += Math.round(time_left*10);
  var player_name = prompt("Enter your name to send high score");
  if (player_name) {
    if (player_name.length > 20) {
      player_name = player_name.substring(0, 20);
    }
    submitScore(player_name);
  }

  if (score>highsc){
    highsc = score;
  }
  frogger.resetPosition();
  score = 0;
  lives = 4;
  lvl = 1;
  veh_speed = 0;
  log_speed = 0;
  frog_on_log = false;
  timer = 0;
  time = new Date();
  drawStats(lives, lvl, score, highsc);
}

//Moves frog at same pace and direction as log it is on
function moveWithLog(log) {
   frogger.x += log.speed;
}

//Player gets another life if they scored an additional 10000
function checkLife() {
  if ((frogger.x + frogger.w) < 0 || (frogger.x + frogger.w) > CANVAS_W) {
    loseLife();
    frogger.resetPosition();
  }
  if (score >= (prev_score + 10000)) {
    if (lives < 4) {
      lives++;
      drawStats(lives, lvl, score, highsc);
    }	
    prev_score = score;
  }
  if (lives <= 0) {
    resetGame();
  }
}

//Increases speed of cars and logs, updates game for new level
function nextLevel(){
  //score += Math.round(time_left*10);
  frogger.resetPosition();
  lvl++;
  increaseObstacleSpd(lanes, 2);
  increaseObstacleSpd(logs, 2);
  frog_on_log = false;
  drawStats(lives, lvl, score, highsc);
  //timer = 0;
  //time = new Date();
}

//Check if Frogger makes it to the other side, add bonus scores if appropriate
function checkWin () {
  if (frogger.y < 120) {
    frog_home += 1;
    if (frog_home >= 5) {
      changeScore(1000);
    }
    else {
      changeScore(50);
    }
    nextLevel();
  }
}

//Increment speed of given array of Obstacles
function increaseObstacleSpd(obs, num) {
   for (var i=0; i < obs.length; i++) {
    for (var j = 0; j < obs[i].length; j++) {
      obs[i][j].speed += num;
    }
  }
}


