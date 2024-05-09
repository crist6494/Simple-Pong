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


//Cambiar
const paddleWidth = 0.01 * getWidth();
const paddleHeight =  0.16 * getHeight();
const paddle2x = getWidth() - (0.05 * getWidth()) - paddleWidth;

class Pong
{
    constructor()
    {
        this.canvas = document.getElementById("canvas");
        this.canvas.width = getWidth();
        this.canvas.height= getHeight();

        this.ctx = canvas.getContext("2d"); // the rederezing context

        this.paddleHeight = (getHeight()) / 2;

        this.ball = new Ball();
        this.paddle1 = new Paddle(vec2(getWidth() * 0.05, 0.5 * getHeight() - (paddleHeight / 2)), paddleWidth, paddleHeight);
        this.paddle2 = new Paddle(vec2(paddle2x, 0.5 * getHeight() - (paddleHeight / 2)), paddleWidth, paddleHeight);
        this.keysPressed = new Map();
    }

    drawFieldLines() {
        const fieldWidth = canvas.width - 100; // Ancho del campo
        const fieldHeight = canvas.height - 100; // Alto del campo
        const margin = 50; // Tamaño del margen
        const lineWidth = 3; // Grosor de las líneas
        const dashLength = 30; // Longitud de las líneas discontinuas
    
        // Dibujar líneas continuas en los bordes del campo
        this.ctx.strokeStyle = "white"; // Color de las líneas
        this.ctx.lineWidth = lineWidth; // Grosor de las líneas
    
        // // Línea superior
        // this.ctx.beginPath();
        // this.ctx.moveTo(margin, margin);
        // this.ctx.lineTo(margin + fieldWidth, margin);
        // this.ctx.stroke();
    
        // // Línea inferior
        // this.ctx.beginPath();
        // this.ctx.moveTo(margin, margin + fieldHeight);
        // this.ctx.lineTo(margin + fieldWidth, margin + fieldHeight);
        // this.ctx.stroke();
    
        // // Línea izquierda
        // this.ctx.beginPath();
        // this.ctx.moveTo(margin, margin);
        // this.ctx.lineTo(margin, margin + fieldHeight);
        // this.ctx.stroke();
    
        // // Línea derecha
        // this.ctx.beginPath();
        // this.ctx.moveTo(margin + fieldWidth, margin);
        // this.ctx.lineTo(margin + fieldWidth, margin + fieldHeight);
        // this.ctx.stroke();
        // Dibujar líneas discontinuas en el medio del campo
        this.ctx.setLineDash([dashLength, dashLength]); // Establecer el patrón de línea discontinua
    
        // Línea vertical en el centro del campo
        this.ctx.beginPath();
        this.ctx.moveTo(margin + fieldWidth / 2, 0);
        this.ctx.lineTo(margin + fieldWidth / 2, this.canvas.height);
        this.ctx.stroke();
    
        // Restaurar el patrón de línea a continuo
        this.ctx.setLineDash([]);
    }

    gameLoop()
    {
        //() => this.gameLoop() arrow function call the function
        window.requestAnimationFrame(() => this.gameLoop()); //Call the (function) befeore the next repaitn of the browser 60 times per second
        let currenTime = performance.now();
        const deltaTime = (currenTime - this.time) / 1000;
        currenTime = this.time;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //Restart the select pixels => coords(x,y) and size(width, height)
        //ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        //ctx.fillRect(0, 0, canvas.width, canvas.height);

        gameUpdate(this.ball, this.paddle1, this.paddle2, deltaTime);
        gameDraw(this.ball, this.paddle1, this.paddle2);
    }
};

function gameUpdate(ball, paddle1, paddle2, deltaTime)
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
        
    upScore(ball, paddle1, paddle2)
}

function gameDraw(ball, paddle1, paddle2)
{
    pong.drawFieldLines();
    ball.render();
    paddle1.render();
    paddle2.render();
}

function resize(paddle)
{
    pong.canvas.width = window.innerWidth;
    pong.canvas.height = window.innerHeight;
}


window.addEventListener("keydown", function(e){
    pong.keysPressed.set(e.keyCode, true);
})

window.addEventListener("keyup", function(e){
    pong.keysPressed.set(e.keyCode, false);
})

window.addEventListener("resize",resize)


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