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

$sql = "SELECT SUM(quantitat) AS quantitat FROM beneficiaris_comarca WHERE years > $Y1 AND years < $Y2";

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