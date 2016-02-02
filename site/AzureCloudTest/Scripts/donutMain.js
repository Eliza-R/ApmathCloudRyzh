var salesData = [
	{ label: "Basic", color: "#3366CC" },
	{ label: "Plus", color: "#DC3912" },
	{ label: "Lite", color: "#FF9900" },
	{label:"Elite", color:"#109618"},
	{label:"Delux", color:"#990099"}
];

var svg = d3.select("body").append("svg").attr("width", 700).attr("height", 300);
var dataLocal;
svg.append("g").attr("id", "salesDonut");
//svg.append("g").attr("id","quotesDonut");

Donut3D.draw("salesDonut", getData(), 150, 150, 130, 100, 30, 0.4);
//Donut3D.draw("quotesDonut", randomData(), 450, 150, 130, 100, 30, 0);

function changeData() {
    Donut3D.transition("salesDonut", getData(), 130, 100, 30, 0.4);
    //Donut3D.transition("quotesDonut", randomData(), 130, 100, 30, 0);
}

function randomData() {
    return salesData.map(function (d) {
        return { label: d.label, value: 1000 * Math.random(), color: d.color };
    });
}

function getData() {
    $.get("/Home/GetData", data => {
        var json = JSON.stringify(data)
        dataLocal = JSON.parse(json);
        var year = dataLocal.years[1];
        var grades = year.grades;
        var sumMarks = 0;
        var numMarks = 0;
        for (var years in dataLocal) {
            console.log(years + ": " + dataLocal[years])
        }
        for (var i = 0; i < grades.length; ++i) {
            for (var j = 0; j < grades[i].marks.length; ++j) {
                sumMarks += grades[i].marks[j];
                ++numMarks;
            }
        }
        
        return salesData.map(function (d) {
            return { label: d.label, value: 0.2 * 1000, color: d.color };
        })
    }, "json")
}
