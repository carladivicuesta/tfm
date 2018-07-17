var width2  = 500,
    height2 = 250;

var projection2 = d3.geoMercator();

/* The scale */
      // Llegenda, cal veure com fer que surtin numeros rodons (1000, 1500...)
      var colorScale2 = d3.scaleQuantize()
        .domain([0, 200000 ])
        .range(colorbrewer.Blues[9]);

      var colorLegend2 = d3.legendColor()
        .labelFormat(d3.format(".0f"))
        .scale(colorScale2)
        .shapePadding(1)
        .shapeWidth(20)
        .shapeHeight(12)
        .labelOffset(10)
        .labelAlign("end");

var path2 = d3.geoPath()
    .projection(projection2);

var svg2 = d3.select("#chart-map2").append("svg")
    .attr("width", width2)
    .attr("height", height2);

d3.json("mapes/comarques.json", function(error, cat) {
  if (error) throw error;

  var provincies = topojson.feature(cat, cat.objects.com);

  // automatic center and scale (see http://bl.ocks.org/mbostock/4707858)
  projection2
      .scale(1)
      .translate([0, 0]);  

  var b = path2.bounds(provincies),
      s = .95 / Math.max((b[1][0] - b[0][0]) / width2, (b[1][1] - b[0][1]) / height2),
      t = [(width2 - s * (b[1][0] + b[0][0])) / 2, (height2 - s * (b[1][1] + b[0][1])) / 2];

  projection2
      .scale(s)
      .translate(t);

  var map2 = svg2.append('g').attr('class', 'boundary');
        myMap2 = map2.selectAll('path').data(provincies.features);

        //Enter
        myMap2.enter()
            .append('path')
            .attr('d', path2)
            .style("stroke", "#000")
            .style("stroke-width", "1")
            .attr("fill","#08519c")
            .attr("transform","translate(-100)");

        var mylegend2 = svg2.append('g').attr("transform","translate(300,90)")
        mylegend2.call(colorLegend2);

});
