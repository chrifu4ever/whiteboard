<?php

class ConnectDB
{
    private $server = "172.23.0.2";
    private $username = "root";
    private $password = "einSehrGutesPasswort123";
    private $database = "sidler_db";

    public function connect()
    {
        $sql = new mysqli($this->server, $this->username, $this->password, $this->database);
        mysqli_set_charset($sql, "utf8");
        if ($sql->connect_errno) {
            echo "Failed to connect to MySQL: (" . $sql->connect_errno . ") " . $sql->connect_error;
        }

        return $sql;
    }

    public function getAllEntries()
    {
        $conn = $this->connect();
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $query = "SELECT * FROM Personal"; // Ersetze 'deine_tabelle' mit dem Namen deiner Tabelle
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


    public function searchEntries($searchTerm)
    {
        $conn = $this->connect();
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $searchTerm = $conn->real_escape_string($searchTerm); // Schutz vor SQL-Injection
        $query = "SELECT * FROM Personal WHERE Vorname LIKE '%$searchTerm%' OR Nachname LIKE '%$searchTerm%'";

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


    public function getEntryById($id) {
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


}

?>
