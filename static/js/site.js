function formatNumbers(num) {
    num = parseFloat(num).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    return num;
}

function applyNumberFormat(){
    // return "";
    $('.format-number').each(function (i, ele) {
        // console.log(ele)
        $(ele).removeClass('format-number');
        let number = $(ele).html();
        if (number != '') {
            let formatNumber = formatNumbers(number);
            console.log(formatNumber)
            $(ele).html(formatNumber);
        };

    });
}
// Format Numbers

$(document).ready(function () {
    applyNumberFormat()
});