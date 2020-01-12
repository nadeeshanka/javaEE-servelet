$(document).ready(function () {

    loadCustomers();

});

function loadCustomers() {
    $("#tbl-customers tbody tr").remove();

    var http = new XMLHttpRequest();
    http.onreadystatechange = function(){
        if (http.status == 200 && http.readyState == 4){
            var customers = JSON.parse(http.responseText);
            for (var i = 0; i < customers.length; i++) {
                var html = '<tr>' +
                    '<td>' + customers[i].id + '</td>' +
                    '<td>' + customers[i].name + '</td>' +
                    '<td>' + customers[i].address + '</td>' +
                    '<td><i class="fa fa-trash"></i></td>' +
                    '</tr>';
                $("#tbl-customers tbody").append(html);
            }
        }
    }
    http.open('GET','http://localhost:8080/api/v1/customers',true);
    http.send();
}

