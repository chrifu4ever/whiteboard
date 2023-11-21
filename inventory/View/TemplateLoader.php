<?php
/**
 * Created by PhpStorm.
 * User: chrif
 * Date: 23.02.2018
 * Time: 21:21
 */

class TemplateLoader
{


    function loadHeader()
    {
        return file_get_contents('View/templates/header.cfu');
    }

}