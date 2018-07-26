<?php 

include 'db_connection.php';

header('Content-type: application/json');

$conn = OpenCon();
$Y1 = 2000;
$Y2 = 2017;
$jsondata = array();
if( isset($_GET['param']) ) {
        $Y1 = $_GET['param']-1;
} 
if( isset($_GET['param2']) ) {
        $Y2 = $_GET['param2']+1;
} 

$families = '';
if( isset($_GET['param3']) ) {
        $families = implode('", "', $_GET['param3']);
        $families = '"'.$families.'"';
} 


$sql = "SELECT MACROFAMILIA, sum(QUANTITAT) AS QUANTITAT FROM vbages_quant WHERE YEAR > $Y1 AND YEAR < $Y2 AND MACROFAMILIA IN ($families) GROUP BY MACROFAMILIA";

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