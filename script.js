var massPoints = [];
var collisionPolys = [];
var numbballs = 0;
var simulate = false;
var lastTick = new Date();

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
    constructor(positionX, positionY, bounce, friction, mass) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.mass = mass;
        this.bounce = bounce;
        this.friction = friction;
        this.velocityY = 0;
        this.velocityX = 0;
        this.spring;

        let visual = document.createElement('div');
        visual.className = "point";
        document.getElementById("masspoints").appendChild(visual);
        visual.style.top = positionY + "px";
        visual.style.left = positionX + "px";

        this.visual = visual;
        massPoints.push(this);
    }
}
class Spring {
    constructor(massPointA, massPointB, restLength, stiffness = 1, dampingFactor = 1) {
        this.massPointA = massPointA;
        this.massPointB = massPointB;
        this.restLength = restLength;
        this.stiffness = stiffness;
        this.dampingFactor = dampingFactor;
    }
}
class Polygon {
    constructor(points) {
        this.points = points;
        collisionPolys.push(this);
    }
}
function InitMassPoint(positionX, positionY, bounce = 1, friction = 1, mass = 1) {
    numbballs++;
    document.getElementById("ballcount").innerHTML = "Balls: " + numbballs;
    return new MassPoint(positionX, positionY, bounce, friction, mass);
}

function InitPolygon(points, width = 2) {
    new Polygon(points);
    DrawPolygon(points, width);
}
function DisplayMassPoints() {
    for (let i = 0; i < massPoints.length; i++) {
        massPoints[i].visual.style.top = massPoints[i].positionY + "px";
        massPoints[i].visual.style.left = massPoints[i].positionX + "px";
    }

    linectx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < massPoints.length - 1; i++){
      DrawLine([[massPoints[i].positionX, massPoints[i].positionY], [massPoints[i + 1].positionX, massPoints[i + 1].positionY]], 2, "black");
    }
}
function TickFPS(){
  var thisTick = new Date();
  var fps = 10000 / (thisTick - lastTick)
  fps = Math.round(fps)
  lastTick = thisTick
  document.getElementById("fpscount").innerHTML = fps + "fps"
}
function TickGravity() {
    if(!simulate){
      return;
    }
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
            [closestPoint, closestSegment] = get_closest_border_point_to([massPoints[i].positionX, massPoints[i].positionY],collisionPolys[0].points)
            var dx = closestSegment[1][0] - closestSegment[0][0]
            var dy = closestSegment[1][1] - closestSegment[0][1]
            var segmentDistance = dist(closestSegment[0],closestSegment[1])
            var segmentNormal = [-dy / segmentDistance, dx / segmentDistance]
            var scaleFactor = 1
            segmentNormal = [segmentNormal[0] * scaleFactor, segmentNormal[1] * scaleFactor]
            //console.log(segmentNormal)
            var newVelocity = reflect([massPoints[i].velocityX, massPoints[i].velocityY],segmentNormal);
            massPoints[i].velocityX = newVelocity[1] * massPoints[i].friction;
            console.log(newVelocity[1])
            massPoints[i].velocityY = newVelocity[1] * massPoints[i].bounce;
            var newPositionY = closestPoint[1];
            massPoints[i].positionY = newPositionY;
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
function reflect(vector,normalVector){
  /* Reflection in a nutshell:
  w = v - 2 * (v * n) * n
  
  where:
  w = reflected vector
  v = vector to reflect
  n = normal to reflect off of
  */
  
  //(v * n)
  //Multiply the vector by the normal vector
  var vectoredNormal = [vector[0] * normalVector[0], vector[1] * normalVector[1]];
  //2 * (v * n)
  //Multiply the vector normal by 2
  var negativeVectored = [vectoredNormal[0] * 2, vectoredNormal[1] * 2];
  //2 * (v * n ) * n
  // Multiply that whole shebang by the normal vector
  var normalNegative = [negativeVectored[0] * normalVector[0], negativeVectored[1] * normalVector[1]];
  //v - 2 * (v * n) * n
  //Subtract the negative normal from the original reflection vector
  var reflectedVector = [vector[0] - normalNegative[0], vector[1] - normalNegative[1]];
  return reflectedVector;
}
function dot(u,v){
  return ((u)[0] * (v)[0] + (u)[1] * (v)[1]);
}
function norm(v){
  return Math.sqrt(dot(v,v));
}
function dist(u,v){
  return norm([u[0] - v[0], u[1] - v[1]]);
}
function closestPointInSegment(point, segment){
  v = [segment[1][0] -  segment[0][0], segment[1][1] - segment[0][1]];
  w = [point[0] - segment[0][0], [point[1] - segment[0][1]]];
  c1 = dot(w,v);
  if ( c1 <= 0 )   // the closest point is outside the segment and nearer to P0
    return segment[0];

  c2 = dot(v,v);
  if ( c2 <= c1 )  // the closest point is outside the segment and nearer to P1
    return segment[1];
  b = c1 / c2;
  Pb = [segment[0][0] + (b * v[0]),segment[0][1] + (b * v[1])]
  return Pb;
}
function get_closest_border_point_to(point, poly) {
    var bestDistance = 1000000;
    var bestSegment;
    var bestPoint;

    for(let i = 0; i < poly.length - 1; i++){
      var s = [poly[i],poly[i + 1]];
      var closestInS = closestPointInSegment(point, s);
      var d = dist(point, closestInS);
      if (d < bestDistance) {
        bestDistance = d;
        bestSegment = s;
        bestPoint = closestInS;
      }
    }
    return [bestPoint,bestSegment];
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

for(let row = 0; row < 5; row++){
  for(let column = 1; column < 6; column++){
    let point = InitMassPoint(positionX = column * 20, positionY = row * 20, bounce = 0.2, friction = -0.6);
    point.visual.style.backgroundColor = "black"
  }
}
//var spring = new Spring(mp1, mp2, 100, 10, 10);
InitPolygon([
  [0, canvas.height - 200], [canvas.width, canvas.height - 2],
  [canvas.width, canvas.height + 200], [0, canvas.height + 200],
]);

setInterval(TickGravity, 10);
setInterval(TickFPS,100);
document.onclick = (e) =>{
  InitMassPoint(e.x,e.y,0.3,friction=-0.6);
};

onkeypress = ('space', (e)=>{
  simulate = !simulate;
});
/*
onkeypress = ('w', (e)=>{
  for(let i = 0; i < massPoints.length; i++){
    massPoints.velocityY += 10
  }
})*/