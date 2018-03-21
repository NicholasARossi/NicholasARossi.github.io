// window.onload = function () {
// 	MIDI.loadPlugin({
// 		soundfontUrl: "midi/soundfont/",
// 		instrument: "acoustic_grand_piano",
// 		onprogress: function(state, progress) {
// 			console.log(state, progress);
// 		},
// 		onsuccess: function() {
// 			var delay = 0; // play one note every quarter second
// 			var note = 50; // the MIDI note
// 			var velocity = 127; // how hard the note hits
// 			// play the note
// 			MIDI.setVolume(0, 127);
// 			MIDI.noteOn(0, note, velocity, delay);
// 			MIDI.noteOff(0, note, delay + 0.75);
// 		}
// 	});
// };



myApp.factory('utils', function() {
  var utils = {};
  utils.getHash = function() {
    var hash = window.location.hash;
    if(!hash) return;
    hash = hash.slice(1); // remove the '#'
    try { return JSON.parse(decodeURIComponent(hash)); }catch(e) {};
  };
  utils.setHash = function(obj) {
    window.location.hash = encodeURIComponent(JSON.stringify(obj));
  };
  utils.sample = function(probs) {
    var t = 0;
    var r = Math.random();
    for(var i = 0; i < probs.length; i++) {
      t = t + probs[i];
      if (r <= t) return i;
    }
    throw new Error('invalid distribution');
  };
  utils.normalizeTransitionMatrix = function(matrix, idx1, idx2) {
    // The next states this state will transition to.
    var states = matrix[idx1];

    // Convert to numbers.
    states.forEach(function(d, i){ states[i] = +d; });

    // We need to re-normalize the transitions for each state so that they
    // add to one.

    // `val` - The selected next state value.
    var val = states[idx2];

    if(val === 1) return states.forEach(function(d, i) {
      if(i === idx2) return;
      states[i] = 0;
    });

    // `r` - The remaining state probability.
    var r = states.reduce(function(total, state, i){
      return total + (i === idx2 ? 0 : state);
    }, 0);

    if(r === 0) r = states.length - 1, states.forEach(function(d, i) {
      if(i === idx2) return;
      states[i] = 1;
    });

    // normalize the remaining states and then multiply by the remaining
    // probability, `( 1 - val)`.
    states.forEach(function(d, i) {
      if(i === idx2) return;
      states[i] = states[i] / r * (1 - val);
    });
  };
  return utils;
});

