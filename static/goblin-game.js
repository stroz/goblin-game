window.onload = function() {

    // Create the canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 480;
    document.body.appendChild(canvas);

    // Background image
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function () {
	bgReady = true;
    };
    bgImage.src = "static/images/background.png";

    // Hero image
    var heroReady = false;
    var heroImage = new Image();
    heroImage.onload = function () {
	heroReady = true;
    };
    heroImage.src = "static/images/hero.png";

    // Monster image
    var monsterReady = false;
    var monsterImage = new Image();
    monsterImage.onload = function () {
	monsterReady = true;
    };
    monsterImage.src = "static/images/monster.png";

    // Game objects
    var hero = {
	speed: 512 //256, // movement in pixels per second
    };
    var monster = {};
    var monstersCaught = 0;

    // Handle keyboard controls
    var keysDown = {};

    addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
    }, false);

    // Reset the game when the player catches a monster
    var reset = function () {

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
    };

    // Update game objects
    var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
	    hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
	    hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
	    hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
	    hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
	    hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
	    ++monstersCaught;
	    reset();
	}
    };

    // Draw everything
    var render = function () {
	if (bgReady) {
	    ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
	    ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
	    ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);

	// Timer
	ctx.fillText(parseInt((timeLimit-timer)/1000), 452, 32);
    };

    // End Game
    var endGame = function() {
	// Cancel the animation
	cancelAnimationFrame(requestId);

	// Draw bg, high scores, and play again
	ctx.drawImage(bgImage, 0, 0);
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
	ctx.fillText("click to play again", 160, 210);

	// Add click listener to restart game
	canvas.addEventListener('click', function(e) {
	    startGame();
	}, false);
    };

    // The main game loop
    var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestId = requestAnimationFrame(main);

	timer += delta;
	if (timer >= timeLimit) {
	    endGame();
	}
    };

    var initGameVariables = function() {
	timer = 0;
	timeLimit = 60*1000; // Set time limit to 30 seconds (30 milliseconds * 1000)
	monstersCaught = 0;
	hero.x = (canvas.width/2)-16;
	hero.y = (canvas.height/2)-16;
    };

    var startGame = function() {
	// Initalize game variables
	initGameVariables();

	// Let's play this game!
	then = Date.now();
	reset();
	main();
    };

    // Cross-browser support for requestAnimationFrame
    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    var then;
    var timer;
    var timeLimit;
    var requestId;
    startGame();
};