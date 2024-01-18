$(document).ready(function () {
  // Handler für den Edit-Button
  $("body").on("click", ".edit-icon", function () {
    console.log("Edit-Icon geklickt");
    var row = $(this).closest("tr");
    row
      .find("td")
      .not(".action")
      .each(function () {
        var text = $(this).text();
        $(this).html("<input type='text' value='" + text + "' />");
      });

    $(this).removeClass("fa-pen edit-icon").addClass("fa-check update-icon");
  });

  // Handler für den Update-Button
  $("body").on("click", ".update-icon", function () {
    console.log("Update-Icon geklickt");
    var updatedRow = $(this).closest("tr");
    updateEntry(updatedRow);
  });

  $("body").on("click", ".delete-icon", function () {
    var row = $(this).closest("tr");
    var persId = row.find(".edit-icon").data("persid");
    deleteEntry(persId);
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
    Geburtsdatum: convertDateFormat(row.find("td:eq(4) input").val()),
    Eintrittsdatum: convertDateFormat(row.find("td:eq(5) input").val()),
    Austrittsdatum: convertDateFormat(row.find("td:eq(6) input").val()),
  };
  console.log("Aktualisierte Daten:", updatedData);
  // Datum Validierung
  if (
    !isValidDate(updatedData.Geburtsdatum) ||
    !isValidDate(updatedData.Eintrittsdatum) ||
    !isValidDate(updatedData.Austrittsdatum)
  ) {
    Swal.fire({
      title: "Ungültiges Datumsformat",
      text: "Bitte verwenden Sie das Format DD.MM.JJJJ oder JJJJ-MM-DD.",
      icon: "warning",
      confirmButtonText: "OK",
    });
    return; // Verhindere das Senden der Anfrage
  }

  $.ajax({
    url: "../php/updateEntry.php",
    type: "post",
    contentType: "application/json",
    data: JSON.stringify({
      id: persId,
      data: updatedData,
    }),
    success: function (response) {
      console.log("Update erfolgreich: ", response);
      Swal.fire({
        title: "Erfolg!",
        text:
          updatedData.Vorname +
          " " +
          updatedData.Nachname +
          " wurde angepasst.",
        icon: "success",
      }).then(() => {
        window.location.reload();
      });
    },
    error: function (xhr, status, error) {
      console.error("Update fehlgeschlagen: ", error);
      Swal.fire({
        title: "Fehler!",
        text: "Fehler beim Update.",
        icon: "error",
      });
    },
  });
}

function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/; // Regulärer Ausdruck für JJJJ-MM-DD
  var regEx2 = /^\d{2}\.\d{2}\.\d{4}$/; // Regulärer Ausdruck für DD.MM.JJJJ
  if (dateString.match(regEx) != null || dateString.match(regEx2) != null) {
    return true; // Valid date format
  } else {
    return false; // Invalid date format
  }
}

function convertDateFormat(dateString) {
  var regEx = /^\d{2}\.\d{2}\.\d{4}$/; // Regulärer Ausdruck für DD.MM.JJJJ
  if (dateString.match(regEx) != null) {
    // Wandelt DD.MM.JJJJ in JJJJ-MM-DD um
    var parts = dateString.split(".");
    return parts[2] + "-" + parts[1] + "-" + parts[0];
  } else {
    // Gibt das Datum unverändert zurück, wenn es nicht im DD.MM.JJJJ Format ist
    return dateString;
  }
}

function deleteEntry(persId) {
  Swal.fire({
    title: "Sind Sie sicher?",
    text: "Dieser Eintrag wird dauerhaft gelöscht!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ja, löschen!",
    cancelButtonText: "Abbrechen",
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "../php/deleteEntry.php",
        type: "post",
        data: { id: persId },
        success: function (response) {
          console.log("Löschen erfolgreich: ", response);
          window.location.reload(); // Seite neu laden
        },
        error: function (xhr, status, error) {
          console.error("Löschen fehlgeschlagen: ", error);
        },
      });
    }
  });
}


function createNewEmployee() {
    var modal = document.getElementById('newEmployeeModal');
    var span = document.getElementsByClassName('close')[0];

    // Modal öffnen
    modal.style.display = 'block';

    // Modal schließen, wenn auf das (x) geklickt wird
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // Modal schließen, wenn außerhalb des Modals geklickt wird
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}
