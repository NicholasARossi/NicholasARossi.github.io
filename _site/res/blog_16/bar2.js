

// Mike Bostock "margin conventions"

var margin = {top: 100, right: 50, bottom: 100, left: 50},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight - margin.top - margin.bottom;
var timemod=4
// D3 scales = just math
// x is a function that transforms from "domain" (data) into "range" (usual pixels)
// domain gets set after the data loads
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

// D3 Axis - renders a d3 scale in SVG
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    ;

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// create an SVG element (appended to body)
// set size
// add a "g" element (think "group")
// annoying d3 gotcha - the 'svg' variable here is a 'g' element
// the final line sets the transform on <g>, not on <svg>
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")


svg.append("g")
    .attr("class", "y axis")
  .append("text") // just for the title (ticks are automatic)
    .attr("transform", "rotate(-90)") // rotate the text!
    .attr("y", -50)
    .attr("x", -20)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Percentage of Delayed Flights");

var title_text=svg.append("text")
    .attr("class", "title")
    .attr("x",-margin.left)
    .attr("y",-20)
    .text('Top 10 Worst Airports by % Delayed')
    .attr("font-size", "20px")
    .style("opacity", 1.0);

// d3.tsv is a wrapper around XMLHTTPRequest, returns array of arrays (?) for a TSV file
// type function transforms strings to numbers, dates, etc.

loop();
setInterval(loop, 12000*timemod);
function loop (){
d3.tsv("data2.tsv", type, function(error, data) {
  d3.selectAll(".bar").remove();

  replay(data);
})


}


function type(d) {
  // + coerces to a Number from a String (or anything)
  d.percentage = +d.percentage;
  return d;
}

function replay(data) {
  var slices = [];
  for (var i = 0; i < data.length; i++) {
    slices.push(data.slice(0, i+1));
  }
  slices.forEach(function(slice, index){
    setTimeout(function(){
      draw(slice);
    }, index * 300*timemod);
  });
}


function draw(data) {
  // measure the domain (for x, unique letters) (for y [0,maxFrequency])
  // now the scales are finished and usable
  x.domain(data.map(function(d) { return d.airport; }));
  y.domain([0, d3.max(data, function(d) { return d.percentage; })]);

  // another g element, this time to move the origin to the bottom of the svg element
  // someSelection.call(thing) is roughly equivalent to thing(someSelection[i])
  //   for everything in the selection\
  // the end result is g populated with text and lines!
  svg.select('.x.axis').transition().duration(300*timemod).call(xAxis)
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start");

  // same for yAxis but with more transform and a title
  svg.select(".y.axis").transition().duration(300*timemod).call(yAxis)

  // THIS IS THE ACTUAL WORK!
  var bars = svg.selectAll(".bar").data(data, function(d) { return d.airport; }) // (data) is an array/iterable thing, second argument is an ID generator function

  bars.exit()
    .transition()
      .duration(300*timemod)
    .attr("y", y(0))
    .attr("height", height - y(0))
    .style('fill-opacity', 1e-6)
    .remove();

  // data that needs DOM = enter() (a set/selection, not an event!)
  bars.enter().append("rect")
    .attr("class", "bar")
    .attr("y", y(0))
    .attr("height", height - y(0));


  // the "UPDATE" set:
  bars.transition().duration(300*timemod).attr("x", function(d) { return x(d.airport); }) // (d) is one item from the data array, x is the scale object from above
    .attr("width", x.rangeBand()) // constant, so no callback function(d) here
    .attr("y", function(d) { return y(d.percentage); })
    .attr("height", function(d) { return height - y(d.percentage); }); // flip the height, because y's domain is bottom up, but SVG renders top down

}

//

