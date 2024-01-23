<?php
require_once('connectDB.php');

class Birthday {
    private $dbConnection;

    public function __construct() {
        $this->dbConnection = (new ConnectDB())->connect();
    }

    public function getTodaysBirthdays() {
        if ($this->dbConnection->connect_error) {
            die("Connection failed: " . $this->dbConnection->connect_error);
        }

        $today = date('Y-m-d');
        $query = "SELECT * FROM Personal WHERE DATE_FORMAT(Geburtsdatum, '%m-%d') = DATE_FORMAT('$today', '%m-%d')";
        $result = $this->dbConnection->query($query);
        $birthdays = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $birthdays[] = $row;
            }
        }

        return $birthdays;
    }

    public function getNextBirthdays() {
        if ($this->dbConnection->connect_error) {
            die("Connection failed: " . $this->dbConnection->connect_error);
        }

        $today = date('Y-m-d');
        $query = "SELECT * FROM Personal WHERE DATE_FORMAT(Geburtsdatum, '%m-%d') > DATE_FORMAT('$today', '%m-%d') ORDER BY DATE_FORMAT(Geburtsdatum, '%m-%d') ASC LIMIT 2";
        $result = $this->dbConnection->query($query);
        $nextBirthdays = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $nextBirthdays[] = $row;
            }
        }

        return $nextBirthdays;
    }

    public function countTodaysBirthdays() {
        if ($this->dbConnection->connect_error) {
            die("Connection failed: " . $this->dbConnection->connect_error);
        }

        $today = date('Y-m-d');
        $query = "SELECT COUNT(*) AS birthday_count FROM Personal WHERE DATE_FORMAT(Geburtsdatum, '%m-%d') = DATE_FORMAT('$today', '%m-%d')";
        $result = $this->dbConnection->query($query);

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            return (int)$row['birthday_count'];
        }

        return 0;
    }

    // Sie können hier weitere Methoden hinzufügen, falls erforderlich
}
?>
