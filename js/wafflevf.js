
  var dataw1;
  var dataw2;
  var totalWaf;
  var family = ["A","B","C","D","E","F","G","H","I"];
  var total = 0;
  var changew = false;
  var comarcaux = "";

  var waffleTotAjax = function(name,comarca,year1,year2) {

      $(function () {
          $.ajax({
              url: name+'.php',                  //the script to call to get data
              data: {'param': comarca, 'param2' : year1, 'param3': year2},
              //Cambiar a type: POST si necesario
              type: "GET",
              // Formato de datos que se espera en la respuesta
              dataType: 'json',                //data format
              success: function(data)          //on recieve of reply
              {
                  totalWaf = data[0].QUANTITAT;

              }
          });
      });
      return totalWaf;
  };

  var waffleAjax = function(name,comarca,year1,year2,families) {
      if(comarca != comarcaux) {
          comarcaux = comarca;
          changew = true;
      }
      else changew =false;
    family = families
    $(function () {
        $.ajax({                                      
          url: name+'.php',                  //the script to call to get data          
          data: {'param': comarca, 'param2' : year1, 'param3': year2, 'param4': family},
          //Cambiar a type: POST si necesario
          type: "GET",
          // Formato de datos que se espera en la respuesta
          dataType: 'json',                //data format      
          success: function(data)          //on recieve of reply
          {
            dataw1 = data;

            } 
        });
    });
    return dataw1;
  };

    var waffleDraw = function() {
    var color = d3.scale.category20();

    //var total = dataw1.forEach(function(d) { return +d.QUANTITAT});
    if(changew) {
        total = 0;
        var domain2 = dataw1.map(function(el) {
            total += +el.QUANTITAT;
            return {
                name: el.MACROFAMILIA,
                value: el.QUANTITAT,
            };
        });
        changew = false;
    }
    var kilostotal = 0;
    var domain = dataw1.map(function(el) {
        kilostotal += +el.QUANTITAT;
        return {
            name: el.MACROFAMILIA,
            value: el.QUANTITAT/totalWaf*100,
        };
    });


    var domainw1 = ["A", "B","C", "D", "E", "F","G", "H", "I", "J"];
    var range = ["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a","#d62728", "#ff9896", "#9467bd", "#c5b0d5"];
    var color = d3.scale.ordinal().domain(domainw1).range(range);

    var chart4 = d3waffle()
                    .rows(10)
                    .colorscale(color)
                    .appearancetimes(function(d, i){ return i*10 + Math.random()*250;})
                    .height(170);
    d3.select("#chartwf-1")
      .datum(domain)
      .call(chart4);



    $( "#numkilos" ).val((Math.round(kilostotal * 100) / 100).toLocaleString() + " Kg");

  };

var waffle2Ajax = function(name,year1,year2,comarca) {
    $(function () {
        $.ajax({      
          url: name+'.php',                  //the script to call to get data          
          data: {'param' : year1, 'param2': year2, 'param3': comarca},
          //Cambiar a type: POST si necesario
          type: "GET",
          // Formato de datos que se espera en la respuesta
          dataType: 'json',                //data format                                      
          success: function(data)          //on recieve of reply
          {
              dataw2 = data;

            } 
        });
    });
    return dataw2;
  };


  var waffle2Draw = function() {
    var color = d3.scale.category20();
    var domain = ["Total", "A", "B","Arròs,pasta,sucre,llegums", "Conserves i plats preparats", "Fruites i verdures fresques","Olis i greixos",  "Carn,peix,embotits", "Begudes i infusions", "Congelats"];
    
    var total1 = 555859393;


    var totalp = 0;
    var pers = 0;
    var domain = dataw2.map(function(el) {
        totalp = el.quantitat;
        if(el.quantitat <8000000) pers = 8000000/total1*100;
        else pers = el.quantitat/total1*100;
      return {
          name: "Persones",
          value: pers,
        };
      });


    var range = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6","#b82e2e", "#dd4477", "#66aa00", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
    var palette =  d3.scale.ordinal().domain(domain).range(color);
    var chart4 = d3waffle()
                    .rows(5)
                    .scale(1/2)
                    .icon("&#xf183;")
                    .adjust(0.375)
                    .colorscale(d3.scale.category10())
                    .appearancetimes(function(d, i){
                      mod = 13;
                      val = i % mod;
                      return val / mod * 150;
                    })
                    .height(250);
    d3.select("#chartwf-2")
      .datum(domain)
      .call(chart4);

      $( "#numpers" ).val((Math.round(totalp * 100) / 100).toLocaleString() + " Persones");
  };

waffleTotAjax("waffle","comarcas_year_food",year1index,year2index);
waffleAjax("waffle2","comarcas_year_food",year1index,year2index);


setTimeout(function(){
    waffleDraw();
},500);

waffle2Ajax("wafflePersones",year1index,year2index);


setTimeout(function(){
    waffle2Draw();
},500);

