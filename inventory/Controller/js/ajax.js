
function callDeleteProduct(a)
{
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            document.getElementById("tr_"+a).remove();
        }



    };
    xmlhttp.open('GET','Controller/Controller.php?q='+a,true);
    xmlhttp.send();

}

function callCreateTable(a)
{

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            document.getElementById("tableDiv").innerHTML = xmlhttp.responseText;
            console.log("Bin dabei "+a);


        }



    };
    xmlhttp.open('GET','Controller/Controller.php?k='+a,true);
    xmlhttp.send();

}