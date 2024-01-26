<?php
$jsonFile = '../files/files.json';

if (file_exists($jsonFile)) {
    echo file_get_contents($jsonFile);
} else {
    echo json_encode([]);
}
?>
