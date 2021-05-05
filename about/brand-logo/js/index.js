TweenLite.defaultEase = Power3.easeInOut;
var dur = 2;
var tl = new TimelineMax({ repeat: -1 });
tl.to("#circle", dur, { morphSVG: "#star" });
tl.to("#circle", dur, { morphSVG: "#square" });
tl.to("#circle", dur, { morphSVG: "#hex" });
tl.to("#circle", dur, { morphSVG: "#circle2" });