var families = ["A","B","C","D","E","F","G","H","I"];
var year1 = 2007;
var year2 = 2017;
var comarcaact2 = "comarcas_year_food";
var comarca = false;
console.log('holaa init');

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
          funcajax("test2",comarcaact2,2000,2017,families);
          funcMap(comarcaact2+".json");

          AjaxMap2("test2",comarcaact2,2000,2017,families);
          Map2(comarcaact2+".json");
      }
      else {
          funcajax("test","",2000,2017,families);
          funcMap("comarques.json");

          AjaxMap2("test","",2000,2017,families);
          Map2("comarques.json");
      }
      linechartAjax("linechart",comarcaact2,families);
      setTimeout(function(){
          linechartDraw();
      },500);

      waffleAjax("waffle2",comarcaact2,2000,2017,families);

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
          funcajax("test2",comarcaact2,2000,2017,families);
          funcMap(comarcaact2+".json");

          AjaxMap2("test2",comarcaact2,2000,2017,families);
          Map2(comarcaact2+".json");
      }
      else {
          funcajax("test","",2000,2017,families);
          funcMap("comarques.json");

          AjaxMap2("test","",2000,2017,families);
          Map2("comarques.json");
      }


      console.log("comview", comarcaact2);
      console.log("comview2", typeof comarcaact2);
    linechartAjax("linechart",comarcaact2,families);
    setTimeout(function(){
        linechartDraw();
    },500);

    waffleAjax("waffle2",comarcaact2,2000,2017,families);
    
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
        min: 2007,
        max: 2017,
        values: [ 2007, 2017 ],
        slide: function( event, ui ) {
           // $( "#amount" ).val(  ui.values[ 0 ] + " - " + ui.values[ 1 ] );
            year1 = 2017 - ui.values[ 1 ] + 2007;
            year2 = 2017 - ui.values[ 0 ] + 2007;

            $( "#amount" ).val(year1 + " - " + year2);
            if(comarca) {
                funcajax("test2",comarcaact2,year1,year2,families);
                funcMap(comarcaact2+".json");

                AjaxMap2("test2",comarcaact2,year1,year2,families);
                Map2(comarcaact2+".json");
            }
            else {
                funcajax("test","",year1,year2,families);
                funcMap("comarques.json");

                AjaxMap2("test","",year1,year2,families);
                Map2("comarques.json");
            }

            waffleAjax("waffle2",comarcaact2,year1,year2,families);

            setTimeout(function(){
                waffleDraw();
            },500);

            waffle2Ajax("wafflePersones",ui.values[ 0 ],ui.values[ 1 ]);

            setTimeout(function(){
                waffle2Draw();
            },500);
            $("#title")[0].innerHTML = 'Estadístiques de la repartició d\'aliments a la provincia de Barcelona durant els anys '+ year1 +' fins '+ year2;
        }


    });
    $( "#amount" ).val(  $( "#slider-range" ).slider( "values", 0 ) +
        " - " + $( "#slider-range" ).slider( "values", 1 ) );




} );

function addBreadcrumb(com) {
    $(function(){
        $("#breadcrumb")[0].innerHTML = '<li><a href="#">Inici</a></li>\n' +
            '      <li><a href="#">El Banc dels Aliments</a></li>\n' +
            '      <li><a href="#" onclick="removeBreadcrumb()">Comarques</a></li><li>'+com+'</li>';

        $("#title")[0].innerHTML = 'Estadístiques de la repartició d\'aliments a la comarca de '+ com+' durant els anys 2008 fins 2017';
    });

    comarca = true;
    console.log("Assignem var",com);
    comarcaact2 = com.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s/g, '').toLowerCase();
}

function removeBreadcrumb() {
    comarca = false;

    $(function(){
        $("#breadcrumb")[0].innerHTML = '<li><a href="#">Inici</a></li>\n' +
            '      <li><a href="#">El Banc dels Aliments</a></li>\n' +
            '      <li>Comarques</li>';

        $("#title")[0].innerHTML = 'Estadístiques de la repartició d\'aliments a la provincia de Barcelona durant els anys 2008 fins 2017';
    });

    returnMap(year1,year2,families);

    d3.selectAll(".chartline").remove();
    linechartAjax("linechart","comarcas_year_food",families);


    setTimeout(function(){
        linechartDraw();
    },500);

    waffleAjax("waffle2","comarcas_year_food",year1,year2,families);

    setTimeout(function(){
        waffleDraw();
    },500);

    waffle2Ajax("wafflePersones",year1,year2);

    setTimeout(function(){
        waffle2Draw();
    },500);
}



