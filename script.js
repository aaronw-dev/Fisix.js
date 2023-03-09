var massPoints = [];
var collisionPolys = [];
var springs = [];
numbballs = 0

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const linecanvas = document.getElementById("linecanvas");
const linectx = linecanvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
linectx.canvas.width = window.innerWidth;
linectx.canvas.height = window.innerHeight;

var gravity = [0, -0.1];

class MassPoint {
    constructor(positionX, positionY, bounce, mass) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.mass = mass;
        this.bounce = bounce;
        this.velocityY = 0;
        this.velocityX = 0;

        let visual = document.createElement('div');
        visual.className = "point";
        document.getElementById("masspoints").appendChild(visual);
        visual.style.top = positionY + "px";
        visual.style.left = positionX + "px";

        this.visual = visual;
        massPoints.push(this)
    }
}
class Spring {
    constructor(massPointA, massPointB, restLength, stiffness = 1, dampingFactor = 1) {
        this.massPointA = massPointA;
        this.massPointB = massPointB;
        this.restLength = restLength;
        this.stiffness = stiffness;
        this.dampingFactor = dampingFactor;
        springs.push(this)
    }
}
class Polygon {
    constructor(points) {
        this.points = points;
        collisionPolys.push(this)
    }
}
function InitMassPoint(positionX, positionY, bounce = 1, mass = 1) {
    numbballs++
    document.getElementById("ballcount").innerHTML = "Balls: " + numbballs
    return new MassPoint(positionX, positionY, bounce, mass);
}

function InitPolygon(points, width = 2) {
    new Polygon(points)
    DrawPolygon(points, width);
}
function DisplayMassPoints() {
    for (let i = 0; i < massPoints.length; i++) {
        massPoints[i].visual.style.top = massPoints[i].positionY + "px";
        massPoints[i].visual.style.left = massPoints[i].positionX + "px";
    }

    linectx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < massPoints.length - 1; i++){
      DrawLine([[massPoints[i].positionX, massPoints[i].positionY], [massPoints[i + 1].positionX, massPoints[i + 1].positionY]], 3, "#FF0000")
    }
}

function TickGravity() {
    for (let i = 0; i < massPoints.length; i++) {
        var point = massPoints[i];
        var force = [0, 0];
        force[0] += gravity[0] * point.mass;
        force[1] += gravity[1] * point.mass;
        var velocity = [point.velocityX, point.velocityY];
        velocity[0] += force[0] / point.mass;
        velocity[1] += force[1] / point.mass;

        massPoints[i].velocityX = velocity[0];
        massPoints[i].velocityY = velocity[1];

        massPoints[i].positionX -= massPoints[i].velocityX;
        massPoints[i].positionY -= massPoints[i].velocityY;
        var isIntersecting = pointInPolygon(collisionPolys[0].points, [massPoints[i].positionX, massPoints[i].positionY]);
        if (isIntersecting) {

            massPoints[i].velocityY = -massPoints[i].velocityY * point.bounce;
            massPoints[i].positionY = collisionPolys[0].points[0][1];
        }
        DisplayMassPoints();
    }
}

function DrawPolygon(points, width = 1, color = "#000000") {
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
}

function DrawLine(points, width = 1, color = "#000000") {
    linectx.lineWidth = width;
    linectx.beginPath();
    linectx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        linectx.lineTo(points[i][0], points[i][1]);
    }
    linectx.strokeStyle = color;
    linectx.stroke();
}

/**
 * Performs the even-odd-rule Algorithm (a raycasting algorithm) to find out whether a point is in a given polygon.
 * This runs in O(n) where n is the number of edges of the polygon.
 */
const pointInPolygon = function (polygon, point) {
    //A point is in a polygon if a line from the point to infinity crosses the polygon an odd number of times
    let odd = false;
    //For each edge (In this case for each point of the polygon and the previous one)
    for (let i = 0, j = polygon.length - 1; i < polygon.length; i++) {
        //If a line from the point into infinity crosses this edge
        if (((polygon[i][1] > point[1]) !== (polygon[j][1] > point[1])) // One point needs to be above, one below our y coordinate
            // ...and the edge doesn't cross our Y corrdinate before our x coordinate (but between our x coordinate and infinity)
            && (point[0] < ((polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1]) / (polygon[j][1] - polygon[i][1]) + polygon[i][0]))) {
            // Invert odd
            odd = !odd;
        }
        j = i;

    }
    //If the number of crossings was odd, the point is in the polygon
    return odd;
};

//InitMassPoint(positionX = 70, positionY = 0, bounce = 0.2);
//InitMassPoint(positionX = 120, positionY = 0, bounce = 0.35);
for(let row = 0; row < 5; row++){
  for(let column = 1; column < 6; column++){
    InitMassPoint(positionX = column * 20, positionY = row * 20, bounce = 0.3);
  }
}
//var spring = new Spring(mp1, mp2, 100, 10, 10);
InitPolygon([[0, canvas.height - 10], [canvas.width, canvas.height - 10], [canvas.width, canvas.height + 100], [0, canvas.height + 100]]);

setInterval(TickGravity, 10);
document.onclick = (e) =>{
  InitMassPoint(e.x,e.y,1)
}