myApp.directive('stDiagram', function($compile) {
  function link(scope, el, attr) {
    el = d3.select(el[0]);
    calcResize();

    var svg = el.select('svg');
    var alignG = svg.append('g');
    var centerG = alignG.append('g');
    var color = d3.scale.category10();
    var links = centerG.append('g').attr('class', 'links').selectAll('paths');
    var nodes = centerG.append('g').attr('class', 'nodes').selectAll('g');
    var markers = svg.append('defs').selectAll('.linkMarker');
    var currentStateG = centerG.append('g').attr('class', 'currentState')
      .attr('transform', 'translate(' + [w / 2, h / 2] + ')')
      .style('opacity', 0);
    var w, h, r = 20;
    var linkElements = {};
    var force = d3.layout.force()
      .linkDistance(function(d){ return w / 16 + (1 - d.value) * 200 * w / 1200 })
      .charge(-4000);

    currentStateG
      .append('circle')
      .attr('r', 10);
    function midiplay(){
        	MIDI.loadPlugin({
      		soundfontUrl: "midi/soundfont/",
      		instrument: "acoustic_grand_piano",
      		// onprogress: function(state, progress) {
      		// 	console.log(state, progress);
      		// },
      		onsuccess: function() {
            notes=[62,64,66,69,71,74];
      			var delay = 0; // play one note every quarter second
      			var note = notes[previousState]; // the MIDI note
      			var velocity = 127  ; // how hard the note hits
      			// play the note
      			MIDI.setVolume(0, 127);
      			MIDI.noteOn(0, note, velocity, delay);
      			MIDI.noteOff(0, note, delay + (scope.duration/2000)*0.75);
      		}
      	});
    }
    function calcResize() {
      return w = el.node().clientWidth, h = el.node().clientHeight, w + h;
    }

    scope.$watch(calcResize, resize);
    scope.$watch('center', resize, true);
    scope.$watch('volume',update)
    scope.$watch('states', update, true);
    scope.$watch('transitionMatrix', update, true);
    scope.$watch('selectedTransition', update);

    function resize() {

      force.size([w, h]);
      svg.attr({width: w, height: h});
      var center = scope.center;
      var cx = (center && angular.isDefined(center[0])) ? center[0] : 0.5;
      var cy = (center && angular.isDefined(center[1])) ? center[1] : 0.5;
      alignG.attr('transform', 'translate(' + [ w * cx, h * cy ] + ')');
      centerG.attr('transform', 'translate(' + [ - w / 2, - h / 2] + ')');


    }
    // var startval = false;

    var sortByVal = false;
    d3.select(".sortButton").on("click", function(){
    	sortByVal = !sortByVal;

    	// change(sortByVal);

    });

    function update() {
      var linksData = [];
      var enter;
      // var looper = u_id.value;
      if (sortByVal !== false){
      // if (scope.duration !== 2000){
      midiplay();
    // }

    }

      scope.transitionMatrix.forEach(function(transitions, idx1) {
        // idx1 - the index of the currently state
        // transitions - an array of the next state probabilities were
        // each index in the array coorisponds to a state in `scope.states`.
        transitions.forEach(function(prob, idx2) {
          if(prob === 0) return;
          linksData.push({
            source: scope.states[idx1],
            target: scope.states[idx2],
            value: +prob
          });
        });
      });
      nodes = nodes.data(scope.states);
      enter = nodes.enter().append('g')
        .attr('class', 'node')
        .style('fill', function(d){ return color(d.index); })
        .call(force.drag);
      enter.append('circle')
        .attr('r', r);
      enter.append('text')
        .attr('transform', 'translate(' + [0, 5] + ')')
      nodes.exit().remove();

      var linkKey = function(d) {
        return (d.source && d.source.index) + ':'
          + (d.target && d.target.index);
      };
      links = links.data(linksData, linkKey)
      links.enter().append('path')
        .attr('marker-end', function(d) {
          if(!d.source || !d.target) debugger;
          return 'url(#linkMarker-' + d.source.index + '-' + d.target.index + ')';
        }).classed('link', true)
        .style('stroke', function(d){ return color(d.source.index); })
      links.exit().remove();
      links.each(function(d, i) {
        linkElements[d.source.index + ':' +d.target.index] = this;
        var active = false, inactive = false;
        if (scope.selectedTransition) {
          active = scope.selectedTransition[0] === d.source.index
            && scope.selectedTransition[1] === d.target.index;
          inactive = !active;
        }
        d3.select(this)
          .classed('active', active)
          .classed('inactive', inactive);
      });

      markers = markers.data(linksData, linkKey);
      markers.enter().append('marker')
        .attr('class', 'linkMarker')
        .attr('id', function(d) {
          return 'linkMarker-' + d.source.index + '-' + d.target.index })
        .attr('orient', 'auto')
        .attr({markerWidth: 2, markerHeight: 4})
        .attr({refX: 0, refY: 2})
        .append('path')
          .attr('d', 'M0,0 V4 L2,2 Z')
          .style('fill', function(d){ return color(d.source.index); });
      markers.exit().remove();

      force.nodes(scope.states)
        .links(linksData)
        .start();
    }

    force.on('tick', function() {
      var _r = r;
      links
        .style('stroke-width', function(d) {
          return Math.sqrt(100 * d.value || 2); })
        .attr('d', function(d) {
          var r = _r;
          var p1 = vector(d.source.x, d.source.y);
          var p2 = vector(d.target.x, d.target.y);
          var dir = p2.sub(p1);
          var u = dir.unit();
          if(d.source !== d.target) {
            r *= 2;
            var right = dir.rot(Math.PI /2).unit().scale(50);
            var m = p1.add(u.scale(dir.len() / 2)).add(right);
            u = p2.sub(m);
            l = u.len();
            u = u.unit();
            p2 = m.add(u.scale(l - r));
            u = p1.sub(m);
            l = u.len();
            u = u.unit();
            p1 = m.add(u.scale(l - r));
            return 'M' + p1.array() + 'S' + m.array() + ' ' + p2.array();
          }else{
            var s = 50, rot = Math.PI / 8;
            r = r * 1.5;
            p1 = p1.add(vector(1, -1).unit().scale(r - 10))
            p2 = p2.add(vector(1, 1).unit().scale(r))
            var c1 = p1.add(vector(1, 0).rot(-rot).unit().scale(s));
            var c2 = p2.add(vector(1, 0).rot(rot).unit().scale(s - 10));
            return 'M' + p1.array() + ' C' + c1.array() + ' '
              + c2.array() + ' ' + p2.array();
          }
        });
      nodes.attr('transform', function(d) {
        return 'translate(' + [d.x, d.y] + ')';
      }).select('text').text(function(d){ return d.label; })
    });

    var previousState=0;
    var currentState = 0;

    function loop() {
      var i = currentState;
      var nextStates = scope.transitionMatrix[i];
      var nextState = -1;
      var rand = Math.random();
      var rand2 = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
      var total = 0;
      for(var j = 0; j < nextStates.length; j++) {
        total += nextStates[j];
        if(rand < total) {
          nextState = j;
          break;
        }


      }
      rythems=[1.0,0.5,0.25]
      var cur = scope.states[currentState];
      var next = scope.states[nextState];
      var path = linkElements[cur.index + ':' + next.index];

      scope.$apply(function() {
        scope.$emit('stateChange', next);
        scope.$emit('previousChange', cur);
      });

      currentStateG
        .transition().duration(+scope.duration * 0.25* rythems[rand2])
        .style('opacity', 1)
        .ease('cubic-in')
        .attrTween('transform', function() {
          var m = d3.transform(d3.select(this).attr('transform'));
          var start = vector.apply(null, m.translate);
          var scale = m.scale;
          var s = d3.interpolateArray(scale, [1, 1]);
          return function(t) {
            var end = path.getPointAtLength(0);
            end = vector(end.x, end.y);
            var p = start.add(end.sub(start).scale(t));
            return 'translate(' + p.array() + ') scale(' + s(t) + ')';
          };
        })
        .transition().duration(+scope.duration * 0.5* rythems[rand2])
        .ease('linear')
        .attrTween('transform', function() {
          var l = path.getTotalLength();
          return function(t) {
            var p = path.getPointAtLength(t * l);
            return 'translate(' + [p.x, p.y] + ') scale(1)';
          };
        })
        .transition().duration(+scope.duration * 0.25* rythems[rand2])
        .ease('bounce-in')
        .attrTween('transform', function() {
          var m = d3.transform(d3.select(this).attr('transform'));
          var translation = vector.apply(null, m.translate);
          var scale = m.scale;
          var s = d3.interpolateArray(scale, [2, 2]);
          return function(t) {
            var end = vector(next.x, next.y);
            var p = translation.add(end.sub(translation).scale(t));
            return 'translate(' + p.array() + ') scale(' + s(t) + ')';
          };
        })
        .each('end', function() {

          loop();
        })
      previousState=currentState;
      currentState = nextState;
      return previousState
    }
    setTimeout(loop, +scope.duration);
  }
  return {
    link: link,
    restrict: 'E',
    replace: true,
    scope: {
      states: '=',
      center: '=',
      transitionMatrix: '=',
      duration: '=',
      selectedTransition: '=',
      state: '=?'
    },
    template: ''
      + '<div class="st-diagram">'
        + '<svg>' + '</svg>'
      + '</div>'
  };


});

