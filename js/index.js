var families = ["A","B","C","D","E","F","G","H","I"];
var comarcaact2 = "comarcas_year_food";
var comarca = false;
var coma;


function totalFunction() {
  // Get the checkbox
  var checkBox = document.getElementById("totalCheck");

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true){
    var x = document.getElementsByClassName("typeFamily")
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].checked = false;
    }
      families = ["A","B","C","D","E","F","G","H","I"];
      d3.select("#chart-line svg").remove();

      if(comarca) {
          funcajax("test2",comarcaact2,year1index,year2index,families);
          funcMap(comarcaact2+".json");

          AjaxMap2("test2",comarcaact2,year1index,year2index,families);
          Map2(comarcaact2+".json");
      }
      else {
          funcajax("test","",year1index,year2index,families);
          funcMap("comarques.json");

          AjaxMap2("test","",year1index,year2index,families);
          Map2("comarques.json");
      }
      linechartAjax("linechart",comarcaact2,families);
      setTimeout(function(){
          linechartDraw();
      },500);
      waffleTotAjax("waffle",comarcaact2,year1index,year2index);
      waffleAjax("waffle2",comarcaact2,year1index,year2index,families);

      setTimeout(function(){
          waffleDraw();
      },500);
  }

}

function typeFamilyFunction() {

  var x = document.getElementsByClassName("typeFamily")
  // Get the checkbox
  var checkBox = document.getElementById("totalCheck");
  var i = 0;
  var trobat = false;
  families = [];
  for (i = 0; i < x.length; i++) {
    if (x[i].checked == true){
      trobat = true;
      families.push(x[i].value);
    }
  }
  if (trobat) {
    checkBox.checked = false;
    d3.select("#chart-line svg").remove();

      if(comarca) {
          funcajax("test2",comarcaact2,year1index,year2index,families);
          funcMap(comarcaact2+".json");

          AjaxMap2("test2",comarcaact2,year1index,year2index,families);
          Map2(comarcaact2+".json");
      }
      else {
          funcajax("test","",year1index,year2index,families);
          funcMap("comarques.json");

          AjaxMap2("test","",year1index,year2index,families);
          Map2("comarques.json");
      }


    linechartAjax("linechart",comarcaact2,families);
    setTimeout(function(){
        linechartDraw();
    },500);

    waffleTotAjax("waffle",comarcaact2,year1index,year2index);
    waffleAjax("waffle2",comarcaact2,year1index,year2index,families);
    
    setTimeout(function(){
        waffleDraw();
    },500);
    
  }

  else checkBox.checked = true;
  
}

$( function() {

    $( "#slider-range" ).slider({

        orientation: "vertical",
        range: true,
        min: yearmin,
        max: yearmax,
        values: [ yearmin, yearmax ],
        slide: function( event, ui ) {
           // $( "#amount" ).val(  ui.values[ 0 ] + " - " + ui.values[ 1 ] );
            year1index = yearmax - ui.values[ 1 ] + yearmin;
            year2index = yearmax - ui.values[ 0 ] + yearmin;

            $( "#amount" ).val(year1index + " - " + year2index);
            if(comarca) {
                funcajax("test2",comarcaact2,year1index,year2index,families);
                funcMap(comarcaact2+".json");

                AjaxMap2("test2",comarcaact2,year1index,year2index,families);
                Map2(comarcaact2+".json");

                waffle2Ajax("wafflePersones",ui.values[ 0 ],ui.values[ 1 ],comarcaact2);

                setTimeout(function(){
                    waffle2Draw();
                },500);
            }
            else {
                funcajax("test","",year1index,year2index,families);
                funcMap("comarques.json");

                AjaxMap2("test","",year1index,year2index,families);
                Map2("comarques.json");

                waffle2Ajax("wafflePersones",ui.values[ 0 ],ui.values[ 1 ]);

                setTimeout(function(){
                    waffle2Draw();
                },500);
            }
            waffleTotAjax("waffle",comarcaact2,year1index,year2index);
            waffleAjax("waffle2",comarcaact2,year1index,year2index,families);

            setTimeout(function(){
                waffleDraw();
            },500);

            if(comarca) $("#title")[0].innerHTML = 'Estadístiques de la repartició d\'aliments a la comarca de '+ coma+' durant els anys '+ year1index +' fins '+ year2index;
            else $("#title")[0].innerHTML = 'Estadístiques de la repartició d\'aliments a la provincia de Barcelona durant els anys '+ year1index +' fins '+ year2index;

        }


    });
    $( "#amount" ).val(  $( "#slider-range" ).slider( "values", 0 ) +
        " - " + $( "#slider-range" ).slider( "values", 1 ) );




} );

function addBreadcrumb(com) {
     coma = com;
     if(!year1index) year1index = $("#yearinitial").text().replace(/\s/g, "");
    if(!year2index) year2index = $("#yearfi").text().replace(/\s/g, "");
    $(function(){
        $("#breadcrumb")[0].innerHTML = '<li><a href="#">Inici</a></li>\n' +
            '      <li><a href="#">El Banc dels Aliments</a></li>\n' +
            '      <li><a href="#" onclick="removeBreadcrumb()">Comarques</a></li><li>'+coma+'</li>';

        $("#title")[0].innerHTML = 'Estadístiques de la repartició d\'aliments a la comarca de '+ coma+' durant els anys '+ year1index +' fins '+ year2index;

    });

    comarca = true;
    comarcaact2 = com.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').toLowerCase();
}

function removeBreadcrumb() {
    comarca = false;

    $(function(){
        $("#breadcrumb")[0].innerHTML = '<li><a href="#">Inici</a></li>\n' +
            '      <li><a href="#">El Banc dels Aliments</a></li>\n' +
            '      <li>Comarques</li>';

        $("#title")[0].innerHTML = 'Estadístiques de la repartició d\'aliments a la provincia de Barcelona durant els anys '+ year1index +' fins '+ year2index;
    });

    returnMap(year1index,year2index,families);

    d3.selectAll(".chartline").remove();
    linechartAjax("linechart","comarcas_year_food",families);


    setTimeout(function(){
        linechartDraw();
    },500);

    waffleTotAjax("waffle","comarcas_year_food",year1index,year2index);
    waffleAjax("waffle2","comarcas_year_food",year1index,year2index,families);

    setTimeout(function(){
        waffleDraw();
    },500);

    waffle2Ajax("wafflePersones",year1index,year2index);

    setTimeout(function(){
        waffle2Draw();
    },500);
}



