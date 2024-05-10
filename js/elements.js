//Return a objet (x,y)
function vec2(x, y)
{
    return {x: x, y: y};
}

//Class for ball
class Ball 
{
    constructor()
    {
        this.pos = {x: getWidth() / 2, y: getHeight() / 2};
        this.velocity = {x: 4,  y: 0};
        this.radius = 0.006 * getWidth();
        this.maxAngle = 55;
        this.speed = 5;
        this.deltaTime = 0;
    }

    move()
    {
        // Mover la bola basada en la velocidad y el deltaTime actual
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
    };

    render()
    {
        pong.ctx.beginPath();
        pong.ctx.fillStyle = "#33ff00";
        pong.ctx.strokeStyle = "#33ff00";
        pong.ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        pong.ctx.fill();
        pong.ctx.stroke();
    };

    respawnBall()
    {
        this.pos.x = getWidth() / 2;
        this.pos.y = getHeight() / 2;
        this.reset_velocity = {x: 4,  y: 0};
        this.velocity.x = this.reset_velocity.x;
        this.velocity.y = this.reset_velocity.y;
        this.speed = 5;
    }
}


//Class for the paddles
class Paddle
{
    constructor(pos, width, height)
    {
        this.score = 0;
        this.pos = pos; //vec2
        this.velocity = {x: 0, y: 6}; //vec2
        this.width = width;
        this.height = height;
        this.speed = 5;

    }

    render()
    {
        pong.ctx.fillStyle = "#33ff00";
        pong.ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    };

    getHalfWidth ()
    {
        return this.width / 2;
    }

    getHalfHeight ()
    {
        return this.height / 2;
    }

    getCenterPaddle ()
    {
        return vec2(this.pos.x + this.getHalfWidth(), this.pos.y + this.getHalfHeight())
    }

    moveUp ()
    {
        if(this.pos.y > 0)
            this.pos.y -= this.velocity.y;
    }

    moveDown ()
    {
        if(this.pos.y + this.height < canvas.height)
            this.pos.y += this.velocity.y;
    }

    reset()
    {
        this.score = 0;
        this.pos = pos; //vec2
        this.velocity = {x: 0, y: 6}; //vec2
        this.width = width;
        this.height = height;
        this.speed = 5;
    }
}

function ballCollisionEdges(ball)
{
    const bottom = ball.pos.y + ball.radius;
    const top = ball.pos.y - ball.radius;
    //const left = ball.pos.x - ball.radius;
    //const right = ball.pos.x + ball.radius;
    if((bottom > canvas.height && ball.velocity.y > 0) || (top < 0 && ball.velocity.y < 0))
        ball.velocity.y *= -1;

    /* if(right >= canvas.width /*|| left <= 0)
        ball.velocity.x *= -1; */
}

function paddleCollisionEdges(paddle)
{
    //Top
    if(paddle.pos.y <= 0)
        paddle.pos.y = 0;

    //Bottom
    if(paddle.pos.y + paddle.height >= canvas.height)
        paddle.pos.y = canvas.height - paddle.height;
}

function gradeToRadians(angle)
{
    return angle * (Math.PI / 180);
}

function paddleBouncedBall(ball, paddle, sign)
{
    let dy = ball.pos.y - paddle.getCenterPaddle().y; //Difference .y ball .y paddleCenter to know direction
    let angle = (ball.maxAngle * dy) / (paddle.height / 2); //Divide paddleHEight normalize the result to = [-1, 0, 1]
    angle = gradeToRadians(angle);
    if(sign === -1)
        ball.velocity.x = -Math.abs(ball.speed * Math.cos(angle));
    else
        ball.velocity.x = Math.abs(ball.speed * Math.cos(angle));
    ball.velocity.y = ball.speed * Math.sin(angle); 
    if(ball.speed < 12)
        ball.speed += 0.4;
}

function ballPaddleCollision(ball, paddle)
{
    if (ball.pos.x - ball.radius <= paddle.pos.x + paddle.width && // Edge rigth, left paddle <===> left ball side
        ball.pos.x - ball.radius >= paddle.pos.x && // Edge left, left paddle <===> left ball side (*corner*)
        ball.pos.y + ball.radius >= paddle.pos.y && // Edge top ,left paddle <===> bottom side ball
        ball.pos.y - ball.radius <= paddle.pos.y + paddle.height &&  // Edge top ,left paddle <===> bottom side ball
        ball.velocity.x < 0) //Checked left paddle
    {
        paddleBouncedBall(ball, paddle, 1)
    }
    
    if (ball.pos.x + ball.radius <= paddle.pos.x + paddle.width && //Edge rigth, right paddle <===> right ball side (*corner*)
        ball.pos.x + ball.radius >= paddle.pos.x && // Edge left, right paddle <===> right ball side (*corner*)
        ball.pos.y + ball.radius >= paddle.pos.y && // Edge top ,right paddle <===> bottom side ball
        ball.pos.y - ball.radius <= paddle.pos.y + paddle.height && // Edge top ,left paddle <===> bottom side ball
        ball.velocity.x > 0) //Checked right paddle
    {
        paddleBouncedBall(ball, paddle, -1)
    }
}


function upScore(ball, paddle1, paddle2)
{
    if(ball.pos.x <= -ball.radius)
    {
        paddle2.score++;
        document.querySelector(".player2--score").innerHTML = paddle2.score; //Modified the HTML content
        ball.respawnBall();
        ball.velocity.x = -Math.abs(ball.velocity.x);
    }

    if(ball.pos.x >= canvas.width + ball.radius)
    {
        paddle1.score++;
        document.querySelector(".player1--score").innerHTML = paddle1.score; //Modified the HTML content
        ball.respawnBall();
        ball.velocity.x = Math.abs(ball.velocity.x);
    }
}
