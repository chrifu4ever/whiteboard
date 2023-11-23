// PHP
<?php
    // Check if file was received
    if(isset($_FILES['file'])) {
        // Define the path to the files directory
        $target_dir = "../files/";

        // Define the target file
        $target_file = $target_dir . basename($_FILES["file"]["name"]);

        // Move the uploaded file to the target file
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
            echo "The file ". basename($_FILES["file"]["name"]). " has been uploaded.";
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
?>