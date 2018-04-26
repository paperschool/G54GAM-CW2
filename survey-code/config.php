<?php

   date_default_timezone_set('Europe/London');

//   echo "Attempting Database Connection...";

   define('DB_SERVER',   'localhost');
   define('DB_USERNAME', 'azzurr5_dominic');
   define('DB_PASSWORD', 'dominic123');
   define('DB_DATABASE', 'azzurr5_dissertation_survey');

   $conn = mysqli_connect(DB_SERVER,DB_USERNAME,DB_PASSWORD,DB_DATABASE);

   if($conn->connect_error){
      echo "Database Connection Error: ".$conn->connect_error;
   }

?>
