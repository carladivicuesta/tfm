function totalFunction() {
  // Get the checkbox
  var checkBox = document.getElementById("totalCheck");

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true){
    var x = document.getElementsByClassName("typeFamily")
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].checked = false;
      x[i].disabled = true;
    }
  }
  else {
    var x = document.getElementsByClassName("typeFamily")
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].disabled = false;
    }
  }
}

function typeFamilyFunction() {

  var x = document.getElementsByClassName("typeFamily")
  // Get the checkbox
  var checkBox = document.getElementById("totalCheck");
  var i = 0;
  var trobat = false;
  while(i<x.length && !trobat) {
    if (x[i].checked == true){
      trobat = true;
    }
    i++;
  }
  if (trobat) checkBox.checked = false;

  else checkBox.checked = true;
  
}