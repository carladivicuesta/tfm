<?php 

include 'db_connection.php';

header('Content-type: application/json');

$conn = OpenCon();

$families = '';
if( isset($_GET['param']) ) {
        //$families = $_GET['param'];
        $families = implode('", "', $_GET['param']);
        $families = '"'.$families.'"';
} 
else {
  //echo("no entra");
}
//WHERE MACROFAMILIA IN (".implode(',', $families).") 
$sql = "SELECT YEAR, MACROFAMILIA, sum(QUANTITAT) AS QUANTITAT FROM vbages_quant WHERE MACROFAMILIA IN ($families) GROUP BY YEAR, MACROFAMILIA";

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