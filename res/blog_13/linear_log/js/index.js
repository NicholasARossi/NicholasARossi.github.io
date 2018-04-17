

/* global d3, document */
var chart = {
    margin: { top: 40, right: 25, bottom: 150, left: 25 },

    animationDuration: 400,

    scales: {
        power2: d3.scalePow().exponent(2),
        linear: d3.scaleLinear(),
        sqrt:   d3.scalePow().exponent(0.5),
        log2:   d3.scaleLog().base(2),
        log10:  d3.scaleLog().base(10)
    },

    init: function (container, data) {
        this.el = d3.select(".js-chart")
            .attr("width", container.width)
            .attr("height", container.height);

        this.width  = container.width - this.margin.left - this.margin.right;
        this.height = container.height - this.margin.top - this.margin.bottom;

        this.adaptScales();
        this.setXScale();
        this.draw(data);

        d3.selectAll(".js-chart-container input").on("click", this.changeXScale.bind(this));
    },

    draw: function (data) {
        var mainGroup, series;

        mainGroup = this.el.append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

        series = mainGroup.selectAll(".series").data(data)
            .enter().append("g")
                .attr("class", function (d) { return "series " + d.name; });

        this.points = series.selectAll(".point").data(function (d) { return d.points; })
            .enter().append("circle")
                .attr("class", "point")
                .attr("cx", this.xScale)
                .attr("cy",  this.height / 2)
                .style("stroke", "grey")
                .style("opacity",0.5)
                .attr("r", 6);

        this.points.append("title")
           .text(String);

        this.xAxis = d3.axisBottom()
            .scale(this.xScale);

        this.domXAxis = mainGroup.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);
    },

    redraw: function () {
        this.domXAxis.transition()
            .duration(this.animationDuration)
            .call(this.xAxis.scale(this.xScale));
        this.points.transition()
            .duration(this.animationDuration)
            .attr("cx", this.xScale);
    },

    adaptScales: function () {
        Object.keys(this.scales).forEach(function (scaleType) {
            this.scales[scaleType]
                .domain([1, 1000])
                .range([0, this.width]);
        }, this);
    },

    changeXScale: function () {
        this.setXScale();
        this.redraw();
    },

    setXScale: function () {
        var scaleType;

        scaleType = d3.select(".js-chart-container input:checked").node().value;
        this.xScale = this.scales[scaleType];
    }
};

var container = {
    width: document.querySelector(".js-chart-container").clientWidth,
    height: 300
};

var data = [
    {
        name: "linear",
        points: [157.64409075,   404.10610786,   635.90976176,    62.39350827,
         910.91952208,   762.50630822,   363.8858648 ,   387.48737252,
         248.36123969,   762.92552501,   248.01630652,   660.78505497,
         696.94524745,   693.37456326,   801.7197676 ,   471.36071973,
         529.07491709,   247.83888841,   330.07036   ,   350.46320761,
         351.75484789,   608.17066077,   280.97836968,   702.47057145,
         397.15953018,   364.95502899,   364.87123049,   223.51010144,
         468.64116624,   482.280875  ,  1083.1984392 ,   199.01438289,
         558.33710981,   655.6009351 ,   599.44381131,    28.72484331,
         187.19937178,   678.10887775,   774.85124448,   795.09641051,
         816.41696532,   517.22485091,   692.87213993,   279.99745379,
         444.55734016,   895.04869637,   658.99860204,   304.78098563,
         314.01754297,   784.94484317]
    },
    {
        name: "pow",
        points: []
    }
];

chart.init(container, data);