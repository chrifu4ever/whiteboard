<?php
exec('/usr/bin/pdf2svg -v', $output, $return_var);
echo "Rückgabewert: $return_var\n";
echo "Ausgabe:\n";
foreach ($output as $line) {
    echo $line . "\n";
}
?>
