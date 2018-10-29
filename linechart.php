<?php 

include 'db_connection.php';

header('Content-type: application/json');

$conn = OpenCon();

$families = '';

$comarca = "";

if( isset($_GET['param']) ) {
    $comarca = $_GET['param'];
}

if( isset($_GET['param2']) ) {
        $families = implode('", "', $_GET['param2']);
        $families = '"'.$families.'"';
} 

$sql = "SELECT YEARS, MACROFAMILIA, sum(QUANTITAT) AS QUANTITAT FROM $comarca WHERE YEARS > $yearinitial-1 AND MACROFAMILIA IN ($families) GROUP BY YEARS, MACROFAMILIA";

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