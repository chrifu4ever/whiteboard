<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

class ConnectDB
{

    private $server = "sidler_whiteboard-mysql-1";
    private $username = "root";
    private $password = "einSehrGutesPasswort123";
    private $database = "sidler_db";

    public function connect()
    {
        $sql = new mysqli($this->server, $this->username, $this->password, $this->database);
        mysqli_set_charset($sql, "utf8");
        return $sql;
    }

    public function getAllEntries()
    {
        $conn = $this->connect();
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $query = "SELECT * FROM Personal";
        $result = $conn->query($query);

        $entries = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $entries[] = $row;
            }
        }

        $conn->close();
        return $entries;
    }

    public function searchEntries($searchTerm) {
        $conn = $this->connect();
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
    
        $searchTerm = $conn->real_escape_string($searchTerm);
        // SQL-Abfrage, die Ergebnisse nach Nachname sortiert
        $query = "SELECT * FROM Personal WHERE Vorname LIKE '%$searchTerm%' OR Nachname LIKE '%$searchTerm%' ORDER BY Nachname ASC";
    
        $result = $conn->query($query);
        $entries = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $entries[] = $row;
            }
        }
    
        $conn->close();
        return $entries;
    }
    


    public function getEntryById($id)
    {
        $conn = $this->connect();
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $id = $conn->real_escape_string($id);
        $query = "SELECT * FROM Personal WHERE PersID = '$id'";

        $result = $conn->query($query);
        if ($result->num_rows > 0) {
            $entry = $result->fetch_assoc();
        } else {
            $entry = null;
        }

        $conn->close();
        return $entry;
    }





   
    

    

    public function getLeavingPerson()
    {
        $conn = $this->connect();
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $query = "SELECT * FROM Personal WHERE CURDATE() BETWEEN DATE_SUB(Austrittsdatum, INTERVAL 10 DAY) AND DATE_ADD(Austrittsdatum, INTERVAL 10 DAY)";

        $result = $conn->query($query);
        $leavingPersons = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $leavingPersons[] = $row;
            }
        }

        $conn->close();
        return $leavingPersons;
    }

    public function getJoiningPerson()
    {
        $conn = $this->connect();
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $query = "SELECT * FROM Personal WHERE CURDATE() BETWEEN DATE_SUB(Eintrittsdatum, INTERVAL 30 DAY) AND DATE_ADD(Eintrittsdatum, INTERVAL 10 DAY)";

        $result = $conn->query($query);
        $joiningPersons = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $joiningPersons[] = $row;
            }
        }

        $conn->close();
        return $joiningPersons;
    }


}

?>