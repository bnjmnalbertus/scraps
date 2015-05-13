var paper;
var points = [];
var pathelement;
var solved = false;

window.onload = function () {
   var canvas = document.getElementById('container');
   var button = document.getElementById('button');
   paper = Raphael('container', canvas.clientWidth, canvas.clientHeight);
   canvas.addEventListener("click", OnClick);
   button.addEventListener("click", Solve);
}

function OnClick (e) {
   // After solving and before reseting, ignore clicks
   if (solved) {
      return;
   }

   var circle = paper.circle(e.clientX, e.clientY, 3);
   circle.attr("fill", "#000");

   // Add the new circle to points
   points.push(circle);

   // Change solved state
   var button = document.getElementById('button');
   button.innerHTML = "Solve";
   solved = false;
}

function Solve () {
   if (solved) {
      // Get rid of elements
      points.forEach(function(el){
         el.remove();
      });
      points = [];
      pathelement.remove();

      // Change solved state
      var button = document.getElementById('button');
      button.innerHTML = "Solve";
      solved = false;
      return;
   }

   // Get average coordinates
   var xavg = 0;
   var yavg = 0;
   points.forEach(function(point){
      xavg += point.attr('cx');
      yavg += point.attr('cy');
   });
   xavg /= points["length"];
   yavg /= points["length"];

   // Split points on yavg
   var bigger = points.filter(function(point){
      return point.attr('cy') >= yavg;
   });
   var smaller = points.filter(function(point){
      return point.attr('cy') < yavg;
   });

   // Sort subarrays by points' angle with the x-axis, based on the average
   // coordinates as the origin
   bigger.sort(function(a,b){
      var ax = a.attr('cx') - xavg;
      var ay = a.attr('cy') - yavg;
      var bx = b.attr('cx') - xavg;
      var by = b.attr('cy') - yavg;
      // Compute angles
      var aangle = Math.acos(ax / (Math.sqrt(Math.pow(ax, 2) + Math.pow(ay, 2))));
      var bangle = Math.acos(bx / (Math.sqrt(Math.pow(bx, 2) + Math.pow(by, 2))));

      // Smaller angles first for y>0
      if (aangle < bangle) {
         return -1;
      } else if (aangle > bangle) {
         return 1;
      } else {
         if (ax < bx) {
            return -1;
         } else if (ax > bx) {
            return 1;
         } else {
            return 0;
         }
      }
   });
   smaller.sort(function(a,b){
      var ax = a.attr('cx') - xavg;
      var ay = a.attr('cy') - yavg;
      var bx = b.attr('cx') - xavg;
      var by = b.attr('cy') - yavg;
      // Compute angles
      var aangle = Math.acos(ax / (Math.sqrt(Math.pow(ax, 2) + Math.pow(ay, 2))));
      var bangle = Math.acos(bx / (Math.sqrt(Math.pow(bx, 2) + Math.pow(by, 2))));

      // Larger angles first for y<0
      if (aangle > bangle) {
         return -1;
      } else if (aangle < bangle) {
         return 1;
      } else {
         if (ax < bx) {
            return -1;
         } else if (ax > bx) {
            return 1;
         } else {
            return 0;
         }
      }
   });
   points = bigger.concat(smaller);

   // Construct a string for the path
   var path = "M"+points[0].attr('cx')+","+points[0].attr('cy');
   for (var i = 1; i < points["length"]; i++) {
      path += "L"+points[i].attr('cx')+","+points[i].attr('cy');
   }
   path += "L"+points[0].attr('cx')+","+points[0].attr('cy')+"Z";

   // Draw!
   pathelement = paper.path(path);

   var button = document.getElementById('button');
   button.innerHTML = "Reset";
   solved = true;
}
