
  var dataw1;
  var parseDate = d3.timeParse("%Y");
  var total;

  var waffleAjax = function(name,year) {
    $(function () {
        $.ajax({                                      
          url: name+'.php',                  //the script to call to get data          
          data: {'param' : year},
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
          //var domain = ["Total", "Làctics i derivats", "Farines i derivats","Arròs,pasta,sucre,llegums", "Conserves i plats preparats", "Fruites i verdures fresques","Olis i greixos",  "Carn,peix,embotits", "Begudes i infusions", "Congelats"];
    var domain = ["Total", "A", "B","Arròs,pasta,sucre,llegums", "Conserves i plats preparats", "Fruites i verdures fresques","Olis i greixos",  "Carn,peix,embotits", "Begudes i infusions", "Congelats"];
    
    var domain = dataw1.map(function(el) { 
      return {
          name: el.MACROFAMILIA,
          value: el.QUANTITAT/10000,
        };
      });

    var range = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6","#b82e2e", "#dd4477", "#66aa00", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
          //var palette = d3.scale.ordinal().domain(domain).range(range);
    var palette =  d3.scale.ordinal().domain(domain).range(color);
    var chart4 = d3waffle()
                    .rows(10)
                    .appearancetimes(function(d, i){ return i*10 + Math.random()*250;})
                    .height(170);
    d3.select("#chartwf-1")
      .datum(domain)
      .call(chart4); 
  };


waffleAjax("waffle");


setTimeout(function(){
    waffleDraw();
},500);