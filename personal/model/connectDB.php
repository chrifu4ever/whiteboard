<?php

class ConnectDB
{
    public function connect()
    {

        $sql = new mysqli("172.23.0.2", "root", "einSehrGutesPasswort123", "sidler_db");
        mysqli_set_charset($sql,"utf8");
        if ($sql->connect_errno) {
            echo "Failed to connect to MySQL: (" . $sql->connect_errno . ") " . $sql->connect_error;
        } else

       return $sql;
    }
}

?>