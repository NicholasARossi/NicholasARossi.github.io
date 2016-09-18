 function drawExample1() {
  var options = {
    width: 400,
    height: 240,
    animation:{
      duration: 1000,
      easing: 'out'
    },
    vAxis: {minValue:0, maxValue:1000}
  };
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'N');
  data.addColumn('number', 'Value');
  data.addRow(['V', 100]);

  var chart = new google.visualization.ColumnChart(
      document.getElementById('example1-visualization'));
  var button = document.getElementById('example1-b1');

  function drawChart() {
    // Disabling the button while the chart is drawing.
    button.disabled = true;
    google.visualization.events.addListener(chart, 'ready',
        function() {
          button.disabled = false;
        });
    chart.draw(data, options);
  }

  button.onclick = function() {
    var newValue = 1000 - data.getValue(0, 1);
    data.setValue(0, 1, newValue);
    drawChart();
  }
  drawChart();
}

function drawExample2() {
  // Some raw data (not necessarily accurate)
  var rowData1 = [['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua  Guinea',
                   'Rwanda', 'Average'],
                  ['2004/05', 165, 938, 522, 998, 450, 114.6],
                  ['2005/06', 135, 1120, 599, 1268, 288, 382],
                  ['2006/07', 157, 1167, 587, 807, 397, 623],
                  ['2007/08', 139, 1110, 615, 968, 215, 409.4],
                  ['2008/09', 136, 691, 629, 1026, 366, 569.6]];
  var rowData2 = [['Month', 'Bolivia', 'Ecuador', 'Madagascar', 'Papua  Guinea',
                   'Rwanda', 'Average'],
                  ['2004/05', 122, 638, 722, 998, 450, 614.6],
                  ['2005/06', 100, 1120, 899, 1268, 288, 682],
                  ['2006/07', 183, 167, 487, 207, 397, 623],
                  ['2007/08', 200, 510, 315, 1068, 215, 609.4],
                  ['2008/09', 123, 491, 829, 826, 366, 569.6]];

  // Create and populate the data tables.
  var data = [];
  data[0] = google.visualization.arrayToDataTable(rowData1);
  data[1] = google.visualization.arrayToDataTable(rowData2);

  var options = {
    width: 400,
    height: 240,
    vAxis: {title: "Cups"},
    hAxis: {title: "Month"},
    seriesType: "bars",
    series: {5: {type: "line"}},
    animation:{
      duration: 1000,
      easing: 'out'
    }
  };
  var current = 0;
  // Create and draw the visualization.
  var chart = new google.visualization.ComboChart(document.getElementById('example2-visualization'));
  var button = document.getElementById('example2-b1');
  function drawChart() {
     // Disabling the button while the chart is drawing.
    button.disabled = true;
    google.visualization.events.addListener(chart, 'ready',
        function() {
          button.disabled = false;
          button.value = 'Switch to ' + (current ? 'Tea' : 'Coffee');
        });
    options['title'] = 'Monthly ' + (current ? 'Coffee' : 'Tea') + ' Production by Country';

    chart.draw(data[current], options);
  }
  drawChart();

  button.onclick = function() {
    current = 1 - current;
    drawChart();
  }
}

function drawExample3() {
  var options = {
    width: 400,
    height: 240,
    vAxis: {minValue:0, maxValue:100},
    animation: {
      duration: 1000,
      easing: 'in'
    }
  };

  var chart = new google.visualization.LineChart(
      document.getElementById('example3-visualization'));
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'x');
  data.addColumn('number', 'y');
  data.addRow(['100', 123]);
  data.addRow(['700', 17]);
  var button = document.getElementById('example3-b1');
  function drawChart() {
    // Disabling the button while the chart is drawing.
    button.disabled = true;
    google.visualization.events.addListener(chart, 'ready',
        function() {
          button.disabled = false;
        });
    chart.draw(data, options);
  }

  button.onclick = function() {
    if (data.getNumberOfRows() > 5) {
      data.removeRow(Math.floor(Math.random() * data.getNumberOfRows()));
    }
    // Generating a random x, y pair and inserting it so rows are sorted.
    var x = Math.floor(Math.random() * 1000);
    var y = Math.floor(Math.random() * 100);
    var where = 0;
    while (where < data.getNumberOfRows() && parseInt(data.getValue(where, 0)) < x) {
      where++;
    }
    data.insertRows(where, [[x.toString(), y]]);
    drawChart();
  }
  drawChart();
}

