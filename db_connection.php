<?php
include 'variables.php';


function OpenCon()
 {
 $dbhost = "localhost";
 $dbuser = "root";
 $dbpass = "";
 $db = "basedades";


 
 
 $conn = new mysqli($dbhost, $dbuser, $dbpass,$db) or die("Connect failed: %s\n". $conn -> error);
 
 $conn->set_charset("utf8");
 return $conn;
 }
 
function CloseCon($conn)
 {
 $conn -> close();
 }
   
?>
