$(document).ready(function() {
    // Handler für den Edit-Button
    $("body").on("click", ".edit-icon", function() {
        console.log("Edit-Icon geklickt");
        var row = $(this).closest("tr");
        row.find("td").not(".action").each(function() {
            var text = $(this).text();
            $(this).html("<input type='text' value='" + text + "' />");
        });

        $(this).removeClass("fa-pen edit-icon").addClass("fa-check update-icon");
    });

    // Handler für den Update-Button
    $("body").on("click", ".update-icon", function() {
        console.log("Update-Icon geklickt");
        var updatedRow = $(this).closest("tr");
        updateEntry(updatedRow);
    });
});

function updateEntry(row) {
    console.log("updateEntry Funktion aufgerufen");
    var persId = row.find(".update-icon").data("persid");
    console.log("PersID:", persId);

    var updatedData = {
        Vorname: row.find("td:eq(1) input").val(),
        Nachname: row.find("td:eq(2) input").val(),
        Abteilung: row.find("td:eq(3) input").val(),
        Geburtsdatum: row.find("td:eq(4) input").val(),
        Eintrittsdatum: row.find("td:eq(5) input").val(),
        Austrittsdatum: row.find("td:eq(6) input").val()
    };
    console.log("Aktualisierte Daten:", updatedData);

    $.ajax({
        url: "../php/updateEntry.php",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify({
            id: persId,
            data: updatedData
        }),
        success: function(response) {
            console.log("Update erfolgreich: ", response);
        },
        error: function(xhr, status, error) {
            console.error("Update fehlgeschlagen: ", error);
        }
    });
    
}
