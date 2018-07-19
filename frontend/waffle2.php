<?php 

include 'db_connection.php';

header('Content-type: application/json');

$conn = OpenCon();
$A = '"C"';
$B = '"B"';
$jsondata = array();
if( isset($_GET['param']) ) {
        $A = $_GET['param'];
} 

else {
  echo("no entra");
}


$sql = "SELECT MACROFAMILIA, sum(QUANTITAT) AS QUANTITAT FROM vbages_quant WHERE YEAR < $A GROUP BY MACROFAMILIA";

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