<?php
require_once('../php/connectDB.php');
$db = new ConnectDB();
$todaysBirthdays = $db->getTodaysBirthdays();
$leavingPerson = $db->getLeavingPerson();
$joiningPerson = $db->getJoiningPerson();
?>

<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sidler Transport Whiteboard</title>
    <link rel="stylesheet" href="../css/frontend.css">
</head>

<body>

    <div id="main-div">
        <div id="canvas-container">
            <canvas id="main-canvas" width="3446" height="2160"></canvas>
            <div id="screenSizeInfoDiv"></div>
        </div>

        <div id="right-div">
            <img class="logo" src="img/sidler_transporte-Logo_ohne Rahmen.png">
            <div id="birthday-div">
                <h2>Geburtstage</h2>
                <?php if (count($todaysBirthdays) > 0): ?>
                    <p>Wir gratulieren herzlich zum Geburtstag und wünschen alles Gute:</p>
                    <div class="person_flex">
                        <?php foreach ($todaysBirthdays as $person): ?>
                            <div class="person">
                                <img class="personal_pic"
                                    src="../personal/personalbilder/<?php echo htmlspecialchars($person['Foto']); ?>">
                                <div class="personal_info">
                                    <p class="personal_name">
                                        <?php echo htmlspecialchars($person['Vorname']); ?>
                                        <?php echo htmlspecialchars($person['Nachname']); ?><br>
                                        <b>
                                            <?php echo htmlspecialchars($person['Abteilung']); ?>
                                        </b>
                                    </p>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php else: ?>
                    <p>Heute hat niemand Geburtstag.</p>
                <?php endif; ?>
            </div>
            <div id="information_div">
                <h2>Ein- & Austritte</h2>
                <p>Gerne informieren wir euch über die aktuellen Ein- & Austritte:</p>

                <?php if (count($leavingPerson) > 0): ?>
                    <?php
                    $firstDayNextMonth = date('01.m.Y', strtotime('first day of next month'));
                    ?>
                    <h3><b>Austritt per
                            <?php echo $firstDayNextMonth; ?>
                        </b></h3>
                    <div class="person_flex">
                        <?php foreach ($leavingPerson as $person): ?>
                            <div class="person">
                                <img class="personal_pic"
                                    src="../personal/personalbilder/<?php echo htmlspecialchars($person['Foto']); ?>">
                                <div class="personal_info">
                                    <p class="personal_name">
                                        <?php echo htmlspecialchars($person['Vorname']); ?>
                                        <?php echo htmlspecialchars($person['Nachname']); ?><br>
                                        <b>
                                            <?php echo htmlspecialchars($person['Abteilung']); ?>
                                        </b>
                                    </p>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <p>Wir danken euch für die Zusammenarbeit und wünschen euch für die Zukunft alles Gute.</p>
                <?php else: ?>
                    <!-- Optionaler Code für den Fall, dass keine Austritte anstehen -->
                <?php endif; ?>
                <?php if (count($joiningPerson) > 0): ?>
                    <?php
                    $firstDayNextMonth = date('01.m.Y', strtotime('first day of next month'));
                    ?>
                    <h3><b>Eintritt per
                            <?php echo $firstDayNextMonth; ?>
                        </b></h3>
                    <div class="person_flex">
                        <?php foreach ($joiningPerson as $person): ?>

                            <div class="person">
                                <img class="personal_pic"
                                    src="../personal/personalbilder/<?php echo htmlspecialchars($person['Foto']); ?>">
                                <div class="personal_info">
                                    <p class="personal_name">
                                        <?php echo htmlspecialchars($person['Vorname']); ?>
                                        <?php echo htmlspecialchars($person['Nachname']); ?><br>
                                        <b>
                                            <?php echo htmlspecialchars($person['Abteilung']); ?>
                                        </b>
                                    </p>
                                </div>
                            </div>

                        <?php endforeach; ?>
                    </div>
                    <p>Herzlich willkommen im Team! Wir freuen uns auf die Zusammenarbeit.</p>
                <?php else: ?>
                    <!-- Optionaler Code für den Fall, dass keine Eintritte anstehen -->
                <?php endif; ?>


            </div>
        </div>
    </div>

    <script src="../js/frontend.js"></script>
</body>

</html>