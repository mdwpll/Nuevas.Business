const fs = require('fs');

let rawdata = fs.readFileSync('student.json');
var points = JSON.parse(rawdata)[elements];
var finalArr = []
points.forEach(point => {
    if (point.type === "node") {
        finalArr.push([point.lat, point.lon])
    }
});
console.log(finalArr);