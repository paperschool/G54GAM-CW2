<?php

$GLOBALS['root_dir'] = $_SERVER['DOCUMENT_ROOT']."/Dissertation/";

include($GLOBALS['root_dir']."config.php");

function fetchUserID($conn){

  $sql = "SELECT MAX(userID) FROM USER_TABLE";

  $result = $conn->query($sql);

  if(!$result){
    echo "connection error";
    return 0;
  }

  $row = mysqli_fetch_row($result);

  if($row[0] == NULL){
    return 0;
  } else {
    return $row[0];
  }

}

function fetchQuestions($conn){

    $sql = "SELECT * FROM QUESTION_TABLE WHERE questionVersion = 1";

    $result = $conn->query($sql);

    if(!$result){
        echo "connection error";
    }

    $conn->close();

    return $result;

}

?>

<!DOCTYPE html>
<html>

    <?php include $GLOBALS['root_dir']."head.php"; ?>

<body>


      <script>

        var s = new SURVEY.Survey();

        <?php

        echo "var userID = ".fetchUserID($conn)." || 0;"."\n\n";

        $questions = fetchQuestions($conn);

        if ($questions->num_rows > 0) {
            // output data of each row
            while($row = $questions->fetch_assoc()) {
                $qID     = array_values($row)[0];
                $qString = array_values($row)[1];
                $qType   = array_values($row)[2];
                $qVer    = array_values($row)[3];

                echo "\t\ts.add($qID,'$qString',$qType);"."\n";

            }
        }

        ?>

        s.start();

    </script>
</body>

</html>
