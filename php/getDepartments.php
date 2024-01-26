<?php
require_once 'connectDB.php';

$db = new ConnectDB();
$mysqli = $db->connect();

$query = "SELECT DISTINCT Abteilung FROM Personal";
$result = $mysqli->query($query);

$departments = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $departments[] = $row['Abteilung'];
    }
}

echo json_encode($departments);

$mysqli->close();
?>