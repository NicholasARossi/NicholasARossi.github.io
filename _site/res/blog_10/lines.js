


(function() {
      d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };
    var width = 600,
    height = 300;



    var svg = d3.select("#chart")
        .append("svg")

        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)")



d3.queue()
    .defer(d3.csv, "out.csv")
    .await(ready);

function ready (error, datapoints) {
    datapoints.forEach(d => d.Total_Words = +d.Total_Words);
    var minnesota

// #355C7D": "#F67280
var colors = new Array("#AD8CFF", "#C774E8", "magenta","#00ced1","#94D0FF");

// var colors = new Array("#8B8386", "#A2627A", "darkturquoise","magenta","#eecd69");

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); });

    var circles = svg.selectAll(".Character")
        .data(datapoints)
        .enter().append("circle")
        .attr("class", "Character")

        .attr("r", function(d){
            return radiusScale(d.Total_Words*2)
        })
        // console.log(d.data1)

        .style("fill", function(d){
          return colors[d.data1]
        });


// Adding Toggle Switches


    // var Mnstate=svg.append("text")
    //           .attr("x", width / 2+100)
    //           .attr("y", height / 2-75)
    //           .text('Minneapolis, MN')
    //           .style("font-family","Streamster")
    //           .style("font-size","25px")
    //           .style("fill","teal");

    var atRight = true;

    var rect = svg.append("rect")
        .attr("x", 10)
        .attr("y", 10)
        .attr("rx", 22)
        .attr("ry", 22)
        .style("fill", "lightgray")
        .attr("width", 64)
        .attr("height", 40);

    var circle = svg.append("circle")
        .attr("cx", 30)
        .attr("cy", 30)
        .attr("r", 16)
        .style("fill", "white")
//     		.on("click", function(){
//             .style("fill", atRight ? d => d.Sex === "male" ? "#355C7D": "#F67280")
//         });
        .on("click", function(){

//             datapoints
//               	.forEach(d => d.Sex = "male");
					if(atRight) {
          circles
          .style("fill", function(d){
            return colors[d.data2]
          });
                }
          else{
                     circles
                     .style("fill", function(d){
                       return colors[d.data1]
                     });
          }
            simulation
                .force("x", atRight ? forceXSplit : forceXCombine)
                .alpha(1)
                .restart();
            setAtRight(!atRight);
        });

    var setAtRight = function(newValue) {
        atRight = newValue;

        circle.transition().duration(250)
            .attr("cx", (atRight? (30) : (54)))
            .style("fill", "white");
        rect.transition().duration(250)
            .style("fill", atRight? "lightgray" : "magenta");

    };


    var res = {
        'getValue': function() { return atRight; },
        'setValue': setAtRight,
        'remove': function() { circle.remove(); }
    };


    simulation.nodes(datapoints)
        .on('tick', ticked);


    function ticked() {
        circles
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            });
    }
}
})();
