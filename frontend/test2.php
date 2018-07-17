<?php
include 'db_connection.php';
$conn = OpenCon();
$A = '"A"';
$B = '"B"';
$sql = "SELECT * FROM year_comarca_quant";



$result = mysqli_query($conn, $sql);

$data = array();
while ( $row = mysql_fetch_row($result) )
{
  $data[] = $row;
}
echo json_encode( $data );


/*if($result) {

	while($row = mysqli_fetch_assoc($result)) {
		echo $row['YEARS'] . ': ' . $row['QUANTITAT'] . '<br/>';
	}

	


	mysqli_free_result($result);
}



mysqli_close($conn);*/
?>