
var datal1;
  var parseDate = d3.timeParse("%Y");
  var total;
  var family = ["A","B","C","D","E","F","G","H","I"];
  var changeline = false;
  var comarcaline = "";

  var linechartAjax = function(name,comarca,families) {
      family = families;
    if(!comarca.includes("comarcas")) {
        changeline = true;
        comarcaline = comarca;
    }
    else changeline = false;
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
            }
        });
    });
  };

var linechartDraw = function() {
    var margin = {top: 10, right: 20, bottom: 20, left: 80},
        margin2 = {top: 430, right: 20, bottom: 20, left: 40},
        widthl = 1100 - margin.left - margin.right,
        heightl = 500 - margin.top - margin.bottom,
        heightl2 = 500 - margin2.top - margin2.bottom;

    var domainw1 = ["A", "B","C", "D", "H","G","F","E"];
    var range = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a","#d62728", "#ff9896", "#9467bd", "#c5b0d5"];
    var color = d3.scale.ordinal().domain(domainw1).range(range);

    var parseDate = d3.timeParse("%Y");
    var bisectDate = d3.bisector(function(d) { return d.year; }).left;
    //var parseDate = d3.timeParse("%Y-%m");
     
    var x = d3.scaleTime().range([0, widthl]),
        x2 = d3.scaleTime().range([0, widthl]),
        y = d3.scaleLinear().range([heightl2, 0]),
        y2 = d3.scaleLinear().range([heightl, 0]);
     

    var xAxis = d3.axisBottom(x),//.tickFormat(d3.timeFormat("%Y")[1]),
        xAxis2 = d3.axisBottom(x2),//.ticks(d3.time.years, 1).tickFormat(d3.timeFormat("%Y")[1]),
        yAxis = d3.axisLeft(y),
        yAxis2 = d3.axisLeft(y2);


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


    var focus = context.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", heightl);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", widthl)
        .attr("x2", widthl);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");



    var contextLines = contextlineGroups.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line2(d.values); })
            .style("stroke", function(d) {return color(d.key);})
            .style("stroke-width", "2px")
            .attr("clip-path", "url(#clip)");

    var tooltip = d3.select("body")
        .append("div")
        .attr("class", "waffle-tooltip")
        .style("position", "absolute")
        .style("text-align", "right")
        .style("background", "#333")
        .style("margin", "3px")
        .style("color","white")
        .style("padding","3px")
        .style("border","0px")
        .style("border-radius","3px") // 3px rule
        .style("opacity",0)
        .style("cursor", "default");

    function mouseover(d){

        tooltip.transition().duration(100).style("opacity", .9);
        var num = Math.round(+d.QUANTITAT * 100)/100;
        num = num.toLocaleString();
        txt = "<b>" + num + " Kg</b><br>"
        tooltip.html(txt);
        var idcontainer = d.YEARS.getYear() + d.MACROFAMILIA;
        d3.select("#" + idcontainer).selectAll("text").transition().duration(100).style("opacity", 0.2);
        d3.select("#" + idcontainer).selectAll("text." + d.class).transition().duration(100).style("opacity", 1);
    }

    function mouseout(d){
        var idcontainer = d.YEARS.getYear() + d.MACROFAMILIA;
        tooltip.transition().duration(100).style("opacity", 0);
        d3.select("#" + idcontainer).selectAll("text").transition().duration(100).style("opacity", 1);
    }

    function mousemove(d){
        tooltip
            .style("left", (d3.event.pageX + 0 ) + "px")
            .style("top", (d3.event.pageY + - 30) + "px");
//old
        /*
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(datal1, x0, 1),
            d0 = datal1[i - 1],
            d1 = datal1[i];
            //d = x0 - d0.YEARS > d1.YEARS - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.YEARS) + "," + y(d.QUANTITAT) + ")");
        focus.select("text").text(function() { return d.QUANTITAT; });
        focus.select(".x-hover-line").attr("y2", height - y(d.QUANTITAT));
        focus.select(".y-hover-line").attr("x2", width + width);*/
    }


    contextlineGroups.selectAll("dot")
        .data(datal1)
        .enter().append("circle")
        .attr("r", 3)
        .attr("id",function(d) {return d.YEARS.getYear() + d.MACROFAMILIA;})
        .style("stroke", function(d) {return color(d.MACROFAMILIA);})
        .style("fill",function(d) {return color(d.MACROFAMILIA);})
        .attr("cx", function(d) { return x(d.YEARS); })
        .attr("cy", function(d) { return y2(+d.QUANTITAT); })
        .on("mouseover", mouseover)// function() { focus.style("display", null); })
        .on("mouseout", mouseout)//function() { focus.style("display", "none"); })
        .on("mousemove", mousemove)
        .append("text");
     
        context.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + heightl + ")")
            .call(xAxis2);

        context.append("g")
          .attr("class", "y axis")
          .call(yAxis2);
     
        context.append("g")
          .selectAll("rect")
            .attr("y", -6)
            .attr("height", heightl + 7);



}
 


linechartAjax("linechart","comarcas_year_food",family);


setTimeout(function(){
    linechartDraw();
},500);
 
