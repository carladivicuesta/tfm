<?php 

include 'db_connection.php';

header('Content-type: application/json');

$conn = OpenCon();
$Y1 = $yearinitial -1;
$Y2 = $yearfi +1;
$comarca = "";

if( isset($_GET['param']) ) {
    $comarca = $_GET['param'];
}
if( isset($_GET['param2']) ) {
        $Y1 = $_GET['param2']-1;
} 
if( isset($_GET['param3']) ) {
        $Y2 = $_GET['param3']+1;
} 

$families = '';
if( isset($_GET['param4']) ) {
        $families = implode('", "', $_GET['param4']);
        $families = '"'.$families.'"';
} 


$sql = "SELECT MACROFAMILIA, sum(QUANTITAT) AS QUANTITAT FROM $comarca WHERE YEARS > $Y1 AND YEARS < $Y2 AND MACROFAMILIA IN ($families) GROUP BY MACROFAMILIA";

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