// function drawExample1() {
//
//      var options = {
//        width: 800,
//        height: 400,
//       //  display:'inline-block',
//        animation:{
//          duration: 1000,
//          easing: 'out'
//        },
//        vAxis: {minValue:0, maxValue:1000}
//      };
//      var data = new google.visualization.DataTable();
//      data.addColumn('string', 'N');
//      data.addColumn('number', 'Value');
//      data.addRow(['R', 100]);
//      data.addRow(['S', 100]);
//
//
//      var chart = new google.visualization.ColumnChart(
//          document.getElementById('example1-visualization'));
//      var button = document.getElementById('example1-b1');
//
//      function drawChart() {
//        // Disabling the button while the chart is drawing.
//        button.disabled = true;
//        google.visualization.events.addListener(chart, 'ready',
//            function() {
//              button.disabled = false;
//            });
//        chart.draw(data, options);
//      }
//
//      button.onclick = function() {
//        var newValue = 1000 - data.getValue(0, 1);
//        data.setValue(0, 1, newValue);
//        drawChart();
//      }
//      drawChart();
//     };
//
//
//     function init() {
//       drawExample1();
//     }
//
//     google.load('visualization', '1.1', {packages: ['corechart']});
//     google.setOnLoadCallback(init);
myApp.directive('histogram', ['$parse', '$window', function($parse, $window){
	return{
		restrict: "E",
		replace: false,
		template: "<svg class='histogram-chart'></div>",
		link: function(scope, elem, attrs) {
			var exp = $parse(attrs.data);
			var d3 = $window.d3;


            /*
                Sortable barchart. Largely taken from:
                http://bl.ocks.org/mbostock/3885705
            */

			// Aesthetic settings
			var margin = {top: 20, right: 50, bottom: 20, left: 50},
			    width = 400 - margin.left - margin.right,
			    height = 400 - margin.top - margin.bottom,
			    barColor = "steelblue",
			    axisColor = "whitesmoke",
			    axisLabelColor = "grey",
			    yText = "Number",
			    xText = "IDs";

			// Inputs to the d3 graph
			var data = scope[attrs.data];
      var color = d3.scale.category10();


      scope.$on('previousChange', function(e, state) {
              data[state.index].nqueries=data[state.index].nqueries+1
              if (data[state.index].nqueries === 50){
              data[0].nqueries=0
              data[1].nqueries=0
              data[2].nqueries=0
              data[3].nqueries=0
              data[4].nqueries=0
              data[5].nqueries=0
            }
              updateHistogram();

      });
      scope.changeData = function(){
          data[0].nqueries=0
          data[1].nqueries=0
          data[2].nqueries=0
          data[3].nqueries=0
          data[4].nqueries=0
          data[5].nqueries=0
      }
			// A formatter for counts.
			var formatCount = d3.format(",.0f");

			// Set the scale, separate the first bar by a bar width from y-axis
			var x = d3.scale.ordinal()
			    .rangeRoundBands([0, width], .1, 1);

			var y = d3.scale.linear()
			    .range([height, 0]);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left")
			    .tickFormat(formatCount);

			// Initialize histogram
			var svg = d3.select(".histogram-chart")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			function drawAxis(){


				data.forEach(function(d) {
					d.nqueries = +d.nqueries;
				});

				x.domain(data.map(function(d) { return d.name; }));
        y.domain([0, 50]);
				// y.domain([0, d3.max(data, function(d) { return d.nqueries; })]);

				// Draw x-axis
				svg.append("g")
					.attr("class", "x-axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
					.append("text")
					.attr("y", 6)
					.attr("dy", "-0.71em")
					.attr("x", width )
					.style("text-anchor", "end")
					.style("fill", axisLabelColor)
					// .text(xText);

				// Draw y-axis
				svg.append("g")
					.attr("class", "y-axis")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.style("fill", axisLabelColor)
					// .text(yText);

				// Change axis color
				d3.selectAll("path").attr("fill", axisColor);
			}

			function updateAxis(){
				// console.log(data);
				data.forEach(function(d) {
					d.nqueries = +d.nqueries;
				});

				x.domain(data.map(function(d) { return d.name; }));
        y.domain([0, 50]);
				// y.domain([0, d3.max(data, function(d) { return d.nqueries; })]);

				svg.selectAll("g.y-axis").call(yAxis);
				svg.selectAll("g.x-axis").call(xAxis);

			}


			function drawHistogram(){

				drawAxis();

				// svg.selectAll(".bar")
        //              .data(data)
        //              .enter().append("rect")
        //              .style("fill", function(d) { return color(++i); })
        //              .attr("class", "bar")
        //              .attr("x", function(d) { return x(d[opts.xaxisProperty]); })
        //              .attr("width", x.rangeBand())
        //              .attr("y", height)
        //              .attr("height", 0)
        //              .transition().duration(1000)
        //              .attr("y", function(d) { return y(d[opts.yaxisProperty]); })
        //              .attr("height", function(d) { return height - y(d[opts.yaxisProperty]); });
				// bar.append("rect")
				// 	.attr("class", "bar")
				// 	.attr("x", function(d){ return x(d.name) })
				// 	.attr("width", x.rangeBand())
				// 	.attr("y", function(d){ return y(d.nqueries) })
				// 	.attr("height", function(d) { return height - y(d.nqueries); })
				// 	.attr("fill", barColor);

				// bar.append("text")
				// 	.attr("y", function(d){ return y(d.nqueries) })
				// 	.attr("x", function(d){ return x(d.name) })
				// 	.attr("dy", "-1px")
				// 	.attr("dx", x.rangeBand()/2 )
				// 	.attr("text-anchor", "middle")
				// 	.attr("class", "numberLabel")
				// 	.text(function(d) { return formatCount(d.nqueries); });
			}

			function updateHistogram(){
				console.log("updating");

				// Redefine scale and update axis
				updateAxis();

				// Select
				var bar = svg.selectAll(".barInfo").data(data);

                var bEnter = bar.enter().append("g")
					.attr("class", "barInfo");

                bEnter.append("rect")
					.attr("class", "bar");

                bEnter.append("text")
                    .attr("class","numberLabel");

                // update
                bar.selectAll("rect")
                    .attr("x", function(d){ return x(d.name) })
                    .transition()
                    .duration(200)
                    .ease("quad")
                        .attr("transform", function(d,i) {
                            return "translate(" + [0, y(d)] + ")"
                        })
					.attr("width", x.rangeBand())
					.attr("y", function(d){ return y(d.nqueries) })
					.attr("height", function(d) { return height - y(d.nqueries); })

					.attr("fill", function(d){ return color([d.name]) });
                bar.selectAll("text")
                    .attr("y", function(d){ return y(d.nqueries) })
					.attr("x", function(d){ return x(d.name) })
					.attr("dy", "-1px")
					.attr("dx", x.rangeBand()/2 )
					.attr("text-anchor", "middle")
					.attr("class", "numberLabel")
					.text(function(d) { return formatCount(d.nqueries); });

			}

			// Render the graph when data is changed.
			scope.$watchCollection(exp, function(newCollection, oldCollection, scope) {
				data = newCollection;
			 	updateHistogram();
			 });

			drawHistogram();

			// var sortByVal = false;
			// d3.select(".sortButton").on("click", function(){
			// 	sortByVal = !sortByVal;
			// 	change(sortByVal);
			// });
      //
			// d3.select("sortSwitch").on("change", change);

			// var sortTimeout = setTimeout(1000);
      //
			// function change(sortByVal) {
			// 	clearTimeout(sortTimeout);
      //
			// 	// Copy-on-write since tweens are evaluated after a delay.
			// 	var x0 = x.domain(data.sort(sortByVal
			// 	    ? function(a, b) { return b.nqueries - a.nqueries; }
			// 	    : function(a, b) { return d3.ascending(a.name, b.name); })
			// 	    .map(function(d) { return d.name; }))
			// 	    .copy();
      //
			// 	var transition = svg.transition().duration(750),
			// 	    delay = function(d, i) { return i * 50; };
      //
			// 	transition.selectAll([".bar", ".numberLabel"])
			// 	    .delay(delay)
			// 	    .attr("x", function(d) { return x0(d.name); });
      //
			// 	transition.select(".x.axis")
			// 	    .call(xAxis)
			// 	  .selectAll("g")
			// 	    .delay(delay);
			// 	}

			}
	};
}]);
//
// myApp.directive('sequence', function() {
//   function link(scope, el, attr) {
//     var sel = d3.select(el[0]);
//     var w, h;
//
//     scope.$watch(function() {
//       return w = sel.node().clientWidth, h = sel.node().clientHeight, w + h;
//     }, function() {
//       scope.width = w, scope.height = h;
//       sel.style('line-height', h + 'px');
//     });
//
//     scope.$on('stateChange', function(e, state) {
//       sel.append('span').text(state.text).style('position', 'absolute')
//         .style('color', state.color)
//         .style('opacity', 0)
//         .transition()
//         .duration(2000)
//         .ease('cubic-in')
//         .style('opacity', 1)
//         .styleTween('left', function() { return d3.interpolate(attr.step1 || '90%', attr.step2 || '80%');})
//         .transition()
//         .duration(15000)
//         .ease('linear')
//         .styleTween('left', function() { return d3.interpolate(attr.step2 || '80%', '10%'); })
//         .remove();
//     });
//   }
//   return {
//     draw
//   };
// });

// myApp.directive('sequence', function() {
// function drawExample1() {
//
//  var options = {
//    width: 800,
//    height: 400,
//   //  display:'inline-block',
//    animation:{
//      duration: 1000,
//      easing: 'out'
//    },
//    vAxis: {minValue:0, maxValue:1000}
//  };
//  var data = new google.visualization.DataTable();
//  data.addColumn('string', 'N');
//  data.addColumn('number', 'Value');
//  data.addRow(['R', 100]);
//  data.addRow(['S', 100]);
//
//
//  var chart = new google.visualization.ColumnChart(
//      document.getElementById('example1-visualization'));
//  var button = document.getElementById('example1-b1');
//
//  function drawChart() {
//    // Disabling the button while the chart is drawing.
//    button.disabled = true;
//    google.visualization.events.addListener(chart, 'ready',
//        function() {
//          button.disabled = false;
//        });
//    chart.draw(data, options);
//  }
//
//  button.onclick = function() {
//    var newValue = 1000 - data.getValue(0, 1);
//    data.setValue(0, 1, newValue);
//    drawChart();
//  }
//  drawChart();
// };
//
//
// function init() {
//   drawExample1();
// }
//
// google.load('visualization', '1.1', {packages: ['corechart']});
// google.setOnLoadCallback(init);
// });
// myApp.directive('cell', function() {
//
//   function link(scope, el, attr) {
//     scope.$parent.numCells++;
//     scope.$on('destroy', function() {
//       scope.$parent.numCells--;
//     });
//
//     scope.$parent.$watch('width + height', function(){
//       scope.width = scope.$parent.width / scope.$parent.numCells;
//       scope.height = scope.$parent.height;
//     });
//   }
//   return {
//     link: link,
//     restrict: 'E',
//     replace: true,
//     transclude: true,
//     template: '<div class="cell"'
//       + "ng-style=\"{width: width + 'px', height: height + 'px'}\""
//       + 'ng-transclude>' + '</div>'
//   };
// });
// myApp.directive('row', function() {
//   function preLink(scope, el, attr) {
//     scope.numCells = 0;
//   }
//   function postLink(scope, el, attr) {
//     scope.$parent.numRows++;
//     scope.$on('destroy', function() {
//       scope.$parent.numRows--;
//     });
//     scope.$parent.$watch('width + height', function(){
//       scope.width = scope.$parent.width;
//       scope.height = scope.$parent.height / scope.$parent.numRows;
//     });
//   }
//   return {
//     link: { pre: preLink, post: postLink },
//     restrict: 'E',
//     replace: true,
//     transclude: true,
//     template: '<div class="row"'
//       + "ng-style=\"{width: width + 'px', height: height + 'px'}\""
//       + 'ng-transclude>' + '</div>'
//   };
// });
// myApp.directive('grid', function() {
//   function preLink(scope, el, attr, controllers) {
//     scope.numRows = 0;
//   }
//   function postLink(scope, el, attr, controllers) {
//     var sel = d3.select(el[0]);
//     var w, h;
//     scope.name = 'victor';
//     scope.numberOfRows = 0;
//     scope.$watch(function() {
//       return w = sel.node().clientWidth, h = sel.node().clientHeight, w + h;
//     }, function() {
//       scope.width = w, scope.height = h;
//     });
//   }
//   return {
//     link: { pre: preLink, post: postLink },
//     restrict: 'E',
//     transclude: true,
//     replace: true,
//     template: ''
//       + '<div style="overflow:hidden" class="grid">'
//       + '<div ng-transclude></div>'
//       + '</div>'
//   };
// });





// myApp.directive('sequence', function() {
//   function drawExample1(scope) {
//    var options = {
//      width: 400,
//      height: 240,
//      animation:{
//        duration: 1000,
//        easing: 'out'
//      },
//      vAxis: {minValue:0, maxValue:1000}
//    };
//    var data = new google.visualization.DataTable();
//    data.addColumn('string', 'N');
//    data.addColumn('number', 'Value');
//    data.addRow(['V', 100]);
//
//    var chart = new google.visualization.ColumnChart(
//        document.getElementById('example1-visualization'));
//
//    function drawChart() {
//      // Disabling the button while the chart is drawing.
//
//   scope.$on('stateChange', function(e, state){
//      chart.draw(data, options);
//      var newValue = 1000 - data.getValue(0, 1);
//      data.setValue(0, 1, newValue);
//      drawChart();
//    });
//
// });
// };
// });
  // function link(scope, el, attr) {
  //   var sel = d3.select(el[0]);
  //   var w, h;
  //
  //   scope.$watch(function() {
  //     return w = sel.node().clientWidth, h = sel.node().clientHeight, w + h;
  //   }, function() {
  //     scope.width = w, scope.height = h;
  //     sel.style('line-height', h + 'px');
  //   });
  //
  //   scope.$on('stateChange', function(e, state) {
  //     sel.append('span').text(state.text).style('position', 'absolute')
  //       .style('color', state.color)
  //       .style('opacity', 0)
  //       .transition()
  //       .duration(2000)
  //       .ease('cubic-in')
  //       .style('opacity', 1)
  //       .styleTween('left', function() { return d3.interpolate(attr.step1 || '90%', attr.step2 || '80%');})
  //       .transition()
  //       .duration(15000)
  //       .ease('linear')
  //       .styleTween('left', function() { return d3.interpolate(attr.step2 || '80%', '10%'); })
  //       .remove();
  //   });
  // }
  // return {
  //   link: link, restrict: 'C'
  // };
