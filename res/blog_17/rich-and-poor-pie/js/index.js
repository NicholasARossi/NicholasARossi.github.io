var rc = rough.canvas(document.getElementById('button'));
var w = document.getElementById('button').width;
var h = document.getElementById('button').height;
var frameskip = 10;
var frameCounter = 0;
var data = [86, 0.9];
var data = [550, 818];
var colors = ['#e684ae', 'teal'];
var styles = ['solid', 'hachure'];
var pie = d3.pie().
value(function (d) {return d;}).
sort(null);
var piedData = pie(data);

var loop = function loop() {
  frameCounter++;

  if (frameCounter >= frameskip) {
    rc.ctx.clearRect(0, 0, rc.canvas.width, rc.canvas.height);
    rc.ctx.font = "30px Indie Flower";
    rc.ctx.fillStyle = colors[0];

    rc.ctx.fillText("Housing", 0, h / 4);
    rc.ctx.fillText("value", 0, h / 3.25);
    rc.ctx.fillStyle = colors[1];

    rc.ctx.fillText("Financial", 0, h / 1.25);
    rc.ctx.fillText("assets", 0, h / 1.15);
    rc.ctx.font = "40px Indie Flower";
    rc.ctx.fillStyle = 'black';
    rc.ctx.fillText("Top 10%", 0, h / 6);


    //     rc.linearPath([[10, h/1.35], [25, h/2], [55, h/2]], {
    //   roughness: 1,
    //   stroke: colors[1], strokeWidth: 5
    // });
    // rc.circle(1920/2, 1080/2, 500, {
    //   roughness: 1, fill: '#e684ae',fillStyle: 'solid',fillWeight: 1,strokeWidth: 3
    // });
    //         rc.arc(1920/2, 1080/2, 500,500,0,1*Math.PI,true, {
    //    fill: 'teal',fillStyle: 'solid',fillWeight: 1,strokeWidth: 3
    // });

    piedData.forEach(function (d, i) {


      var a = rc.arc(w / 2, h / 2, w / 1.5, w / 1.5, d.startAngle - Math.PI / 1, d.endAngle - Math.PI / 1, true, {
        fill: colors[i], fillStyle: styles[i], fillWeight: 3, strokeWidth: 3 });


    });

    frameCounter = 0;
  }

  requestAnimationFrame(loop);
};

requestAnimationFrame(loop);