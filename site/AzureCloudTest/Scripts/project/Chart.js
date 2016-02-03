var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = window.innerWidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

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
    .tickFormat(formatPercent);

var svg = d3.select("div.diagram").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function draw(error, data) {

    console.log("draw");
    data.forEach(function (d) {
        d.frequency = +d.frequency;
    });

    x.domain(data.map(function (d) { return d.letter; }));
    y.domain([0, d3.max(data, function (d) { return d.frequency; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Успеваемость");

    svg.selectAll(".bar")
          .data(data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function (d) { return x(d.letter); })
          .attr("width", x.rangeBand())
          .attr("y", function (d) { return y(d.frequency); })
          .attr("height", function (d) { return height - y(d.frequency); });


    d3.select("input").on("change", change);

    var sortTimeout = setTimeout(function () {
        d3.select("input").property("checked", true).each(change);
    }, 2000);

    function change() {
        clearTimeout(sortTimeout);

        // Copy-on-write since tweens are evaluated after a delay.
        var x0 = x.domain(data.sort(this.checked
            ? function (a, b) { return b.frequency - a.frequency; }
            : function (a, b) { return comparingGrades(a.letter, b.letter); })
            .map(function (d) { return d.letter; }))
            .copy();

        svg.selectAll(".bar")
            .sort(function (a, b) { return x0(a.letter) - x0(b.letter); });

        var transition = svg.transition().duration(750),
            delay = function (d, i) { return i * 50; };

        transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function (d) { return x0(d.letter); });

        transition.select(".x.axis")
            .call(xAxis)
          .selectAll("g")
            .delay(delay);
    }
}

function changeYear() {
    console.log("changeYear()");
    var year = document.getElementById("year").value;
    console.log(year);
    d3.tsv("/data/" + year + ".txt", function (error, data) {
        x.domain(data.map(function (d) { return d.letter; }));
        y.domain([0, d3.max(data, function (d) { return d.frequency; })]);

        var svgTr = d3.select("body").transition();

        // Make the changes
        //svg.selectAll(".bar") // change the line
        //    .duration(750)
        //    .attr("x", function(d) { return x(d.letter); })
        //    .attr("width", x.rangeBand())
        //    .attr("y", function(d) { return y(d.frequency); })
        //    .attr("height", function(d) { return height - y(d.frequency); }).data(data);






        var bar = svg.selectAll(".bar")
        .data(data, function(d) { return d.letter; });

        bar.enter().append("rect")
           .attr("class", "bar")
           .attr("x", function (d) { return x(d.letter); })
           .attr("y", function (d) { return y(d.frequency); })
           .attr("height", function (d) { return height - y(d.frequency); })
           .attr("width", x.rangeBand());
         //removed data:
        bar.exit().remove();
        // updated data:
        bar
            .transition().duration(750)
           .attr("y", function (d) { return y(d.frequency); })
           .attr("height", function (d) { return height - y(d.frequency); });
        // "x" and "width" will already be set from when the data was
        // first added from "enter()".



        //svgTr.select(".x.axis") // change the x axis
        //    .duration(750)
        //    .call(xAxis);
        svgTr.select(".y.axis") // change the y axis
            .duration(750)
            .call(yAxis);
        d3.select("input").on("change", change);

        function change() {
            //clearTimeout(sortTimeout);

            // Copy-on-write since tweens are evaluated after a delay.
            var x0 = x.domain(data.sort(this.checked
                ? function (a, b) { return b.frequency - a.frequency; }
                : function (a, b) { return comparingGrades(a.letter, b.letter); })
                .map(function (d) { return d.letter; }))
                .copy();

            svg.selectAll(".bar")
                .sort(function (a, b) { return x0(a.letter) - x0(b.letter); });

            var transition = svg.transition().duration(750),
                delay = function (d, i) { return i * 50; };

            transition.selectAll(".bar")
                .delay(delay)
                .attr("x", function (d) { return x0(d.letter); });

            transition.select(".x.axis")
                .call(xAxis)
              .selectAll("g")
                .delay(delay);
        }


    });



}
function comparingGrades(a, b) {

    function num(name) { return Number(name.match(/\d+/)); }
    function lett(name) { return String(name.match(/\D/)); }

    return (num(a) < num(b)) || ((num(a) === num(b)) && lett(a) < lett(b)) ? -1 : (num(a) > num(b)) || ((num(a) === num(b)) && lett(a) > lett(b)) ? 1 : a >= b ? 0 : NaN;
}

var year = document.getElementById("year").value;

d3.tsv("/data/" + year + ".txt", function (error, data) {
    draw(error, data);
});
//var yearTest = "2014";
//$.get("Home/GetData", { year: yearTest}, (data) => {
//    console.log(data);
//});
//$.get("Home/GetTxt", null, (data) => {
//    console.log(data);
//});
//$.get("Home/GetJson", null, (data) => {
//    console.log(data);
//});
