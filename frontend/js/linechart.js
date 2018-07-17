
var margin = {top: 10, right: 10, bottom: 100, left: 40},
    margin2 = {top: 430, right: 10, bottom: 20, left: 40},
    widthl = 800 - margin.left - margin.right,
    heightl = 500 - margin.top - margin.bottom,
    heightl2 = 500 - margin2.top - margin2.bottom;
 
var color = d3.scaleOrdinal(d3.schemeCategory10);
 
var parseDate = d3.timeParse("%Y");
//var parseDate = d3.timeParse("%Y-%m");
 
var x = d3.scaleTime().range([0, widthl]),
    x2 = d3.scaleTime().range([0, widthl]),
    y = d3.scaleLinear().range([heightl2, 0]),
    y2 = d3.scaleLinear().range([heightl, 0]);
 

var xAxis = d3.axisBottom(x),//.tickFormat(d3.timeFormat("%Y")[1]),
    xAxis2 = d3.axisBottom(x2),//.tickFormat(d3.timeFormat("%Y")[1]),
    yAxis = d3.axisLeft(y),
    yAxis2 = d3.axisLeft(y2);
 
var brush = d3.brushX()
    .on("brush", brush);


var line = d3.line()
    //.curve(d3.curveBasis)
    .defined(function(d) { return !isNaN(d.quantitat); })
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.quantitat); });
 
var line2 = d3.line()
    .defined(function(d) { return !isNaN(d.quantitat); })
    .x(function(d) {return x2(d.date); })
    .y(function(d) {return y2(d.quantitat); });

var svgl = d3.select("#chart-line").append("svg")
    .attr("width", widthl + margin.left + margin.right)
    .attr("height", heightl + margin.top + margin.bottom);
 
svgl.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", widthl)
    .attr("height", heightl);
 
var focus = svgl.append("g")
  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
      
var context = svgl.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("dades/join2.csv", function(error, data) {
 
  color.domain(d3.keys(data[0]).filter(function(key) { return (key !== "DATA" && key !="total"); }));
  
    data.forEach(function(d) {
      //d.DATA = d.DATA.substring(0,7);
      d.DATA = parseDate(d.DATA);
    });
 
  var sources = color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {date: d.DATA, quantitat: +d[name]/1000};
        })
      };
    });
 
    x.domain(d3.extent(data, function(d) { return d.DATA; }));
    y.domain([0, d3.max(sources, function(c) { return d3.max(c.values, function(v) { return v.quantitat; }); }) ]);
    //y.domain([d3.min(sources, function(c) { return d3.min(c.values, function(v) { return v.quantitat; }); }),
             // d3.max(sources, function(c) { return d3.max(c.values, function(v) { return v.quantitat; }); }) ]);
    x2.domain(x.domain());
    y2.domain(y.domain());
    
    var focuslineGroups = focus.selectAll("g")
        .data(sources)
      .enter().append("g");
      
    var focuslines = focuslineGroups.append("path")
        .attr("class","line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) {return color(d.name);})
        .attr("clip-path", "url(#clip)");
    
    focus.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightl2 + ")")
        .call(xAxis);
 
    focus.append("g")
        .attr("class", "y axis")
        .call(yAxis);
        
    var contextlineGroups = context.selectAll("g")
        .data(sources)
      .enter().append("g");
    
    var contextLines = contextlineGroups.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line2(d.values); })
        .style("stroke", function(d) {return color(d.name);})
        .attr("clip-path", "url(#clip)");
 
    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightl + ")")
        .call(xAxis2);

    context.append("g")
      .attr("class", "y axis")
      .call(yAxis2);
 
    context.append("g")
        .attr("class", "x brush")
        .call(brush)
      .selectAll("rect")
        .attr("y", -6)
        .attr("height", heightl + 7);
        
        
});
 
function brush() {
  if (!d3.event.sourceEvent) return; // Only transition after input.
  if (!d3.event.selection) return; 
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.selectAll("path.line").attr("d",  function(d) {return line(d.values)});
  focus.select(".x.axis").call(xAxis);
  focus.select(".y.axis").call(yAxis);
}

