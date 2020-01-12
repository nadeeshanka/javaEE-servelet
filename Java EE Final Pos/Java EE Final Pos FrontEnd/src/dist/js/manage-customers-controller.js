$(document).ready(function () {
    loadCustomers();
});

var selectedRow = null;

function loadCustomers() {
    $("#tbl-customers tbody tr").remove();

    // var http = new XMLHttpRequest();
    // http.onreadystatechange = function(){
    //     if (http.status == 200 && http.readyState == 4){
    //         var customers = JSON.parse(http.responseText);
    //         for (var i = 0; i < customers.length; i++) {
    //             var html = '<tr>' +
    //                 '<td>' + customers[i].id + '</td>' +
    //                 '<td>' + customers[i].name + '</td>' +
    //                 '<td>' + customers[i].address + '</td>' +
    //                 '<td><i class="fa fa-trash"></i></td>' +
    //                 '</tr>';
    //             $("#tbl-customers tbody").append(html);
    //         }
    //     }
    // };
    // http.open('GET','http://localhost:8080/pos/api/v1/customers',true);
    // http.send();

    var ajaxConfig = {
        method: 'GET',
        url: 'http://localhost:8080/pos/api/v1/customers',
        async: true
    };
    $.ajax(ajaxConfig).done(function (customers, status, jqXHR) {
        for (var i = 0; i < customers.length; i++) {
            var html = '<tr>' +
                '<td>' + customers[i].id + '</td>' +
                '<td>' + customers[i].name + '</td>' +
                '<td>' + customers[i].address + '</td>' +
                '<td><i class="fa fa-trash"></i></td>' +
                '</tr>';
            $("#tbl-customers tbody").append(html);
        }
    }).fail(function (jqXHR, status, error) {
        console.log(error);
    });
}

$("#btnSave").click(function () {
    var customer = {
        id: $("#txtId").val(),
        name: $("#txtName").val(),
        address: $("#txtCustomerAddress").val()
    };
    // var http = new XMLHttpRequest();
    // http.onreadystatechange = function () {
    //     if (http.readyState == 4) {
    //         if (http.status == 201) {
    //             var html = "<tr>" +
    //                 "<td>"+ customer.id+"</td>" +
    //                 "<td>"+ customer.name+"</td>" +
    //                 "<td>"+ customer.address+"</td>" +
    //                 '<td><i class="fa fa-trash"></i></td>' +
    //                 "</tr>";
    //             $("#tbl-customers tbody").append(html);
    //             $("#txtId, #txtName, #txtCustomerAddress").val("");
    //             $("#txtId").focus();
    //         } else {
    //             console.log("Fail");
    //         }
    //     }
    // };
    // http.open('POST', 'http://localhost:8080/pos/api/v1/customers', true);
    // http.setRequestHeader("Content-Type", "application/json");
    // http.send(JSON.stringify(customer));
    if (!selectedRow) {
        var ajaxConfig = {
            method: 'POST',
            url: 'http://localhost:8080/pos/api/v1/customers',
            async: true,
            contentType: 'application/json',
            data: JSON.stringify(customer)
        };
        $.ajax(ajaxConfig).done(function (response, status, jqXHR) {
            var html = "<tr>" +
                "<td>" + customer.id + "</td>" +
                "<td>" + customer.name + "</td>" +
                "<td>" + customer.address + "</td>" +
                '<td><i class="fa fa-trash"></i></td>' +
                "</tr>";
            $("#tbl-customers tbody").append(html);
            $("#txtId, #txtName, #txtCustomerAddress").val("");
            $("#txtId").focus();
        }).fail(function (jqXHR, status, error) {
            console.log(error);
        });
    } else {
        var ajaxConfig = {
            method: 'PUT',
            url: 'http://localhost:8080/pos/api/v1/customers',
            async: true,
            contentType: 'application/json',
            data: JSON.stringify(customer)
        };
        $.ajax(ajaxConfig).done(function (response, status, jqXHR) {
            selectedRow.find("td:nth-child(2)").text(customer.name);
            selectedRow.find("td:nth-child(3)").text(customer.address);
        }).fail(function (jqXHR, status, error) {
            console.log(error);
        }).always(function(){
            $("#btnClear").click();
        });
    }
});

$("#tbl-customers tbody").on('click', "tr td:last-child", function (eventData) {
    var row = $(this).parents("tr");
    eventData.stopPropagation();
    if (confirm("Are you sure whether you want delete this customer?")) {
        $.ajax({
            method: 'DELETE',
            url: 'http://localhost:8080/pos/api/v1/customers?customerId=' + row.find('td:first-child').text(),
            async: true
        }).done(function (response, status, jqXHR) {
            row.remove();
        }).fail(function (jqXHR, status, error) {
            console.log(error);
        });
    }
});

$("#tbl-customers tbody").on('click', 'tr', function () {
    selectedRow = $(this);
    $("#txtId").val($(this).find("td:first-child").text());
    $("#txtName").val($(this).find("td:nth-child(2)").text());
    $("#txtCustomerAddress").val($(this).find("td:nth-child(3)").text());
    $("#txtId").attr("disabled", 'true');
    $("#tbl-customers tbody tr").removeClass('row-selected');
    selectedRow.addClass('row-selected');
});

$("#btnClear").click(function(){
    $("#txtId, #txtName, #txtCustomerAddress").val("");
    $("#txtId").attr('disabled',false);
    $("#tbl-customers tbody tr").removeClass('row-selected');
    selectedRow = null;
    $("#txtId").focus();
});
