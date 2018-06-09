d3.csv('data_total.csv', function (data) {
  // states
  var body = d3.select('body')
	var margin = { top: 0, right: 0, bottom: 50, left: 50 }
	var h =400- margin.top -margin.bottom
	var w =window.innerWidth-margin.left - margin.right
	var formatPercent = d3.format('.0%')
	// Scales
  // var colorScale = d3.scale.category20()
  var xScalelinear = d3.scale.linear()
    .domain([
    	1,
    	3500
    	])
    .range([0,w])

  var xScalelog = d3.scale.log()
    .domain([
    	1,
    	3500
    	])
    .range([0,w])
  var yScale = d3.scale.linear()
    .domain([
    	1,
    	45
    	])
    .range([h,0])
	// SVG
   var bonus=0

    if (w > 400) {
    bonus=200
}
	var svg = body.append('svg')
	      .attr('viewBox',bonus+" 0 450 500")
      .attr('preserveAspectRatio',"xMidYMid meet")
	     .attr('height',h + margin.top + margin.bottom)
	     .attr('width',w + margin.left + margin.right)
	  .append('g')
	    .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
	// X-axis
	var xAxis = d3.svg.axis()
	  .scale(xScalelinear)
	  .tickFormat(formatPercent)
	  .ticks(5)
	  .orient('bottom')
  // Y-axis
	var yAxis = d3.svg.axis()
	  .scale(yScale)
	  .tickFormat(formatPercent)
	  .ticks(5)
	  .orient('left')
  // Circles
  // Add the tooltip container to the vis container
// it's invisible and its position/contents are defined during mouseover
var tooltip = body.append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// tooltip mouseover event handler
var tipMouseover = function(d) {
    // var color = d3.interpolate("#ffffff","#FF00FF")(d.state/52);
    var html  = d.airport + "<br/>"+"<span style='color:" + 'magenta' + ";'>"+parseInt(d.percentage) +'% Delayed' + "</span><br/>"
    +"<span style='color:" + 'turquoise' + ";'>"+parseInt(d.late)+' Total Delayed'  + "</span>";
                d3.select(this)
                  .transition()
                  .duration(500)
                  .style('opacity',1.0)
                  .attr('r',function (d) { return Math.sqrt(d.observations)/4 })

                  .attr('stroke-width',3)
    tooltip.html(html)
        .style("left", (d3.event.pageX + 15) + "px")
        .style("top", (d3.event.pageY - 28) + "px")
      .transition()
        .duration(200) // ms
        .style("opacity", .9) // started as 0!

};
// tooltip mouseout event handler
var tipMouseout = function(d) {
  d3.select(this)
    .transition()
    .duration(500)
    .attr('r',function (d) { return Math.sqrt(d.observations)/8 })
    .attr('stroke-width',1)
    .style('opacity',0.5)

    tooltip.transition()
        .duration(300) // ms
        .style("opacity", 0); // don't care about position!
};
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScalelinear(d.late) })
      .attr('cy',function (d) { return yScale(d.percentage) })
      .attr('r',function (d) { return Math.sqrt(d.observations)/8 })
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',"#00CED1")
      .style('opacity',0.5)
      .on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout);
    // .append('title') // Tooltip
    //   .text(function (d) { return d.state +
    //                        '\nReturn: ' + formatPercent(d.seg) +
    //                        '\n % White: ' + formatPercent(d.per_white) })
  // X-axis
  svg.append('g')
      .attr('class','axis')
      .attr('transform', 'translate(0,' + h + ')')
      // .call(xAxis)
    .append('text') // X-axis Label
      .attr('class','label')
      .attr('y',25)
      .attr('x',0)
      .attr('dy','.71em')
      .style('text-anchor','front')
      .text('Total Delayed Flights')
  // Y-axis
  svg.append('g')
      // .attr('class', 'axis')
      // .call(yAxis)
    .append('text') // y-axis Label
      .attr('class','label')
      .attr('transform','rotate(-90)')
      .attr('x',-50)
      .attr('y',-40)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('% Delayed Flights')



      var atRight = true;
  var bs_modo=1
  var rect = svg.append("rect")
      .attr("x", 10*bs_modo)
      .attr("y", 10*bs_modo)
      .attr("rx", 22*bs_modo)
      .attr("ry", 22*bs_modo)
      .style("fill", "lightgray")
      .attr("width", 64*bs_modo)
      .attr("height", 40*bs_modo)
      .on("click", function(){

//             datapoints
//               	.forEach(d => d.Sex = "male");
				if(atRight) {
            }
        else{
        }
      setAtRight(!atRight);

      });

  var circle = svg.append("circle")
      .attr("cx", 30*bs_modo)
      .attr("cy", 30*bs_modo)
      .attr("r", 16*bs_modo)
      .style("fill", "white")
//     		.on("click", function(){
//             .style("fill", atRight ? d => d.Sex === "male" ? "#355C7D": "#F67280")
//         });
      .on("click", function(){

//             datapoints
//               	.forEach(d => d.Sex = "male");
				if(atRight) {
            }
        else{
        }
      setAtRight(!atRight);

      });


    var setAtRight = function(newValue) {
        atRight = newValue;
        circle.transition().duration(500)
            .attr("cx", (atRight? (30*bs_modo) : (54*bs_modo)))
            .style("fill", "white");
        rect.transition().duration(500)
            .style("fill", atRight? "lightgray" : "FF8888")
        circles.transition().duration(500)
              .attr('cx',function (d) { return atRight?  xScalelinear(d.late) :  xScalelog(d.late) });


    };


    var res = {
        'getValue': function() { return atRight; },
        'setValue': setAtRight,
        'remove': function() { circle.remove(); }
    };


})
