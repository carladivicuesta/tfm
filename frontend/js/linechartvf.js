
var datal1;
  var parseDate = d3.timeParse("%Y");
  var total;
  var family = ["A","B","C","D","E","F","G","H","I"];
  var change = false;
  var comarcaact = "";

  var linechartAjax = function(name,comarca,families) {
      family = families;
      console.log("linefam",family);
    if(!comarca.includes("comarcas")) {
        change = true;
        comarcaact = comarca;
    }
    else change = false;
    $(function () {
        $.ajax({                                      
          url: name+'.php',                  //the script to call to get data          
          data: {'param' : comarca, 'param2' : family},
          //Cambiar a type: POST si necesario
          type: "GET",                      //for example "id=5&parent=6"
          dataType: 'json',                //data format      
          success: function(data)          //on recieve of reply
          {
            datal1 = data;
            console.log("datalinec",datal1);
            } 
        });
    });
  };

var linechartDraw = function() {
    var margin = {top: 10, right: 10, bottom: 20, left: 80},
        margin2 = {top: 430, right: 10, bottom: 20, left: 40},
        widthl = 900 - margin.left - margin.right,
        heightl = 500 - margin.top - margin.bottom,
        heightl2 = 500 - margin2.top - margin2.bottom;

    var domainw1 = ["A", "B","C", "D", "H","G","F","E"];
    var range = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a","#d62728", "#ff9896", "#9467bd", "#c5b0d5"];
    var color = d3.scale.ordinal().domain(domainw1).range(range);

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
        .x(function(d) { return x(d.YEARS); })
        .y(function(d) { return y(+d.QUANTITAT); });
     
    var line2 = d3.line()
        .defined(function(d) { return !isNaN(+d.QUANTITAT); })
        .x(function(d) {return x2(d.YEARS); })
        .y(function(d) {return y2(+d.QUANTITAT); });

    var svgl = d3.select("#chart-line").append("svg")
        .attr('class', 'chartline')
        .attr("width", widthl + margin.left + margin.right)
        .attr("height", heightl + margin.top + margin.bottom);
     
    svgl.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", widthl)
        .attr("height", heightl);
     

    var context = svgl.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    datal1.forEach(function(d) {
      d.YEARS = parseDate(d.YEARS);
    });


    var sources = d3.nest()
      .key(function(d) { return d.MACROFAMILIA; })
      .entries(datal1);

        x.domain(d3.extent(datal1, function(d) { return d.YEARS; }));
        y.domain([0, d3.max(sources, function(c) { return d3.max(c.values, function(v) { return +v.QUANTITAT; }); }) ]);
        
        x2.domain(x.domain());
        y2.domain(y.domain());

            
        var contextlineGroups = context.selectAll("g")
            .data(sources)
          .enter().append("g");
        
        var contextLines = contextlineGroups.append("path")
            .attr("class", "line")
            .attr("d", function(d) { console.log(d); return line2(d.values); })
            .style("stroke", function(d) {return color(d.key);})
            .style("stroke-width", "1.5px")
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
          var year1 = d1[0].getFullYear();
          var year2 = d1[1].getFullYear()

            if(change) {
                funcajax("test2",comarcaact,year1,year2,family);
                funcMap(comarcaact+".json");

                AjaxMap2("test2",comarcaact,year1,year2,family);
                Map2(comarcaact+".json");
            }
            else {
                funcajax("test","",year1,year2,family);
                funcMap("comarques.json");

                AjaxMap2("test","",year1,year2,family);
                Map2("comarques.json");
            }

            waffleAjax("waffle2",comarcaact,year1,year2,family);

            setTimeout(function(){
                waffleDraw();
            },500);

            waffle2Ajax("wafflePersones",year1,year2);

            setTimeout(function(){
                waffle2Draw();
            },500);
        }






}
 


linechartAjax("linechart","comarcas_year_food",family);


setTimeout(function(){
    linechartDraw();
},500);
 
