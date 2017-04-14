/**
take hold of the gameCanvas and create the tool that willbe used to draw
on the canves
 */
var gameCanvas = document.getElementById("gameCanvas");
var brush = gameCanvas.getContext("2d");

brush.fillStyle = "#FF0000";

// Bricks information
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

// Storing Bricks inside a 2D array
var bricks = [];
for(var column = 0; column < brickColumnCount; column++) {
    bricks[column] = [];
    for(var row = 0; row < brickRowCount; row++) {
        bricks[column][row] = { x: 0, y: 0, status: 1};
    }
}

// player score
var score = 0;

// initial position
var x = gameCanvas.width / 2;
var y = gameCanvas.height - 30;

// the speed of the ball
var upSpeed = 1;
var downSpeed = -1;

// the radious of the ball
var radius = 20;
var secuirty = 5;


// ball default color
var defaultColor = "#0095DD";

// give the ball a default color
brush.fillStyle = defaultColor;

// paddle dimnations
var paddleWidth = 70;
var paddleHeight = 10;

// paddle itial position
var paddleXPosition = (gameCanvas.width - paddleWidth) / 2;

// control information
var rightPressed = false;
var leftPressed = false;

// how many lives you have before you get a game over
var lives = 3;


// add event listener ( Game Control )
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keyup", onkeyup);




// handling if ( <- or -> ) are hit
function onkeyup(e){
    if(e.keyCode == 32){
        alert("game paused");
    }
}

function keyDownHandler(e){
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e){
    if(e.keyCode == 39) {
        console.log(e.keyCode);
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

// playing using the mouse
function mouseMoveHandler(e)
{
    // current mouse position - left offset of the canves so that the mouse
    // position is relvant to the canves not the document AKA window
    var relativeX = e.clientX - gameCanvas.offsetLeft;
    if(relativeX > 0 && relativeX < gameCanvas.width) {
        paddleXPosition = relativeX - paddleWidth/2;
    }

}

// drawing the ball
var drawBall = function()
{
    brush.beginPath();
    brush.strokeStyle = "purple";
    brush.arc(x, y, radius, 0, 2 * Math.PI);
    brush.fill();
    brush.stroke();
    brush.closePath();
};




var bounceBall = function()
{
    if( (x - (radius / 2) - secuirty <= 0) || (x + (radius / 2) + secuirty >= gameCanvas.width))
    {
        upSpeed *= -1;
    }
    else if (y - (radius / 2) - secuirty <= 0 )
    {
        downSpeed *= -1;
    }
    else if (y + (radius / 2) + secuirty >= gameCanvas.height)
    {
        if(x > paddleXPosition - 7 && x < paddleXPosition + paddleWidth + 7)
        {
            downSpeed *= 1.1;
            upSpeed *= 1.1;
            downSpeed *= -1;
        }
        else
        {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = gameCanvas.width/2;
                y = gameCanvas.height-30;

                paddleXPosition = (gameCanvas.width-paddleWidth)/2;
            }
        }

    }
};

// draw paddle
var drawPaddle = function(){
    brush.beginPath();
    brush.rect(paddleXPosition, gameCanvas.height - 10, paddleWidth, paddleHeight);
    brush.fillStyle = "#0095DD";
    brush.fill();
    brush.closePath();
};

var movePaddle = function(){
    if(rightPressed && paddleXPosition < gameCanvas.width-paddleWidth) {
        paddleXPosition += 7;
    }
    else if(leftPressed && paddleXPosition > 0) {
        paddleXPosition -= 7;
    }
};

// making a log
function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
             if (bricks[c][r].status == 1)
             {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                brush.beginPath();
                brush.rect(brickX, brickY, brickWidth, brickHeight);
                brush.fillStyle = defaultColor;
                brush.fill();
                brush.closePath();
             }

        }
    }
}



function collisionDetection(){
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    yVelocity *= -1;
                    b.status = 0;
                    score++;

                    if (score == brickColumnCount * brickRowCount){
                        alert("You have won !!!");
                        document.location.reload();

                    }
                }
            }
        }
    }
}


var drawScore = function(){
    brush.font = "16px Arial";
    brush.fillStyle = "#0095DD";
    brush.fillText("Score: "+score, 8, 20);
};

var drawLives = function(){
    brush.font = "16 px Arial";
    brush.fillStyle = "#0095DD";
    brush.fillText("Lives: " + lives, gameCanvas.width-65, 20);
};



function draw()
{
    brush.clearRect(0, 0, gameCanvas.width, gameCanvas.height); 
    drawBall();
    changeSpeed();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();
    bounceBall();
    collisionDetection();
    movePaddle();
    get_random_color();
    
}

function changeSpeed(){
    x += upSpeed;
    y += downSpeed;
}

// start the game and bounce the ball
alert("Hit a Key to start playing");  
document.addEventListener('keydown', gameStart, false);

function gameStart(){
    setInterval(draw, 10);
    document.removeEventListener('keydown', gameStart, false);
}

setInterval(get_random_color, 50000);


function get_random_color()
{
  defaultColor = ['red','orange','yellow','green','blue','purple'][Math.random()*6|0];
}

