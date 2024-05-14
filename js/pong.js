"use strict"
//import {ballCollisionEdges, paddleCollisionEdges, ballPaddleCollision} from "./collision.js"

const KEY_UP = 38;
const KEY_DOWN = 40;

const KEY_W = 87;
const KEY_S = 83; 

function getWidth()
{
    return window.innerWidth
}

function getHeight()
{
    return window.innerHeight
}


class Pong
{
    constructor()
    {
        this.canvas = document.getElementById("canvas");
        this.canvas.width = getWidth();
        this.canvas.height= getHeight();

        this.margin = 42;
        this.pitchWidth = this.canvas.width - this.margin * 2;
        this.pitchHeight = this.canvas.height - this.margin * 2;

        this.ctx = canvas.getContext("2d"); // the rederezing context

        this.ball = new Ball();
        this.createPaddles();
        this.keysPressed = new Map();
    }
    
    createPaddles()
    {
        const paddleWidth = 0.0085* getWidth();
        const paddleHeight = 0.15 * getHeight();
    
        const paddle2x = this.pitchWidth - (0.008 * this.pitchWidth) - paddleWidth;
        const centerY = 0.5 * this.canvas.height - (paddleHeight / 2);


        this.paddle1 = new Paddle(vec2(this.pitchWidth * 0.008 + this.margin * 2, centerY), paddleWidth, paddleHeight);
        this.paddle2 = new Paddle(vec2(paddle2x, centerY), paddleWidth, paddleHeight);
    }

    drawFieldLines() {
       
        this.lineWidth = 4;
        const dashLength = 25; //height discontinued line
    
        this.ctx.strokeStyle = "magenta"; // Line color
        this.ctx.lineWidth = this.lineWidth; // Width line
    
        // Top line
        this.ctx.beginPath();
        this.ctx.moveTo(this.margin - this.lineWidth / 2, this.margin);
        this.ctx.lineTo(this.margin + this.pitchWidth + this.lineWidth / 2, this.margin);
        this.ctx.stroke();
        // Bottom line
        this.ctx.beginPath();
        this.ctx.moveTo(this.margin - this.lineWidth / 2, this.margin + this.pitchHeight);
        this.ctx.lineTo(this.margin + this.pitchWidth + this.lineWidth / 2, this.margin + this.pitchHeight );
        this.ctx.stroke();
    
        // Left line
        this.ctx.beginPath();
        this.ctx.moveTo(this.margin, this.margin);
        this.ctx.lineTo(this.margin, this.margin + this.pitchHeight);
        this.ctx.stroke();
    
        // Right line
        this.ctx.beginPath();
        this.ctx.moveTo(this.margin + this.pitchWidth, this.margin);
        this.ctx.lineTo(this.margin + this.pitchWidth, this.margin + this.pitchHeight);
        this.ctx.stroke();

        // Draw discontinued line in the mid fields
        this.ctx.setLineDash([dashLength, dashLength]); // Establecer el patrón de línea discontinua
        this.ctx.strokeStyle = "white"; // Line color
        // Vertical line field
        this.ctx.beginPath();
        this.ctx.moveTo(this.margin + this.pitchWidth / 2, this.margin + this.lineWidth);
        this.ctx.lineTo(this.margin + this.pitchWidth / 2, this.margin + this.pitchHeight - this.lineWidth);
        this.ctx.stroke();
    
        // Restart continuous pattern
        this.ctx.setLineDash([]);
    }

    resize() {

        this.canvas.width = getWidth();
        this.canvas.height = getHeight();
        this.pitchWidth = this.canvas.width - this.margin * 2;
        this.pitchHeight = this.canvas.height - this.margin * 2;
        this.ball.radius = 0.006 * getWidth(); //Sie ball
        this.createPaddles(); //Size Paddles
    }

    gameLoop()
    {
        //() => this.gameLoop() arrow function call the function
        window.requestAnimationFrame(() => this.gameLoop()); //Call the (function) befeore the next repaitn of the browser 60 times per second
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //Restart the select pixels => coords(x,y) and size(width, height)
        //ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        //ctx.fillRect(0, 0, canvas.width, canvas.height);

        gameUpdate(this.ball, this.paddle1, this.paddle2);
        gameDraw(this.ball, this.paddle1, this.paddle2);
    }
};



function gameUpdate(ball, paddle1, paddle2)
{
    ball.move()
    move2(paddle1);
    //move(paddle2);
    player2IA(paddle2,ball)

    ballCollisionEdges(ball);
    paddleCollisionEdges(paddle1);
    paddleCollisionEdges(paddle2);
    ballPaddleCollision(ball, paddle1);
    ballPaddleCollision(ball, paddle2);
    //swplayer2IA(paddle2, ball);
        
}

function gameDraw(ball, paddle1, paddle2)
{
    pong.drawFieldLines();
    ball.render();
    paddle1.render();
    paddle2.render();
    upScore(ball, paddle1, paddle2)
}



window.addEventListener("keydown", function(e){
    pong.keysPressed.set(e.keyCode, true);
})

window.addEventListener("keyup", function(e){
    pong.keysPressed.set(e.keyCode, false);
})

window.addEventListener("resize",() => pong.resize())


const move = function (paddle) {
    if(pong.keysPressed.get(KEY_UP))
        paddle.moveUp();

    if(pong.keysPressed.get(KEY_DOWN))
        paddle.moveDown();
};

const move2 = function (paddle) {
    if(pong.keysPressed.get(KEY_W))
        paddle.moveUp();

    if(pong.keysPressed.get(KEY_S))
        paddle.moveDown();

};


function player2IA(paddle, ball)
{
    let centerY = paddle.pos.y + (paddle.height / 2);
    if(ball.velocity.x > 0)
    {
        if(ball.pos.y > centerY)
        {
            paddle.moveDown();
            //paddle.pos.y += paddle.velocity.y;
            if(paddle.pos.y + paddle.height >= canvas.height)
                paddle.pos.y = canvas.height - paddle.height;
        }

        if(ball.pos.y < centerY)
        {
            paddle.moveUp();
            if(paddle.pos.y <= 0)
                paddle.pos.y = 0;
        }
    }
} 




//Start game
const pong = new Pong();
pong.gameLoop();