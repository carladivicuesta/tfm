$(function() {
        var parseDate = d3.timeParse("%Y");

        var data = [
          { "name": "Total", "value": 10}
        ]
        d3.csv("dades/join2.csv", function(error, data)
        {
          //total
          total = d3.sum(data,function(d) { return d.total; });
          totalA = d3.sum(data, function(d) { return d.A; });
          totalB = d3.sum(data, function(d) { return d.B; });
          tot = total - totalA - totalB;
          //value of a square
          squareValueA = totalA / total * 100;
          squareValueB = totalA / total * 100;
          var color = d3.scale.category20();
          //var domain = ["Total", "Làctics i derivats", "Farines i derivats","Arròs,pasta,sucre,llegums", "Conserves i plats preparats", "Fruites i verdures fresques","Olis i greixos",  "Carn,peix,embotits", "Begudes i infusions", "Congelats"];
          var domain = ["Total", "A", "B","Arròs,pasta,sucre,llegums", "Conserves i plats preparats", "Fruites i verdures fresques","Olis i greixos",  "Carn,peix,embotits", "Begudes i infusions", "Congelats"];
          
          color.domain(d3.keys(data[0]).filter(function(key) { return key !== "DATA"; }));

          data.forEach(function(d) {
              //d.DATA = d.DATA.substring(0,7);
              d.DATA = parseDate(d.DATA);
            });
          console.log("data0json",data);
          var data2 = color.domain().map(function(name) {
              if (name=="total") return {
                  name: "Altres",
                  value: tot/total*100,
                };
              return {
                name: name,
                value: d3.sum(data, function(d) { return d[name]; })/total*100,
              };
            });
          console.log("data1json",data2);

          var data2old = [
            { "name": "Total", "value": 0},
            { "name": "Làctics i derivats", "value": 10},
            { "name": "Farines i derivats", "value": 20},
            { "name": "Arròs,pasta,sucre,llegums", "value": 35},
            { "name": "Conserves i plats preparats", "value": 10},
            { "name": "Fruites i verdures fresques", "value": 10},
            { "name": "Olis i greixos", "value": 10},
            { "name": "Carn,peix,embotits", "value": 5},
            { "name": "Begudes i infusions", "value": 5},
            { "name": "Congelats", "value": 5}
          ]
          /* to color elements we use the class name ( slugigy(name) ) */
          var domain = data2.map(function(d){ return slugify(d.name); })
          var range = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6","#b82e2e", "#dd4477", "#66aa00", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
          //var palette = d3.scale.ordinal().domain(domain).range(range);
          var palette =  d3.scale.ordinal().domain(domain).range(color);
          var chart4 = d3waffle()
                          .rows(10)
                          //.colorscale(palette)
                          .appearancetimes(function(d, i){ return i*10 + Math.random()*250;})
                          .height(170);
          d3.select("#chartw-1")
            .datum(data2)
            .call(chart4); 
        });

        var chart3 = d3waffle()
                        .rows(2)
                        .scale(1/4)
                        .icon("&#xf183;")
                        //.icon("&#xf1b9;")
                        .adjust(0.425)
                        .colorscale(d3.scale.category10())
                        .appearancetimes(function(d, i){
                          mod = 13;
                          val = i % mod;
                          return val / mod * 1500;
                        })
                        .height(200);
        d3.select("#chartw-2")
          .datum(data)
          .call(chart3); 
    
      });
      
      // verd #109618