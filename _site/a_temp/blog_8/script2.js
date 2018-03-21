d3.csv('statescatter2.csv', function (data) {
  // states
  var body = d3.select('body')
	var margin = { top: 50, right: 50, bottom: 50, left: 50 }
	var h = 500 - margin.top - margin.bottom
	var w = 500 - margin.left - margin.right
	var formatPercent = d3.format('.0%')
	// Scales
  // var colorScale = d3.scale.category20()
  var xScale = d3.scale.linear()
    .domain([
    	.1,
    	1.0
    	])
    .range([0,w])
  var yScale = d3.scale.linear()
    .domain([
    	2,
    	16
    	])
    .range([h,0])
	// SVG
	var svg = body.append('svg')
  // .attr('height',h + margin.top + margin.bottom)
  // .attr('width',w + margin.left + margin.right)
  .attr('viewBox',"0 0 650 1000")
  .attr('preserveAspectRatio',"xMidYMid meet")
	  .append('g')
	    .attr('transform','translate(' + margin.left + ',' + margin.top + ')')
	// X-axis
	var xAxis = d3.svg.axis()
	  .scale(xScale)
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
    var html  = d.state + "<br/>"+"<span style='color:" + 'coral' + ";'>"+parseInt(d.urb*100) +'%' + "</span><br/>"
    +"<span style='color:" + 'slategrey' + ";'>"+Math.round(d.seg * 10)/10 + "</span>";
                d3.select(this)
                  .transition()
                  .duration(500)
                  .attr('r',20)
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
    .attr('r',10)
    .attr('stroke-width',1)
    tooltip.transition()
        .duration(300) // ms
        .style("opacity", 0); // don't care about position!
};
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
    .append('circle')
      .attr('cx',function (d) { return xScale(d.urb) })
      .attr('cy',function (d) { return yScale(d.seg) })
      .attr('r','10')
      .attr('stroke','black')
      .attr('stroke-width',1)
      .attr('fill',function (d,i) { return d3.interpolate("#B378D3","#f88379")(d.seg/15-d.urb*.1) })
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
      .attr('x',50)
      .attr('dy','.71em')
      .style('text-anchor','front')
      .text('Urbanization ->')
  // Y-axis
  svg.append('g')
      // .attr('class', 'axis')
      // .call(yAxis)
    .append('text') // y-axis Label
      .attr('class','label')
      .attr('transform','rotate(-90)')
      .attr('x',-50)
      .attr('y',4)
      .attr('dy','.71em')
      .style('text-anchor','end')
      .text('Segregation ->')
})
