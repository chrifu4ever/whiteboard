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
<form method="post">
    <label for="vorname">Vorname: </label>
    <input type="text" id="vorname" name="vorname" required>
    <br>
    <label for="nachname">Nachname: </label>
    <input type="text" id="nachname" name="nachname" required>
    <br>
    <label for="abteilung">Abteilung: </label>
    <input type="text" id="abteilung" name="abteilung" required>
    <br>
    <label for="geburtsdatum">Geburtsdatum: </label>
    <input type="date" id="geburtsdatum" name="geburtsdatum" required>
    <br>
    <label for="eintrittsdatum">Eintrittsdatum: </label>
    <input type="date" id="eintrittsdatum" name="eintrittsdatum" required>
    <br>
    <label for="austrittsdatum">Austrittsdatum: </label>
    <input type="date" id="austrittsdatum" name="austrittsdatum">
    <br>
    <input type="submit" value="Personal hinzufügen" name="submitEmployee">
</form>
</div>


<?php

$controller = new Controller();
if (isset($_POST["submitEmployee"])) {
    $vorname = $_POST["vorname"];
    $nachname = $_POST["nachname"];
    $abteilung = $_POST["abteilung"];
    $geburtsdatum = $_POST["geburtsdatum"];
    $eintrittsdatum = $_POST["eintrittsdatum"];
    $austrittsdatum = $_POST["austrittsdatum"];

    $controller->addEmployee($vorname, $nachname, $abteilung, $geburtsdatum, $eintrittsdatum, $austrittsdatum);
}
?>
</body>
</html>

