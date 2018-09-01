function d3waffle() {
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      icon = "&#9632;",
      scale = 1,
      rows = 10,
      adjust = 0.8,
      colorscale = d3.scale.category20(),
      appearancetimes = function(d, i){ return 500; },
      height = 200,
      magic_padding = 5;

    var domainwf1 = ["A", "B","C", "D", "H","G","F","E","Persones"];
    var rangef = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a","#d62728", "#ff9896", "#1f77b4"]//"#9467bd", "#c5b0d5"];
    var colorwf = d3.scale.ordinal().domain(domainwf1).range(rangef);

  function chart(selection) {
    
    selection.each(function(data) {

      selection.selectAll("*").remove();
  
      /* setting parameters and data */
      var idcontainer = this.id; 
      var total = d3.sum(data, function(d) { return d.value; });

      /* updating data */
      data.forEach(function(d, i){
        data[i].class = slugify(d.name);
        data[i].scalevalue = Math.round(data[i].value*scale);
        data[i].percent = data[i].value/total;
      });

      var totalscales = d3.sum(data, function(d){ return d.scalevalue; })
      var cols = Math.ceil(totalscales/rows);
      var griddata = cartesianprod(d3.range(cols), d3.range(rows));
      var detaildata = [];

      data.forEach(function(d){
        d3.range(d.scalevalue).forEach(function(e){
          detaildata.push({ name: d.name, class: d.class })
        });
      });


      detaildata.forEach(function(d, i){
          detaildata[i].col = griddata[i][0];
          detaildata[i].row = griddata[i][1];
        
      })

      /*console.log("detail data length: ", detaildata.length)*/
      
      var gridSize = ((height - margin.top - margin.bottom) / rows)

      /* setting the container */
      var svg = selection.append("svg")
            .attr("width",  "100%")
            .attr("height", height + "px")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .style("cursor", "default");

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

      var nodes = svg.selectAll(".node")
            .data(detaildata)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + (d.col)*gridSize + "," + (rows - d.row - 1)*gridSize  + ")"; });

      /* this is necesary, when the icons are small/thin activate mouseout */
      nodes.append("text")
            .style("opacity", 0)
            .html(icon)
            .attr('class', function(d){ return d.class; })
            .attr('font-family', 'FontAwesome')
            .attr("transform", function(d) { return "translate(" + gridSize/2 + "," + 5/6*gridSize  + ")"; })
            .style("text-anchor", "middle")
            .style('fill', function(d){ return colorwf(d.name); })
            .style("font-size", function(d) {
              val = 9;
              val2 = 2.5;
              textsize = Math.min(val2 * gridSize, (val2 * gridSize - val) / this.getComputedTextLength() * val);
              return textsize * adjust + "px";
            })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove)
            .transition()
            .duration(appearancetimes)
            .style("opacity", 1);

      nodes.append("rect")
            .style("fill", "white")
            .attr('class', function(d){ return d.class; })
            .style("stroke", "gray")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove)
            .style("opacity", 0)

      var legend = svg.selectAll('.legend')
          .data(data)
          .enter().append('g')
          .attr('class', function(d){ return "legend" + " " + d.class; })
          .attr("transform", function(d) { return "translate(" + (13*gridSize + magic_padding) + "," + magic_padding + ")"; })
        
      legend.append('text')
            .attr('x', gridSize)
            .attr('y', function(d, i){ return i * gridSize + i * magic_padding / 2;})
            .style("opacity", 1)
            .html(function(d){ return icon; })
            .attr('class', function(d){ return d.class; })
            .attr('font-family', 'FontAwesome')
            .style('fill', function(d){ return colorwf(d.name); })
            /*.style("font-size", function(d) {
              val = 9;
              val2 = 2.5;
              textsize = Math.min(val2 * gridSize, (val2 * gridSize - val) / this.getComputedTextLength() * val);
              return textsize * adjust + "px";
            });*/

      legend.append('text')
            .attr('x', 1.5*gridSize + magic_padding)
            .attr('y', function(d, i){ return i * gridSize + i * magic_padding / 2;})
            .style("opacity", 1)
            .html(function(d){ return changelegend(d.name); })
            .attr('class', function(d){ return "waffle-legend-text" + " " + d.class; })

      function mouseover(d){
        tooltip.transition().duration(100).style("opacity", .9);
        el = data.filter(function(e){ return e.name == d.name})[0]
        txt = "<b>" + changelegend(el.name) + "</b><br>" + "(" + d3.format(".0%")(el.percent) + ")"
        tooltip.html(txt);

        d3.select("#" + idcontainer).selectAll("text").transition().duration(100).style("opacity", 0.2);
        d3.select("#" + idcontainer).selectAll("text." + d.class).transition().duration(100).style("opacity", 1);
      }

      function mouseout(d){
        tooltip.transition().duration(100).style("opacity", 0);
        d3.select("#" + idcontainer).selectAll("text").transition().duration(100).style("opacity", 1);
      }

      function mousemove(d){
        tooltip
            .style("left", (d3.event.pageX + 0 ) + "px")
            .style("top", (d3.event.pageY + - 70) + "px");
      }

    });
  }

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.rows = function(_) {
    if (!arguments.length) return rows;
    rows = _;
    return chart;
  };

  chart.icon = function(_) {
    if (!arguments.length) return icon;
    icon = _;
    return chart;
  };

  chart.scale = function(_) {
    if (!arguments.length) return scale;
    scale = _;
    return chart;
  };

  chart.colorscale = function(_) {
    if (!arguments.length) return colorscale;
    colorscale = _;
    return chart;
  };

chart.appearancetimes = function(_) {
    if (!arguments.length) return appearancetimes;
    appearancetimes = _;
    return chart;
  };

chart.adjust = function(_) {
    if (!arguments.length) return adjust;
    adjust = _;
    return chart;
  };

  return chart;

}

function changelegend(text) {
  if (text == "A") return "Làctics i derivats";
  else if (text == "B") return "Farines i derivats";
  else if (text == "C") return "Arròs, pasta, sucre i llegums";
  else if (text == "D") return "Conserves i plats preparats";
  else if (text == "E") return "Olis i greixos";
  else if (text == "F") return "Carn, peix i embotits";
  else if (text == "G") return "Begudes i infusions";
  else if (text == "H") return "Fruites i verdures fresques";
  else if (text == "Persones") return "100 persones";
  else return text;
}
function slugify(text){
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .trim();                        // Trim - from end of text
}

/* http://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript */
function cartesianprod(paramArray) {

  function addTo(curr, args) {

    var i, copy, 
        rest = args.slice(1),
        last = !rest.length,
        result = [];

    for (i = 0; i < args[0].length; i++) {

      copy = curr.slice();
      copy.push(args[0][i]);

      if (last) {
        result.push(copy);

      } else {
        result = result.concat(addTo(copy, rest));
      }
    }

    return result;
  }


  return addTo([], Array.prototype.slice.call(arguments));
}