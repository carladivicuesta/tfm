
var datal1;
  var parseDate = d3.timeParse("%Y");
  var total;
  var family = ["A","B","C","D","E","F","G","H","I"];

  var linechartAjax = function(name,families) {
    console.log("f1",families);
    family = families
    $(function () {
        $.ajax({                                      
          url: name+'.php',                  //the script to call to get data          
          data: {'param' : families},
          //Cambiar a type: POST si necesario
          type: "GET",                      //for example "id=5&parent=6"
          dataType: 'json',                //data format      
          success: function(data)          //on recieve of reply
          {
            datal1 = data;
            console.log("Json data linechart",datal1);

            } 
        });
    });
  };

var linechartDraw = function() {
    var margin = {top: 10, right: 10, bottom: 20, left: 40},
        margin2 = {top: 430, right: 10, bottom: 20, left: 40},
        widthl = 900 - margin.left - margin.right,
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
        xAxis2 = d3.axisBottom(x2),//.ticks(d3.time.years, 1).tickFormat(d3.timeFormat("%Y")[1]),
        yAxis = d3.axisLeft(y),
        yAxis2 = d3.axisLeft(y2);
     
    var brush = d3.brushX()
        .on("brush", brush);


    var line = d3.line()
        .defined(function(d) { return !isNaN(+d.QUANTITAT); })
        .x(function(d) { return x(d.YEAR); })
        .y(function(d) { return y(+d.QUANTITAT); });
     
    var line2 = d3.line()
        .defined(function(d) { return !isNaN(+d.QUANTITAT); })
        .x(function(d) {return x2(d.YEAR); })
        .y(function(d) {return y2(+d.QUANTITAT); });

    var svgl = d3.select("#chart-line").append("svg")
        .attr("width", widthl + margin.left + margin.right)
        .attr("height", heightl + margin.top + margin.bottom);
     
    svgl.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", widthl)
        .attr("height", heightl);
     
   /* var focus = svgl.append("g")
      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
          */
    var context = svgl.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    datal1.forEach(function(d) {
      d.YEAR = parseDate(d.YEAR);
    });


    var sources = d3.nest()
      .key(function(d) { return d.MACROFAMILIA; })
      .entries(datal1);

    console.log("sources",sources);
      color.domain(Object.keys(sources));

        x.domain(d3.extent(datal1, function(d) { return d.YEAR; }));
        y.domain([0, d3.max(sources, function(c) { return d3.max(c.values, function(v) { return +v.QUANTITAT; }); }) ]);
        
        x2.domain(x.domain());
        y2.domain(y.domain());

        /*
        var focuslineGroups = focus.selectAll("g")
            .data(sources)
          .enter().append("g");
         
        var focuslines = focuslineGroups.append("path")
            .attr("class","line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) {return color(d.key);})
            .attr("clip-path", "url(#clip)");
        
        focus.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + heightl2 + ")")
            .call(xAxis);
     
        focus.append("g")
            .attr("class", "y axis")
            .call(yAxis);*/
            
        var contextlineGroups = context.selectAll("g")
            .data(sources)
          .enter().append("g");
        
        var contextLines = contextlineGroups.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line2(d.values); })
            .style("stroke", function(d) {return color(d.key);})
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

        function brush() {
          if (!d3.event.sourceEvent) return; // Only transition after input.
          if (!d3.event.selection) return; 
          if (d3.event.sourceEvent.type === "brush") return;

          var d0 = d3.event.selection.map(x2.invert),
              d1 = d0.map(d3.timeYear.round);

          // If empty when rounded, use floor instead.
          if (d1[0] >= d1[1]) {
            d1[0] = d3.timeYear.floor(d0[0]);
            d1[1] = d3.timeYear.offset(d1[0]);
          }
          d3.select(this).call(d3.event.target.move, d1.map(x2));

          //d3.select(this).call(d3.event.target.move, d1.map(x2));
          //var s = d3.event.selection || x2.range();
          //x.domain(s.map(x2.invert, x2));
          //focus.selectAll("path.line").attr("d",  function(d) {return line(d.values)});
          //focus.select(".x.axis").call(xAxis);
          //focus.select(".y.axis").call(yAxis);
          /*
              // If empty when rounded, use floor instead.
          if (d1[0] >= d1[1]) {
            d1[0] = parseDate(d0[0]);
            d1[1] = parseDate(d1[0]);
          }
          else {
            d1[0] = parseDate(d1[0]);
            d1[1] = parseDate(d1[1]);
          }
          */
          waffleAjax("waffle2",d1[0].getFullYear(),d1[1].getFullYear(),family);

          setTimeout(function(){
              waffleDraw();
          },500);
        }





}
 


linechartAjax("linechart",family);


setTimeout(function(){
    linechartDraw();
},500);
 
