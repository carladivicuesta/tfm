$(function() {
        var chart = d3waffle();
        d3.select("#container-1")
          .datum(data)
          .call(chart);
        var chart2 = d3waffle()
                      .rows(6)
                      .scale(0.5)
                      .height(100);
        d3.select("#container-2")
          .datum(data)
          .call(chart2);
        var chart3 = d3waffle()
                        .rows(5)
                        .scale(1/4)
                        .icon("&#xf1b9;")
                        .adjust(0.425)
                        .colorscale(d3.scale.category10())
                        .appearancetimes(function(d, i){
                          mod = 13;
                          val = i % mod;
                          return val / mod * 1500;
                        })
                        .height(200);
        d3.select("#container-3")
          .datum(data)
          .call(chart3);
        var data2 = [
          { "name": "Mortgage ($84,911)", "value": 84911},
          { "name": "Auto and\ntuition loans ($14,414)", "value": 14414},
          { "name": "Home equity loans ($10,062)", "value": 10062},
          { "name": "Credit Cards ($8,565)", "value": 8565}
        ]
        /* to color elements we use the class name ( slugigy(name) ) */
        var domain = data2.map(function(d){ return slugify(d.name); })
        var range = ["#c7d4b6", "#a3aabd", "#a0d0de", "#97b5cf"]
        var palette = d3.scale.ordinal().domain(domain).range(range);
        var chart4 = d3waffle()
                        .rows(7)
                        .scale(1/392/2)
                        .colorscale(palette)
                        .appearancetimes(function(d, i){ return i*10 + Math.random()*250;})
                        .height(120);
        d3.select("#container-4")
          .datum(data2)
          .call(chart4);        
      });
      var data = [
        { "name": "type 1", "value": 102},
        { "name": "type 2", "value": 65},
        { "name": "type 3", "value": 43},
        { "name": "type 4", "value": 12}
      ];