<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        #employeeForm {
            display: none;
        }
    </style>
</head>
<body>
    <button id="newEmployeeButton">Neuen Mitarbeiter anlegen</button>
    <div id="employeeForm">
        <form>
            <label for="firstName">Vorname:</label><br>
            <input type="text" id="firstName" name="firstName"><br>
            <label for="lastName">Nachname:</label><br>
            <input type="text" id="lastName" name="lastName"><br>
            <label for="birthDate">Geburtsdatum:</label><br>
            <input type="date" id="birthDate" name="birthDate"><br>
            <label for="entryDate">Eintritt:</label><br>
            <input type="date" id="entryDate" name="entryDate"><br>
            <input type="submit" value="Submit">
        </form>
    </div>

    <script>
        document.getElementById('newEmployeeButton').addEventListener('click', function() {
            document.getElementById('employeeForm').style.display = 'block';
        });
    </script>
</body>
</html>