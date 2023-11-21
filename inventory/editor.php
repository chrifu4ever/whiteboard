<html>
<?php
include("Controller/Controller.php");
include("View/TemplateLoader.php");

$loader = new TemplateLoader();

echo $loader->loadHeader();


?>
<head>
    <title>Editor</title>
</head>
<body>
<script src="Controller/js/scripts.js"></script>
<div class="col-3 menu">
<form method="get">

        <label for="newProductText">Bitte das neue Produkt eingeben: </label>
    <textarea name="newProductText" id="newProductText" autofocus autocomplete="off" placeholder="Ein Produkt pro Zeile" ></textarea>
        <br>
        <label for="selectRoom">Zimmer: </label>
        <select id="selectRoom" name="selectRoom">
            <?php


            $option = new Controller();
            $option->showElementInOption(2)?>
        </select>
        <br>
        <label for="selectCupboard">Schrank: </label>
        <select id="selectCupboard" name="selectCupboard">
            <?php

            $option->showElementInOption(1);
            ?>
        </select>
        <br>
        <input type="submit" value="Produkte in der Datenbank speichern" name="submitProduct" id="submitProduct">


</form>
</div>


<?php

$contoller = new Controller();
if (isset($_GET["submitProduct"]))
{
    $room =  $_GET["selectRoom"];
    $cupboard = $_GET["selectCupboard"];

    $product = $_GET['newProductText'];

    $lines = explode("\n", $product);
    foreach( $lines as $index => $line )
    {
        $lines[$index] = $line;
        //echo $lines[$index]."<br>";
        echo $contoller->insertProductInDB($lines[$index],$cupboard);
    }
}



?>
</body>
</html>

