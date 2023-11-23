<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sidler Whiteboard Personal Backend</title>
    <link rel="stylesheet" href="view/style/style.css">
    <style>
        #employeeForm {
            display: none;
        }
    </style>
</head>
<body>
    <input id="searchEmployeeButton">Neuen Mitarbeiter anlegen</input>
    <div id="employeeForm">
        <form method="get">
            <label for="firstName">Vorname:</label><br>
            <input type="text" id="firstName" name="firstName"><br>
            <label for="lastName">Nachname:</label><br>
            <input type="text" id="lastName" name="lastName"><br>
            <label for="birthDate">Geburtsdatum:</label><br>
            <input type="date" id="birthDate" name="birthDate"><br>
            <label for="entryDate">Eintritt:</label><br>
            <input type="date" id="entryDate" name="entryDate"><br>
            <input type="submit" value="Personal hinzufügen" name="submitEmployee">
        </form>
    </div>
    <button id="newEmployeeButton">Neuen Mitarbeiter anlegen</button>

    <div id="entryDiv">
    <script>
        document.getElementById('newEmployeeButton').addEventListener('click', function() {
            document.getElementById('employeeForm').style.display = 'block';
        });
    </script>
    </div>

    <div id="tableDiv"></div>
    
</body>
</html>