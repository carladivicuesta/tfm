var width  = 500,
    height = 250;

var projection = d3.geoMercator();

/* The scale */

      // Llegenda, cal veure com fer que surtin numeros rodons (1000, 1500...)
      var colorScale = d3.scaleQuantize()
        .domain([0, 200000 ])
        .range(colorbrewer.Blues[9]);

      colorScale.nice();

      var colorLegend = d3.legendColor()
        .labelFormat(d3.format(".0f"))
        .scale(colorScale)
        .shapePadding(1)
        .shapeWidth(20)
        .shapeHeight(12)
        .labelOffset(10)
        .labelAlign("end");

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("#chart-map1").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("mapes/comarques.json", function(error, cat) {
  if (error) throw error;

  var comarques = topojson.feature(cat, cat.objects.com);

  // automatic center and scale (see http://bl.ocks.org/mbostock/4707858)
  projection
      .scale(1)
      .translate([0, 0]);  

  var b = path.bounds(comarques),
      s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  projection
      .scale(s)
      .translate(t);


  var map = svg.append('g').attr('class', 'boundary');
        myMap = map.selectAll('path').data(comarques.features);

        //Enter
        myMap.enter()
            .append('path')
            .attr('d', path)
            .style("stroke", "#000")
            .style("stroke-width", "1")
            .attr("fill","#08519c")
            .attr("transform","translate(-100)")
            .on("click", function(){
             // changemap1()
           });

        var mylegend = svg.append('g').attr("transform","translate(300,90)")
        mylegend.call(colorLegend);

  // Funció per canviar de mapa, no funciona 
  function changemap1(d) {
    myMap = myMap.data(topojson.feature(cat, cat.objects.com).features);
    myMap.enter().append("path")
    .attr("d", path)
    .exit().remove();
  }

});
