var engine = function() {

	var canvas = document.getElementById("canvas");
	var surface = canvas.getContext("2d");
	var width = surface.canvas.width = window.innerWidth;
	var height = surface.canvas.height = window.innerHeight;
	var player = newPlayer();
	var enemies = createEnemies(10);
	var powerUps = [];

	var drawScreen = function() {
		surface.clearRect(0, 0, width, height);
		surface.fillStyle = "black";
		surface.fillRect(0, 0, width, height);   
		drawPlayer();
		drawEnemies();
		drawPowerUps();
	}
	var drawEnemies = function() {
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
			var position = selectRandomPosition();


			if (position == "left") {
				newEnem.x = 0;
				newEnem.y = randomEnemyY(height);
				newEnem.xDistance = randomEnemyX(75) * 0.05;
				newEnem.yDistance = randomEnemyX(75) * 0.05;
			}
			else if (position == "right") {
				newEnem.x = width;
				newEnem.y = randomEnemyY(height);
				newEnem.xDistance = randomEnemyX(75) * -0.05;
				newEnem.yDistance = randomEnemyX(75) * -0.05;
			}
			else if (position == "top") {
				newEnem.x = randomEnemyX(width);
				newEnem.y = 0;
				newEnem.xDistance = randomEnemyX(75) * 0.05;
				newEnem.yDistance = randomEnemyX(75) * 0.05;
			}
			else {
				newEnem.x = randomEnemyX(width);
				newEnem.y = height;
				newEnem.xDistance = randomEnemyX(75) * -0.05;
				newEnem.yDistance = randomEnemyX(75) * -0.05;
			}

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
					this.x = width;
				else if (this.x > width)
					this.x = 0;
				if (this.y < 0)
					this.y = height;
				else if (this.y > height)
					this.y = 0;

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

				if (this.x < 0 || this.x > width || this.y < 0 || this.y > height)
					removePlayerBullet(this);

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
				this.x += (this.xDistance * this.speed);
				this.y += (this.yDistance * this.speed);
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
		window.setTimeout(gameLoop, 10);
		drawScreen();
	}
	
	addKeyListener();
	gameLoop();
}

