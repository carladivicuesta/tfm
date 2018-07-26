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
      var families = ["A","B","C","D","E","F","G","H","I"];
      d3.select("#chart-line svg").remove();

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
  var families = [];
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

