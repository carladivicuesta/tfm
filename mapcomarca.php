<?php 

include 'db_connection.php';

header('Content-type: application/json');

$conn = OpenCon();
$families = "";
$y1 = $yearinitial -1;
$y2 = $yearfi +1;
if( isset($_GET['param4']) ) {
    //$families = $_GET['param'];
    $families = implode('", "', $_GET['param4']);
    $families = '"'.$families.'"';
}

if( isset($_GET['param2']) ) {
    $y1 = $_GET['param2']-1;
}

if( isset($_GET['param3']) ) {
    $y2 = $_GET['param3']+1;
}

$sql = "SELECT COMARCA, SUM(QUANTITAT)AS QUANTITAT FROM comarcas_year_food WHERE YEARS > $y1 AND YEARS < $y2  AND MACROFAMILIA IN ($families) GROUP BY COMARCA";

  //--------------------------------------------------------------------------
  // 2) Query database for data
  //--------------------------------------------------------------------------
  $result = mysqli_query($conn, $sql);     
      //query
  $data = array();
	while ( $row = mysqli_fetch_assoc($result) )
	{
	  $data[] = $row;
	}
  //--------------------------------------------------------------------------
  // 3) echo result as json 
  //--------------------------------------------------------------------------
  if(!json_encode($data)) var_dump("Error");
  echo json_encode($data);


?>