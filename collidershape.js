export class FourPointShape {
    constructor(topLeft, topRight, bottomRight, bottomLeft, color) {
        this.topLeft = topLeft;
        this.topRight = topRight;
        this.bottomLeft = bottomLeft;
        this.bottomRight = bottomRight;
        this.color = color;

        var svg = document.getElementById("svg");
        var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        polygon.style.fill = color
        svg.appendChild(polygon);

        var array = [topLeft, topRight, bottomRight, bottomLeft];

        for (let value of array) {
            var point = svg.createSVGPoint();
            point.x = value[0];
            point.y = value[1];
            polygon.points.appendItem(point);
        }
    }
}