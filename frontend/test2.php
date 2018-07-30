<?php 

include 'db_connection.php';

header('Content-type: application/json');

$conn = OpenCon();
$A = '"A"';
$B = '"B"';

$sql = "SELECT * FROM bages";

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