<?php


    $GLOBALS['root_dir'] = $_SERVER['DOCUMENT_ROOT']."/Dissertation/";

    include($GLOBALS['root_dir']."config.php");

    function SaveAnswers($conn){
        // check if there is any data to save
        if(!CheckSurveyExists()) return false;

        // insert then fetch largest user id value from database
        $userID = CreateSurveyUser($conn);

        // parse posted survey results
        $values = ParseSurvey($userID);

        // check if final database insert occured correctly
        if(InsertAnswersToDatabase($conn,$values)){
            echo "Survey Saved Successfully";
        }

        // close connection
        $conn->close();

    }

    function CheckSurveyExists(){
        // simply checking if posted value has been set
        return isset($_POST['Survey_Answers']);
    }

    function CreateSurveyUser($conn){

        // setting initial user id to -1
        $userID = -1;

        // fetching current mysql compatible datatime
        $date = date("Y-m-d H:i:s",time());

        // fetching max user id from database
        $sql = "SELECT MAX(userID) FROM USER_TABLE";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            // output data of each row
            while($row = $result->fetch_assoc()) {
                $userID = array_values($row)[0] + 1;
            }
        }

        // inserting new user into database based on current max
        $sql = "INSERT INTO USER_TABLE (userID,submissionDate) VALUES ('$userID','$date')";
        $result = $conn->query($sql);
        if(!$result){
            echo "User Creation Error: ";
        }

        return $userID;

    }

    function ParseSurvey($userID){

        $ANSWERS = "";

        $surveyAnswers = json_decode($_POST["Survey_Answers"]);

        for($i = 0 ; $i < sizeof($surveyAnswers) ; $i++){

            $answer = $surveyAnswers[$i]->{'answer'};
            $type   = $surveyAnswers[$i]->{'type'};
            $id     = $surveyAnswers[$i]->{'id'};

            $ANSWERS.= "($id,$userID,$answer),";

        }

        $ANSWERS = rtrim($ANSWERS,',');

        return $ANSWERS;

    }

    function InsertAnswersToDatabase($conn,$values){

        $sql = "INSERT INTO ANSWER_TABLE (questionID,userID,answer) VALUES $values";
        echo $sql;
        $result = $conn->query($sql);
        if(!$result){
            echo "Error inserting answers";
            return false;
        }

        return true;

    }

    SaveAnswers($conn);

?>