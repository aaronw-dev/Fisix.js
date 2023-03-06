var topRight;
var topLeft;
var bottomRight;
var bottomLeft;
//Document variable of the ball div element
var ball = document.getElementById("ball");

//Current velocities, not to be exposed to GUI
var velocityY = 0;
var velocityX = 0;

//Current position, not to be exposed to GUI
var positionY = 0;
var positionX = 50;

//Gravity amounts
var gravityY = 0.945;
var gravityX = 0.0;

//Ball's mass, used in calculating downwads velocity
var ballMass = 0.4;

//Spring settings
var strength = 0.1;
var damping = 0;
var targetY = 0;
var targetX = 50;

//Ball's bounce amount on contact
var bounce = 1;

//GUI variables
var isgrabbed = false;
var simulate = false;

//Canvas height variables
var canvasW;
var canvasH;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//Set initial position of ball
ball.style.top = targetY + "%";
ball.style.left = targetX + "%";

//Update every "frame" at 100 FPS
setInterval(Update, 10);
InitCanvas();
class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class CollisionLine {
  constructor(position1, position2) {
    this.position1 = position1;
    this.position2 = position2;

    ctx.beginPath();
    ctx.moveTo(position1.x, position1.y);
    ctx.lineTo(position2.x, position2.y);
    ctx.stroke()
  }
}
class FourPointShape {
  constructor(topLeft, topRight, bottomRight, bottomLeft, color) {
    this.topLeft = topLeft;
    this.topRight = topRight;
    this.bottomLeft = bottomLeft;
    this.bottomRight = bottomRight;
    this.color = color;

    var topLine = new CollisionLine(new Vector2(topLeft[0], topLeft[1]), new Vector2(topRight[0], topRight[1]))
    var rightLine = new CollisionLine(new Vector2(topRight[0], topRight[1]), new Vector2(bottomRight[0], bottomRight[1]))
    var bottomLine = new CollisionLine(new Vector2(bottomRight[0], bottomRight[1]), new Vector2(bottomLeft[0], bottomLeft[1]))
    var leftLine = new CollisionLine(new Vector2(bottomLeft[0], bottomLeft[1]), new Vector2(topLeft[0], topLeft[1]))
  }
}

var shape = new FourPointShape([0, 0], [300, 0], [300, 300], [0, 300]);

function InitCanvas() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  canvasW = canvas.width;
  canvasH = canvas.height;
  ctx.lineWidth = 2;
}

function Update() {
  TickGravity();
  TickCollision(shape);
  UpdateVisuals();
}

function TickGravity() {
  if (simulate) {
    velocityY -= gravityY * ballMass;
    velocityX -= gravityX * ballMass;
    positionY -= velocityY;
    positionX -= velocityX;
  }
}

function TickCollision(shape) {}

function UpdateVisuals() {
  ball.style.top = positionY + "px";
  ball.style.left = positionX + "px";
}

function SetZeroPosition() {
  velocityY = 0;
  velocityX = 0;
  positionY = 0;
  positionX = 50;
}

document.onclick = (e) => {
  velocityY = 0;
  velocityX = 0;
  positionY = e.y;
  positionX = e.x;
};

function LogOut(output, delay = 100) {
  let box = document.getElementById("output");
  var msg = document.createElement("div");
  msg.innerHTML = output;
  box.appendChild(msg);
  setTimeout(() => {
    box.removeChild(msg);
  }, delay);
}
