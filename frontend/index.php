<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sidler Transport Whiteboard</title>
    <link rel="stylesheet" href="../css/frontend.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>

<body>

    <div id="main-div">

        


        <div id="canvas-container">
            <canvas id="main-canvas" width="1920" height="1080"></canvas>
        </div>

        <div id="right-div">
            <img class="logo" src="img/sidler_transporte-Logo_ohne Rahmen.png">
            <div id="birthday-div">
                <h2>Geburtstage</h2>
                <p>Wir wünschen alles Gute zum Geburtstag</p>
                <div class="birthday_person">
                    <img src="img/b7975b2684.jpg">
                    <div class="text">
                        <p>Vorname Nachname<br>
                            01.01.2023</p>
                    </div>
                </div>
                <div class="birthday_person">
                    <img src="img/b7975b2684.jpg">
                    <div class="text">
                        <p>Vorname Nachname<br>
                            01.01.2023</p>
                    </div>
                </div>
                <div class="birthday_person">
                    <img src="img/b7975b2684.jpg">
                    <div class="text">
                        <p>Vorname Nachname<br>
                            01.01.2023</p>
                    </div>
                </div>


            </div>
            <div id="other-div">
                <h2>Ein- & Austritte</h2>
                <p>Gerne informieren wir euch über die aktuellen Ein- & Austritte:</p>
                <h3><b>Eintritt per 01.11.2023</b></h3>
                <div id="screenSizeInfoDiv"></div>
            </div>
        </div>
    </div>

    <script src="../js/frontend.js"></script>

    <script>
        window.onload = function () {
            updateScreenSize();
            window.addEventListener('resize', updateScreenSize);
        }
        function updateScreenSize() {
            let screenX = window.innerWidth;
            let screenY = window.innerHeight;

            document.getElementById("screenSizeInfoDiv").innerHTML = "Screen Size: " + screenX + " x " + screenY;
        }
    </script>


</body>

</html>