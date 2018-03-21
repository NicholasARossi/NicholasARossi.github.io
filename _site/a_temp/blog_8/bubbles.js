


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




    var radiusScale = d3.scaleSqrt().domain([1, 200]).range([1, 20]);

//     var forceXSplit = d3.forceX(d => width * (d.Sex === "male" ? 0.3 : 0.7))
//         .strength(0.2);
		var forceXSplit = d3.forceX((width)/2).strength(.5);
    var forceXCombine = d3.forceX((width)/2).strength(0.3);

    var forceCollide = d3.forceCollide(function(d){
          return radiusScale(d.Total_Words*2) + 1;
        })
        .iterations(10);

    var simulation = d3.forceSimulation()
        .force("x", forceXCombine)
        .force("y", d3.forceY(height / 2).strength(0.3))
        .force("collide", forceCollide);

//   	var colorchange =d3.select("circles")
// 				.style("fill", d => d.Sex === "male" ? "#355C7D": "#F67280")
//     var colorchange2 =d3.select("circles")
//     		.style("fill", d => d.Sex === "male" ? "#F67280" : "#355C7D")
// Importing data file

d3.queue()
    .defer(d3.csv, "out.csv")
    .await(ready);

function ready (error, datapoints) {
    datapoints.forEach(d => d.Total_Words = +d.Total_Words);
    var minnesota
    var MNnode
    d3.xml("minnesota.svg", function(error, documentFragment) {
          if (error) {console.log(error); return;}

          MNnode = documentFragment
                      .getElementsByTagName("svg")[0];
          svg.node().appendChild(MNnode);

          minnesota = svg.select("svg#MN");

          minnesota.transition().duration(1000).delay(1000)
                // .attr("viewBox","258 -8000 1068 12180");
                .attr("viewBox","258 -8 1068 1218");


          minnesota.moveToBack()

      });
      var georgia
      var georgianode
      svg.append("g2")
      d3.xml("georgia.svg", function(error, documentFragment) {
            if (error) {console.log(error); return;}

            georgianode = documentFragment
                        .getElementsByTagName("svg")[0];
            svg.node().appendChild(georgianode);

            georgia = svg.select("svg#svg2");


            georgia.moveToBack()

        });
// #355C7D": "#F67280
console.log(svg.nodes().childNodes)
var colors = new Array("#AD8CFF", "#C774E8", "magenta","#00ced1","#94D0FF");

// var colors = new Array("#8B8386", "#A2627A", "darkturquoise","magenta","#eecd69");


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
    svg.append("text")
          .attr("x", width / 2-250)
          .attr("y", height / 2-75)
          .text('asian')
          .style("font-family","permanent marker")
          .style("font-size","25px")
          .style("fill",colors[0]);
    svg.append("text")
          .attr("x", width / 2-250)
          .attr("y", height / 2-50)
          .text('hispanic')
          .style("font-family","permanent marker")
          .style("font-size","25px")
          .style("fill",colors[1]);
  svg.append("text")
        .attr("x", width / 2-250)
        .attr("y", height / 2-25)
        .text('black')
        .style("font-family","permanent marker")
        .style("font-size","25px")
        .style("fill",colors[2]);

        svg.append("text")
              .attr("x", width / 2-250)
              .attr("y", height / 2)
              .text('white')
              .style("font-family","permanent marker")
              .style("font-size","25px")
              .style("fill",colors[3]);
              svg.append("text")
                    .attr("x", width / 2-250)
                    .attr("y", height / 2 +25)
                    .text('multiracial')
                    .style("font-family","permanent marker")
                    .style("font-size","25px")
                    .style("fill",colors[4]);
    var MNtext=svg.append("text")
              .attr("x", width / 2-20)
              .attr("y", height / 2-100)
              .text('Minnetonka High')
              .style("font-family","Streamster")
              .style("font-size","50px")
              .style("fill","darkturquoise");
    // var Mnstate=svg.append("text")
    //           .attr("x", width / 2+100)
    //           .attr("y", height / 2-75)
    //           .text('Minneapolis, MN')
    //           .style("font-family","Streamster")
    //           .style("font-size","25px")
    //           .style("fill","teal");
    var GAtext=svg.append("text")
              .attr("x", width / 2-3000)
              .attr("y", height / 2+100)
              .text('Berkmar High')
              .style("font-family","Streamster")
              .style("font-size","50px")
              .style("fill","magenta");
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
        MNtext.transition().duration(250)
              .attr("x", (atRight? (width / 2-20):(width / 2+10000)));
        // Mnstate.transition().duration(250)
        //       .attr("x", (atRight? (width / 2+100):(width / 2+10000)));
        GAtext.transition().duration(250)
              .attr("x", (atRight? (width / 2-3000):(width / 2+35)));
        circle.transition().duration(250)
            .attr("cx", (atRight? (30) : (54)))
            .style("fill", "white");
        rect.transition().duration(250)
            .style("fill", atRight? "lightgray" : "magenta");
        minnesota.transition().duration(250)
                  // .attr("viewBox","258 -8000 1068 12180");
                  .attr("viewBox",atRight?  "258 -8 1068 1218":"-2580 -8 1068 1218");
        georgia.transition().duration(250)
                  // .attr("viewBox","258 -8000 1068 12180");
                  .attr("viewBox",atRight?  "1500 100 550.0 500.0":"-150 100 550.0 500.0");
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