function drawExample4() {
  var options = {
    width: 400,
    height: 240,
    vAxis: {minValue:0, maxValue:1000},
    animation: {
      duration: 1000,
      easing: 'out'
    }
  };

  var chart = new google.visualization.ColumnChart(
      document.getElementById('example4-visualization'));
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'x');
  data.addColumn('number', 'A');
  data.addColumn('number', 'B');
  data.addRow(['A', 123, 40]);
  data.addRow(['B', 17, 20]);
  var addButton = document.getElementById('example4-b1');
  var removeButton = document.getElementById('example4-b2');
  function drawChart() {
    // Disabling the buttons while the chart is drawing.
    addButton.disabled = true;
    removeButton.disabled = true;
    google.visualization.events.addListener(chart, 'ready',
        function() {
          // Enabling only relevant buttons.
          addButton.disabled = (data.getNumberOfColumns() - 1) >= chars.length;
          removeButton.disabled = (data.getNumberOfColumns() - 1) < 2;
        });
    chart.draw(data, options);
  }
  function shuffleAndDrawChart() {
    for (var i = 0; i < data.getNumberOfRows(); ++i) {
      for (var j = 1; j < data.getNumberOfColumns(); ++j) {
        var num = Math.floor(Math.random() * 1000);
        data.setValue(i, j, num);
      }
    }
    drawChart();
  }
  addButton.onclick = function() {
    data.addColumn('number', chars[data.getNumberOfColumns() - 1]);
    shuffleAndDrawChart();
  }
  removeButton.onclick = function() {
    data.removeColumn(data.getNumberOfColumns() - 1);
    shuffleAndDrawChart();
  }
  drawChart();
}

function drawExample5() {
  var options = {
    width: 400,
    height: 240,
    animation: {
      duration: 1000,
      easing: 'in'
    },
    hAxis: {viewWindow: {min:0, max:5}}
  };

  var chart = new google.visualization.SteppedAreaChart(
      document.getElementById('example5-visualization'));
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'x');
  data.addColumn('number', 'y');
  var MAX = 10;
  for (var i = 0; i < MAX; ++i) {
    data.addRow([i.toString(), Math.floor(Math.random() * 100)]);
  }
  var prevButton = document.getElementById('example5-b1');
  var nextButton = document.getElementById('example5-b2');
  var changeZoomButton = document.getElementById('example5-b3');
  function drawChart() {
    // Disabling the button while the chart is drawing.
    prevButton.disabled = true;
    nextButton.disabled = true;
    changeZoomButton.disabled = true;
    google.visualization.events.addListener(chart, 'ready',
        function() {
          prevButton.disabled = options.hAxis.viewWindow.min <= 0;
          nextButton.disabled = options.hAxis.viewWindow.max >= MAX;
          changeZoomButton.disabled = false;
        });
    chart.draw(data, options);
  }

  prevButton.onclick = function() {
    options.hAxis.viewWindow.min -= 1;
    options.hAxis.viewWindow.max -= 1;
    drawChart();
  }
  nextButton.onclick = function() {
    options.hAxis.viewWindow.min += 1;
    options.hAxis.viewWindow.max += 1;
    drawChart();
  }
  var zoomed = false;
  changeZoomButton.onclick = function() {
    if (zoomed) {
      options.hAxis.viewWindow.min = 0;
      options.hAxis.viewWindow.max = 5;
    } else {
      options.hAxis.viewWindow.min = 0;
      options.hAxis.viewWindow.max = MAX;
    }
    zoomed = !zoomed;
    drawChart();
  }
  drawChart();
}

function init() {
  drawExample1();
  drawExample2();
  drawExample3();
  drawExample4();
  drawExample5();
}

google.load('visualization', '1.1', {packages: ['corechart']});
google.setOnLoadCallback(init);

