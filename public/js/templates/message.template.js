"use strict";

function messageTemplate(data, element) {
    let output = "";

    if (data.response === false) {
        output += 
        `<div class="alert alert-danger alert-dismissible fade show">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;
        $(data.errors).each(function (index, value) {
            output += `<p class="lead"><i class="fa fa-exclamation-circle mr-2"></i>${value}</p>`;
        });
        output += "</div>";
        element.html(output);
        return false;
    } else {
        output += 
        `<div class="alert alert-success alert-dismissible fade show">
            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <p class="lead"><i class="fa fa-check-circle-o mr-2"></i>${data.success}</p>
        </div>`;
        element.html(output);
        return true;
    }
}
