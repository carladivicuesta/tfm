var families= ["A","B","C","D","E","F","G","H","I"];

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

      funcajax("test","",2000,2017,families);
      funcMap("comarques.json");

      AjaxMap2("test","",2000,2017,families);
      Map2("comarques.json");

      linechartAjax("linechart",families);
      setTimeout(function(){
          linechartDraw();
      },500);

      waffleAjax("waffle2",2000,2017,families);

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
    console.log("fam",families);
    d3.select("#chart-line svg").remove();

    funcajax("test","",2000,2017,families);
    funcMap("comarques.json");

    AjaxMap2("test","",2000,2017,families);
    Map2("comarques.json");

    linechartAjax("linechart",families);
    setTimeout(function(){
        linechartDraw();
    },500);

    waffleAjax("waffle2",2000,2017,families);
    
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
        min: 2008,
        max: 2017,
        values: [ 2008, 2017 ],
        slide: function( event, ui ) {
            $( "#amount" ).val(  ui.values[ 0 ] + " - " + ui.values[ 1 ] );

            funcajax("test","",ui.values[ 0 ],ui.values[ 1 ],families);
            funcMap("comarques.json");

            AjaxMap2("test","",ui.values[ 0 ],ui.values[ 1 ],families);
            Map2("comarques.json");


            waffleAjax("waffle2",ui.values[ 0 ],ui.values[ 1 ],families);

            setTimeout(function(){
                waffleDraw();
            },500);

            waffle2Ajax("wafflePersones",ui.values[ 0 ],ui.values[ 1 ]);

            setTimeout(function(){
                waffle2Draw();
            },500);
        }
    });
    $( "#amount" ).val(  $( "#slider-range" ).slider( "values", 0 ) +
        " - " + $( "#slider-range" ).slider( "values", 1 ) );
} );



