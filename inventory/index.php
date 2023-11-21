<html>
<?php
require "Controller/Controller.php";
include("View/TemplateLoader.php");
$loader = new TemplateLoader();
echo $loader->loadHeader();
?>
<script src="Controller/js/scripts.js"></script>
<script src="Controller/js/ajax.js"></script>
<div class="col-3 menu">
        <form method="get">
            <input type="text" name="searchTf" id="searchTf" placeholder="Was suchst du??" onkeypress="callCreateTable(this.value)" autofocus
                   autocomplete="off">

        </form>
</div>




<div id="tableDiv"></div>

</body>
</html>
