<?php
/**
 * Created by PhpStorm.
 * User: chrif
 * Date: 20.02.2018
 * Time: 12:37
 */

require 'ConnectDB.php';


class Database
{


    function showProduct($object)
    {
        if ($object != "")
        {
            return $this->getSQLOrder("SELECT Product.productName, Product.productID, Rooms.roomName,  Rooms.roomID, Cupboard.cupboardName, Cupboard.cupboardID FROM Product
                      JOIN Cupboard ON Product.cupboardID=Cupboard.cupboardID
                      JOIN Rooms ON Cupboard.roomID=Rooms.roomID
                      WHERE Product.productName LIKE '%$object%' OR Cupboard.cupboardName LIKE '%$object%' OR Rooms.roomName LIKE '%$object%'");


        }
        else
        {
            echo "Bitte geben Sie etwas ins Suchfeld ein";

        }


    }


    function createNewProduct($object, $cupboard)
    {
        return $this->getSQLOrder("INSERT INTO Product(productName, cupboardID) VALUES ('$object',$cupboard)");



    }


    function deleteProductInDB($productID)
    {
        //$a = $this->showProduct($product)->fetch_object();
        echo "DELETE FROM Product WHERE productName = '$productID'";

        return $this->getSQLOrder( "DELETE FROM Product WHERE productID = '$productID'");


    }

    function allElementsInArray($a) //TODO Hier weiter: Wenn das Zimmer ausgewählt wird sollen danach alle Schränke zur Auswahl stehen um neue Produkte hinzuzufügen
    {
        switch ($a)
        {
            case 1:
                return $this->getSQLOrder("SELECT cupboardID, cupboardName FROM Cupboard");
                break;
            case 2:
                return $this->getSQLOrder("SELECT roomID, roomName FROM Rooms");
                break;
        }
    }




    function getSQLOrder($query)
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

    /*MITARBEITER*/
    function insertEmployeeInDB($vorname, $nachname, $abteilung, $geburtsdatum, $eintrittsdatum, $austrittsdatum) {
        return $this->getSQLOrder("INSERT INTO Personal (Vorname, Nachname, Abteilung, Geburtsdatum, Eintrittsdatum, Austrittsdatum) VALUES ('$vorname', '$nachname', '$abteilung', '$geburtsdatum', '$eintrittsdatum', '$austrittsdatum')");
    }

    function showEmployee($object)
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


}