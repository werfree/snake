var canvas = document.getElementById("mycanvas");
score = 0;

// Check
web = true;
if (screen.width < 1500) {
  web = false;
}
if (web == true) {
  canvas.width = 800;
  canvas.height = 800;
  cellSize = 66;
} else {
  canvas.width = screen.width - 10;
  canvas.height = canvas.width * 1.3;
  cellSize = 35;
}

//Food

getFood = () => {
  var foodX = Math.round(
    (Math.random() * (canvas.width - cellSize)) / cellSize
  );
  var foodY = Math.round(
    (Math.random() * (canvas.height - cellSize)) / cellSize
  );

  var food = {
    x: foodX,
    y: foodY,
    color: "blue",
  };
  return food;
};

food = getFood();

// Game Code

gameOver = false;

init = () => {
  food_img = new Image();
  food_img.src = "apple.png";
  trophy = new Image();
  trophy.src = "trophy.png";

  pen = canvas.getContext("2d");
  pen.fillStyle = "red";

  snake = {
    iLength: 2,
    color: "red",
    cells: [],
    cellSize: 50,
    direction: "r",
    createSnake: function () {
      for (var i = this.iLength; i > 0; i--) {
        this.cells.push({ x: i, y: 0 });
      }
    },
    drawSnake: function () {
      for (var i = 0; i < this.cells.length; i++) {
        pen.fillStyle = this.color;

        pen.fillRect(
          this.cells[i].x * cellSize,
          this.cells[i].y * cellSize,
          cellSize - 2,
          cellSize - 2
        );
      }
    },

    updateSnake: function () {
      var headX = this.cells[0].x;
      var headY = this.cells[0].y;
      if (headX == food.x && headY == food.y) {
        food = getFood();
        score += 10;
      } else {
        this.cells.pop();
      }
      var nextX = 0,
        nextY = 0;

      if (this.direction == "r") {
        nextX = headX + 1;
        nextY = headY;
      } else if (this.direction == "l") {
        nextX = headX - 1;
        nextY = headY;
      } else if (this.direction == "d") {
        nextX = headX;
        nextY = headY + 1;
      } else if (this.direction == "u") {
        nextX = headX;
        nextY = headY - 1;
      }
      this.cells.unshift({ x: nextX, y: nextY });

      /*Game Over */
      var last_x = Math.round(canvas.width / cellSize);
      var last_y = Math.round(canvas.height / cellSize);

      if (
        this.cells[0].x < 0 ||
        this.cells[0].y < 0 ||
        this.cells[0].x > last_x ||
        this.cells[0].y > last_y
      ) {
        gameOver = true;
      }
    },
  };
  snake.createSnake();

  keyPressed = (e) => {
    if (e.key == "ArrowUp") {
      snake.direction = "u";
    } else if (e.key == "ArrowDown") {
      snake.direction = "d";
    } else if (e.key == "ArrowRight") {
      snake.direction = "r";
    } else if (e.key == "ArrowLeft") {
      snake.direction = "l";
    }
  };
  //Event Listner
  document.addEventListener("keydown", keyPressed);
};

draw = () => {
  pen.clearRect(0, 0, canvas.width, canvas.height);
  snake.drawSnake();
  pen.fillStyle = food.color;
  pen.drawImage(
    food_img,
    food.x * cellSize,
    food.y * cellSize,
    cellSize,
    cellSize
  );
  pen.drawImage(trophy, 18, 20, cellSize, cellSize);
  pen.font = "20px Roboto";
  pen.fillText(score, 45, 40);
};

update = () => {
  snake.updateSnake();
};
gameloop = () => {
  if (gameOver == true) {
    clearInterval(f);
    alert(`GameOver \n Your score:- ${score}`);
  }
  draw();
  update();
};

init();
var f = setInterval(gameloop, 100);
