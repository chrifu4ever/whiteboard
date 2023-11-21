<?php
/**
 * Created by PhpStorm.
 * User: chrif
 * Date: 20.02.2018
 * Time: 15:24
 */
require(__DIR__ . '/../Model/Database.php');

$c = new Controller;
$d = new Controller;
if (isset($_GET['q']))
{
    //echo "Bin da wer noch".$_GET['q'];
    echo $c->deleteProduct($_GET['q']);

}

if (isset($_GET['k']))
{
    //echo "Bin da wer noch".$_GET['callTable'];
    echo $d->createTable($_GET['k']);

}

class Controller
{

    function createTable($result)
    {

        if ($result == null)
        {
            return "Bitte geben Sie etwas in das Suchfeld ein!";
        } else
        {
            //$database = new Database();

            $databaseElement = $this->init()->showProduct($result);
            $countRows = 0;
            //Creates the Head of the Table
            $tableHead = "
        <table id='resultTable'>
        <tr>
            <th>Zimmer</th>
            <th>Schrank</th>
            <th>Produkt</th>
            <th></th>
        </tr>
        ";

            $tableRows = "";



            //Creates the Table Rows as long as there are DB Entries
            while ($row = $databaseElement->fetch_object())
            {


                $countRows++;
                $tableRows .= "<tr id='tr_$row->productID'>
                <td id='roomID_$row->roomID'>$row->roomName</td>
                <td id='cupboardID_$row->cupboardID'>$row->cupboardName</td>
                <td id='productID_$row->productID'>$row->productName</td>
                <td><img id='$row->productID' src='View/pics/delete.png' onclick='callDeleteProduct(this.id)'></td>
                <td><img src='View/pics/edit.png'>
                </tr>
                ";
            }

            if ($countRows < 1)
            {
                return "Es wurden keine mit deiner Suchanfrage - " . $result . " - übereinstimmenden Dokumente gefunden.";
            } else
            {
                $tableEnd = "</table>";
                return "Es wurden " . $countRows . " Einträge gefunden<br>" . $tableHead . $tableRows . $tableEnd;
            }

        }


    }


    function insertProductInDB($product, $cupboard)
    {

        if ($product == null)
        {
            return "Bitte geben Sie etwas in das Suchfeld ein!";
        }
        else
        {
            $this->init()->createNewProduct($product,substr($cupboard,-1));
            return "Das Produkt $product wurde erfolgreich in den Schrank $cupboard hinzugefügt";
        }

    }


    function deleteProduct($product) {

        $this->init()->deleteProductInDB($product);
        return "<br>$product wurde gelöscht ";

    }



    function readTextFile()
    {
        echo "OK";

        $array = [];
        $zitate = file("Controller/entry.txt");
        for ($i = 0; $i < count($zitate); $i++)
        {
            $array[$i]= $zitate[$i];
            $this->init()->createNewProduct($array[$i],3,3);
        }

        return "Alle Daten eingetragen";


    }


    function showElementInOption($hans)
    {

        $databaseElement = $this->init()->allElementsInArray($hans);

        switch ($hans) {
            case 1:
                while ($row = $databaseElement->fetch_object())
                {
                    echo "<option value='cupboard_$row->cupboardID'>$row->cupboardName</option>";
                }
                break;
            case 2:
                while ($row = $databaseElement->fetch_object())
                {
                    echo "<option value='room_$row->roomID'>$row->roomName</option>";
                }
                break;
        }




    }




    function init()
    {


        $database = new Database();
        return $database;
    }


    //Only for testing - Delete later
    function testFunction($var)
    {
        echo "This is a test $var";

    }

    /*MITARBEITER*/

    function addEmployee($vorname, $nachname, $abteilung, $geburtsdatum, $eintrittsdatum, $austrittsdatum) 
    {
        $this->init()->insertEmployeeInDB($vorname, $nachname, $abteilung, $geburtsdatum, $eintrittsdatum, $austrittsdatum);
        return "Der Mitarbeiter $vorname $nachname wurde erfolgreich hinzugefügt";
    }

    function createEmployeeTable()
    {
        $databaseElement = $this->init()->getSQLOrder("SELECT * FROM Personal");
        $countRows = 0;

        //Creates the Head of the Table
        $tableHead = "
        <table id='resultTable'>
        <tr>
            <th>Vorname</th>
            <th>Nachname</th>
            <th>Abteilung</th>
            <th>Geburtsdatum</th>
            <th>Eintrittsdatum</th>
            <th>Austrittsdatum</th>
        </tr>
        ";

        $tableRows = "";

        //Creates the Table Rows as long as there are DB Entries
        while ($row = $databaseElement->fetch_object())
        {
            $countRows++;
            $tableRows .= "<tr id='tr_$row->PersID'>
            <td id='vorname_$row->PersID'>$row->Vorname</td>
            <td id='nachname_$row->PersID'>$row->Nachname</td>
            <td id='abteilung_$row->PersID'>$row->Abteilung</td>
            <td id='geburtsdatum_$row->PersID'>$row->Geburtsdatum</td>
            <td id='eintrittsdatum_$row->PersID'>$row->Eintrittsdatum</td>
            <td id='austrittsdatum_$row->PersID'>$row->Austrittsdatum</td>
            </tr>
            ";
        }

        if ($countRows < 1)
        {
            return "Es wurden keine Einträge gefunden.";
        } else
        {
            $tableEnd = "</table>";
            return "Es wurden " . $countRows . " Einträge gefunden<br>" . $tableHead . $tableRows . $tableEnd;
        }
    }

}


