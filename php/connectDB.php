<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

class ConnectDB
{

    private $server = "172.21.0.3";
    private $username = "root";
    private $password = "einSehrGutesPasswort123";
    private $database = "sidler_db";

    public function connect()
    {
        $sql = new mysqli($this->server, $this->username, $this->password, $this->database);
        mysqli_set_charset($sql, "utf8");
        if ($sql->connect_errno) {
            echo "<script>console.error('Failed to connect to MySQL: (" . $sql->connect_errno . ") " . $sql->connect_error . "');</script>";
        } else {
            echo "<script>console.log('MySQL connection established successfully.');</script>";
        }

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


    public function getTodaysBirthdays()
    {
        $conn = $this->connect();
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $today = date('Y-m-d');
        $query = "SELECT * FROM Personal WHERE DATE_FORMAT(Geburtsdatum, '%m-%d') = DATE_FORMAT('$today', '%m-%d')";

        $result = $conn->query($query);
        $birthdays = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $birthdays[] = $row;
            }
        }

        $conn->close();
        return $birthdays;
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