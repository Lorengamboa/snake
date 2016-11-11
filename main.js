/**
 *@Author: Lorenzo Gamboa García
 *@Desc: Simple snake javascript game
 *@License: You can use it but it would be awesome if you make a reference to my repo
 */

(function() {
    'use strict';

    //Global scope variables
    const canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d');

    const HEIGHT = canvas.width,
          WIDTH = canvas.height;
    const KEY_ENTER = 13,
          KEY_LEFT = 37,
          KEY_BOTTOM = 38,
          KEY_RIGHT = 39,
          KEY_TOP = 40;

    var gameSpeed = 5;
    var tail = [];
    var score = 0;
    var hscore = 0;
    var image = new Image();

    image.src = "img/apple.png";


    function run() {
        snakeEating(snake, apple);
        snake.move();
        snake.checkCollision();
        ctx.clearRect(0, 0, HEIGHT, WIDTH);
        apple.draw();
        snake.draw();
        drawScore();

    };

    function drawScore(){
      ctx.fillText("Score : "+score, 0, HEIGHT);
      ctx.fillText("Highest score : "+hscore, 0, 10);
    }
    /*Snake body part class*/
    function Square(x, y) {
        this.x = x;
        this.y = y;
        this.back = null;

        this.draw = () => {
            ctx.beginPath();
            ctx.rect(this.x, this.y, 10, 10);
            ctx.strokeStyle = "blue";
            ctx.stroke();
            if (this.hasBack()) {
                this.back.draw();
            }
        }
        this.add = () => {
            if (this.hasBack()) return this.back.add();
            this.back = new Square(this.x, this.y);
            tail.push(this.back);
        }
        this.hasBack = () => {
            return this.back !== null
        }
        this.copy = () => {
            if (this.hasBack()) {
                this.back.copy();
                this.back.x = this.x;
                this.back.y = this.y;
            }
        }
        this.right = () => {
            this.copy();
            this.x += 10;
            if (this.x >= 500) this.x = 0;
        }
        this.left = () => {
            this.copy();
            this.x -= 10;
            if (this.x < 0) this.x = 490;
        }
        this.top = () => {
            this.copy();
            this.y += 10;
            if (this.y >= 500) this.y = 0;
        }
        this.bottom = () => {
            this.copy();
            this.y -= 10;
            if (this.y < 0) this.y = 490;
        }
    }

    /*Snake class*/
    function Snake() {
        this.head = new Square(100, 0);
        this.direction = "right";

        this.right = () => {
            this.direction = "right";
        }
        this.left = () => {
            this.direction = "left";
        }
        this.top = () => {
            this.direction = "top";
        }
        this.bottom = () => {
            this.direction = "bottom";
        }
        this.draw = () => {
            this.head.draw();
        }
        this.move = () => {
            if (this.direction === "top") return this.head.top();
            if (this.direction === "bottom") return this.head.bottom();
            if (this.direction === "left") return this.head.left();
            if (this.direction === "right") return this.head.right();
        }
        this.checkCollision = () => {
          for(var x=0 ; x < tail.length ; x++){
            if(tail[x].x == this.head.x && tail[x].y == this.head.y){
              tail = [];
              gameSpeed = 5;
              score = 0;
              this.head.back = null;
              clearInterval(game);
              return game = setInterval(run, 1000 / gameSpeed);
            }
          }
        }
    }

    /* Generates random Food */
    class randomFood {
        constructor() {
            this.x;
            this.y;
            this.food = false;
            this.newFood();
        }

        hasBeenEaten() {
            if (!this.food) this.newFood();
        }

        newFood() {
            this.food = true;
            this.x = Math.floor(Math.random() * 50) * 10;
            this.y = Math.floor(Math.random() * 50) * 10;
        }

        draw() {
            ctx.drawImage(image, this.x, this.y, 10, 10);
        }
    }

    /**
     *@param snake
     *@param apple
     *@desc checks if snake is eating apple
     *@returns boolean value
     */
    function snakeEating(snake, apple) {
        if (snake.head.x == apple.x && snake.head.y == apple.y) {
            apple.food = false;
            gameSpeed += 2;
            score +=1;
            if(score > hscore) hscore = score;
            apple.hasBeenEaten();
            snake.head.add();
            clearInterval(game);
            game = setInterval(run, 1000 / gameSpeed);
        }
    }

    const snake = new Snake();
    const apple = new randomFood();

    var game = setInterval(run, 1000 / gameSpeed);

    window.addEventListener('keydown', function(evt) {
        if(evt.keyCode > 36 && evt.keyCode < 41) evt.preventDefault();
        if (evt.keyCode === KEY_LEFT) return snake.left();
        if (evt.keyCode === KEY_RIGHT) return snake.right();
        if (evt.keyCode === KEY_BOTTOM) return snake.bottom();
        if (evt.keyCode === KEY_TOP) return snake.top();
    });


    window.requestAnimationFrame = (function() {
        return window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 17);
            };
    }());

})();
