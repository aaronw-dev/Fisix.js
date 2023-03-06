import {FourPointShape} from "collidershape.js";

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

//Set initial position of ball
ball.style.top = targetY + "%";
ball.style.left = targetX + "%";

//Update every "frame" at 100 FPS
setInterval(Update, 10);

var shape = new FourPointShape([0,0],[100,0],[100,100],[0,100]);
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

function TickCollision(shape) {
  if(positionX < shape.topRight[0] || positionX > shape.topLeft){
    console.log("True");
  }
}

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