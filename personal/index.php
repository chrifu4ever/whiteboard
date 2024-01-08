<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <head>
    <title>Personalverwaltung</title>
    <link rel="stylesheet" href="../css/personal.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">
</head>

</head>
<body>
<?php
require_once '../php/connectDB.php';

// HTML für das Suchformular
echo "<form method='post' action=''>"; // POST-Methode, um die Suchanfrage zu senden
echo "<input type='text' name='searchTerm' placeholder='Vorname oder Nachname'>";
echo "<input type='submit' name='search' value='Suchen'>";
echo "</form>";

    // Verarbeitung der Suchanfrage
    if (isset($_POST['search'])) {
        $db = new ConnectDB();
        $searchTerm = $_POST['searchTerm'];
        $entries = $db->searchEntries($searchTerm);

        // Anzeigen der Ergebnisse, falls vorhanden
        if ($entries) {
            echo "<table border='1'>";
            echo "<tr><th>PersID</th><th>Vorname</th><th>Nachname</th><th>Abteilung</th><th>Geburtsdatum</th><th>Eintrittsdatum</th><th>Austrittsdatum</th><th>Bearbeiten</th><th>Löschen</th></tr>";
        
            foreach ($entries as $entry) {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($entry['PersID']) . "</td>";
                echo "<td>" . htmlspecialchars($entry['Vorname']) . "</td>";
                echo "<td>" . htmlspecialchars($entry['Nachname']) . "</td>";
                echo "<td>" . htmlspecialchars($entry['Abteilung']) . "</td>";
                echo "<td>" . htmlspecialchars($entry['Geburtsdatum']) . "</td>";
                echo "<td>" . htmlspecialchars($entry['Eintrittsdatum']) . "</td>";
                echo "<td>" . htmlspecialchars($entry['austrittsdatum']) . "</td>";
                // Hinzufügen der Bearbeiten- und Löschen-Symbole
                echo "<td class='action'><i class='fa-solid fa-pen edit-icon' data-persid='" . $entry['PersID'] . "'></i></td>";

                echo "<td><i class='fa-solid fa-trash'></i></td>";
                echo "</tr>";
            }
        
            echo "</table>";
        } else {
            echo "Keine Einträge gefunden.";
        }
    }

    
if (isset($_GET['edit'])) {
    $persIdToEdit = $_GET['edit'];
    

    if ($entryToEdit) {
        echo "<form method='post' action=''>";
        echo "<input type='hidden' name='PersID' value='" . $entryToEdit['PersID'] . "'>";
        echo "<input type='text' name='Vorname' value='" . $entryToEdit['Vorname'] . "'>";
        echo "<input type='text' name='Nachname' value='" . $entryToEdit['Nachname'] . "'>";
        // ... Andere Felder ...
        echo "<input type='submit' name='update' value='Aktualisieren'>";
        echo "</form>";
    }
}

if (isset($_POST['update'])) {
    // Daten aus dem Formular
    $persID = $_POST['PersID'];
    $vorname = $_POST['Vorname'];
    $nachname = $_POST['Nachname'];
    $abteilung = $_POST['Abteilung'];
    $geburtsdatum = $_POST['Geburtsdatum'];
    $eintrittsdatum = $_POST['Eintrittsdatum'];
    $austrittsdatum = $_POST['Austrittsdatum'];

    // Aufruf der updateEntry-Methode
    $result = $db->updateEntry($persID, $vorname, $nachname, $abteilung, $geburtsdatum, $eintrittsdatum, $austrittsdatum);

    if ($result) {
        // Erfolg: Seite neu laden oder zu einer Bestätigungsseite weiterleiten
        header("Location: index.php"); // Ändere dies zu deinem gewünschten Ziel nach dem Update
        exit;
    } else {
        // Fehlerbehandlung
        echo "Ein Fehler ist aufgetreten. Bitte versuche es erneut.";
    }
}

if (isset($_POST['id']) && isset($_POST['data'])) {
    $persID = $_POST['id'];
    $updatedData = $_POST['data'];
    $db = new ConnectDB();
    // Annahme: updateEntry akzeptiert ein assoziatives Array für die aktualisierten Daten
    $result = $db->updateEntry($persID, $updatedData);

    if ($result) {
        echo "Update erfolgreich.";
    } else {
        echo "Fehler beim Update.";
    }
}

// Prüfen, ob es sich um eine AJAX-Anfrage handelt
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update') {
    $db = new ConnectDB();

    $id = $_POST['id'];
    $data = $_POST['data'];

    // Hier sicherstellen, dass alle erforderlichen Daten vorhanden sind
    if (isset($data['column1'], $data['column2'], $data['column3'], $data['column4'], $data['column5'], $data['column6'])) {
        $result = $db->updateEntry($id, $data['column1'], $data['column2'], $data['column3'], $data['column4'], $data['column5'], $data['column6']);

        if ($result) {
            echo "Update erfolgreich";
        } else {
            echo "Update fehlgeschlagen";
        }
    } else {
        echo "Nicht alle erforderlichen Daten wurden übergeben";
    }

    exit; // Verhindert, dass der restliche HTML-Code ausgeführt wird
}

?>

<script>
$(document).ready(function() {
    $(".edit-icon").click(function() {
        var row = $(this).closest("tr");
        row.find("td").not(".action").each(function() {
            var text = $(this).text();
            $(this).html("<input type='text' value='" + text + "' />");
        });

        $(this).removeClass("fa-pen edit-icon").addClass("fa-check update-icon");

    $(".update-icon").click(function() {
            var updatedRow = $(this).closest("tr");
            updateEntry(updatedRow);
        });
});
        
    function updateEntry(row) {
        var persId = row.find(".update-icon").data("persid");
        var updatedData = {
            Vorname: row.find("td:eq(1) input").val(),
            Nachname: row.find("td:eq(2) input").val(),
            Abteilung: row.find("td:eq(3) input").val(),
            Geburtsdatum: row.find("td:eq(4) input").val(),
            Eintrittsdatum: row.find("td:eq(5) input").val(),
            Austrittsdatum: row.find("td:eq(6) input").val()
        };

        $.ajax({
            url: "../php/updateEntry.php",
            type: "post",
            data: {
                id: persId,
                data: updatedData
            },
            success: function(response) {
                console.log("Update erfolgreich: ", response);
            },
            error: function(xhr, status, error) {
                console.error("Update fehlgeschlagen: ", error);
            }
        });
    }

});



</script>




</body>
</html>