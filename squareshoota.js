var engine = function() {

	var canvas = document.getElementById("canvas");
	var surface = canvas.getContext("2d");
	var width = surface.canvas.width = window.innerWidth;
	var height = surface.canvas.height = window.innerHeight;
	var player = newPlayer();
	var numberOfEnemies = 3;
	var enemies = createEnemies(numberOfEnemies);
	var powerUps = [];
	var level = 1;
	var interval = undefined;
	var strikes = 20;
	var gameTimeout;
	var score = 0;

	var drawScreen = function() {
		surface.clearRect(0, 0, width, height);
		surface.fillStyle = "black";
		surface.fillRect(0, 0, width, height);
		drawStats();   
		drawPlayer();
		drawEnemies();
		drawPowerUps();
	}
	var drawStats = function() {
		surface.fillStyle="purple";
		surface.font = "20px Arial";
		surface.fillText("STRIKES: " + strikes, 20, 20);
		surface.fillText("LEVEL: " + level, 20, 40);
		surface.fillText("SCORE: " + score, 20, 60);
	}
	var drawEnemies = function() {
		surface.fillStyle="purple";
		each(enemies, function(enemy) {
			enemy.draw();
		})
	}
	var drawPlayer = function() {
		player.draw();
		each(player.bullets, function(bullet) {
			bullet.draw();
		})
	}
	var drawPowerUps = function() {
		each(powerUps, function(powerUp) {
			powerUp.draw();
		})
	}
	var each = function(args, funkmaster) {
		for (var j = 0; j < args.length; j++)
			funkmaster(args[j]);
	}
	function createEnemies(numEnemies) {
		var enems = [];

		for (var k = 0; k < numEnemies; k++) {

			var newEnem = newEnemy();
			newEnem.x = Math.floor((Math.random()*(width+10)) + width);
			newEnem.y = randomEnemyY(height-20);
			enems.push(newEnem);
		}
		return enems;
	}
	function selectRandomPosition() {
		var positions = ["left", "right", "top", "bottom"];
		return positions[Math.floor(Math.random()*positions.length)];
	}
	function newPlayer() {
		var player = {
			w: 20,
			h: 20,
			x: width/4,
			y: height/4,
			speed: 0.1,       
			outlineColor: "white",
			xDistance: undefined,
			yDistance: undefined,
			bullets: [],
			name: undefined,
			draw: function() {
				if (this.x < 0)
					this.x = 0;
				else if (this.x > width)
					this.x =width-this.w;
				if (this.y < 0)
					this.y = 0;
				else if (this.y > height)
					this.y = height-this.y;

				if (this.xDistance != undefined && this.yDistance != undefined) {
					this.x += (this.xDistance * this.speed);
					this.y += (this.yDistance * this.speed);
					surface.strokeStyle = this.outlineColor;
					surface.strokeRect(this.x, this.y, this.w, this.h);
				}
				else {
					surface.strokeStyle = this.outlineColor;
					surface.strokeRect(this.x, this.y, this.w, this.h);
				}
				
			},
			shoot: function() {
				var bullet = newBullet(this.x, this.y,this.xDistance * this.speed,this.yDistance * this.speed);
				this.bullets.push(bullet);
			}
		}
		return player;
	}
	function newBullet(x, y, xIncrementor, yIncrementor) {

		var bullet = {
			x: x,
			y: y,
			w: 10,
			h: 10,
			xInc: xIncrementor*5,
			yInc: yIncrementor*5,
			fillColor: "blue",
			draw: function() {
				var w = this.w;
				var h = this.h;
				var x = this.x;
				var y = this.y;
				if (this.x < 0 || this.x > width || this.y < 0 || this.y > height)
					removePlayerBullet(this);

				each(enemies, function(enemy) {
					if ((enemy.x < (x+w) && (enemy.x+enemy.w) > (x+w)) || (x < (enemy.x + enemy.w) && x > enemy.x))  {
						if (y < (enemy.y + enemy.h) && y > (enemy.y - (h/2))) {
							score++;
							enemies.splice(enemies.indexOf(enemy), 1);
						}
					}
				})
				this.x += this.xInc;
				this.y += this.yInc;
				surface.fillStyle = this.fillColor;
				surface.fillRect(this.x, this.y, this.w, this.h );
				
			}
		}
		return bullet;
	}
	var removePlayerBullet = function(b) {
		player.bullets.splice(player.bullets.indexOf(b), 1);
	}
	var removeEnemy = function(enemy) {
		enemies.splice(enemies.indexOf(enemy), 1);
	}
	function newEnemy() {
		var enemy = {
			x: 0,
			y: 0,
			w: 30,
			h: 30,
			outlineColor: getRandomColor(),
			bullets: [],
			xDistance: 0,
			yDistance: 0,
			speed: 0.1,
			draw: function() {
				this.x -= 1;
				/*this.x += (this.xDistance * this.speed);
				this.y += (this.yDistance * this.speed);
				*/
				if (this.x < 0) {
					strikes--;
					removeEnemy(this);
				}

				surface.fillStyle = this.outlineColor;
				surface.fillRect(this.x, this.y, this.w, this.h);
			}
		}
		return enemy;
	}   
	function getRandomColor() {
		var colors = ["green", "white", "red", "purple"];
		return colors[Math.floor(Math.random()*colors.length)];
	}
	function randomEnemyX(limit) {
		return Math.floor(Math.random()*limit);
	}
	function randomEnemyY(limit) {
		return Math.floor(Math.random()*limit);
	}
	window.onresize = function() {
		var width = surface.canvas.width = window.innerWidth;
		var height = surface.canvas.height = window.innerHeight;
	}

	var addKeyListener = function() {
		window.addEventListener("keypress", function(k) {
			if (k.charCode == 32) {
				player.shoot();
			}
		});
		canvas.addEventListener("mousemove", function(mouse) {

			var xDistance = mouse.clientX - player.x;
			var yDistance = mouse.clientY - player.y;
			var distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
			var easingAmount = 0.05;
			var distanceForX = xDistance * easingAmount;
			var distanceForY = yDistance * easingAmount;

			player.xDistance = distanceForX;
			player.yDistance = distanceForY;

		});
	}
	var gameLoop = function() {
		gameTimeout = window.setTimeout(gameLoop, 10)
		drawScreen();
		if (enemies.length == 0) {
			clearTimeout(gameTimeout);
			level++;
			numberOfEnemies += Math.floor(numberOfEnemies*1.5);
			enemies = createEnemies(numberOfEnemies);
			startLevel();
		}
		else if (strikes <= 0) {
			alert("you suck balls bro");
			alert("giveee upp forever!!!!!");
			while (true) {
				alert("you can never winnnnn");
			}
		}     
	}
	var start = 3;
	var countdown = function() {
		surface.clearRect(0, 0, width, height);
		surface.fillStyle="black";
		surface.fillRect(0, 0, width, height);
		player.draw();
		surface.font = "50px Arial";
		surface.fillStyle="purple";
		surface.fillText("Starting level in " + start, width/2, height/2);
		start--;
		if (start == -1) {
			clearInterval(interval);
			gameLoop();
			start = 3;
		}

	}
	var startLevel = function() {
		interval = window.setInterval(countdown, 1000)

	}
	
	addKeyListener();
	drawScreen();
	startLevel();
}

