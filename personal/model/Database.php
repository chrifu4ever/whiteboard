<?php
/**
 * 
 * User: Christian Fulde
 * Date: 21.11.2023
 * Time: 13:00
 */

require 'ConnectDB.php';

class Database
{

    /**
     * Retrieves the SQL order for a given query.
     *
     * @param string $query The SQL query.
     * @return string The SQL order.
     */
    function getSQLOrder($query) // 
    {
        $conn = new ConnectDB();
        $result = $conn->connect()->query($query);
    
        if ($conn->connect()->error) {
            echo "SQL Error: " . $conn->connect()->error;
        } else {
            echo "Operation erfolgreich ausgeführt.";
        }
    
        return $result;
    }



    /**
     * Retrieves all employee records from the database.
     *
     * @param object $object The database object.
     * @return array An array of employee records.
     */
    function showAllEmployee($object)
    {
        if ($object != "")
        {
            return $this->getSQLOrder("SELECT Vorname, Nachname, Abteilung, Geburtsdatum, Eintrittsdatum, Austrittsdatum FROM Personal
                          WHERE Vorname LIKE '%$object%' OR Nachname LIKE '%$object%' OR Abteilung LIKE '%$object%'");
        }
        else
        {
            echo "Bitte geben Sie etwas ins Suchfeld ein";
        }
    }

    /**
     * Inserts an employee into the database.
     *
     * @param string $vorname The first name of the employee.
     * @param string $nachname The last name of the employee.
     * @param string $abteilung The department of the employee.
     * @param string $geburtsdatum The birth date of the employee.
     * @param string $eintrittsdatum The date of entry of the employee.
     * @param string $austrittsdatum The date of exit of the employee.
     * @return mixed The result of the SQL query.
     */
    function insertEmployeeInDB($vorname, $nachname, $abteilung, $geburtsdatum, $eintrittsdatum, $austrittsdatum) {
        return $this->getSQLOrder("INSERT INTO Personal (Vorname, Nachname, Abteilung, Geburtsdatum, Eintrittsdatum, Austrittsdatum) VALUES ('$vorname', '$nachname', '$abteilung', '$geburtsdatum', '$eintrittsdatum', '$austrittsdatum')");
    }

}
