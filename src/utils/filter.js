export const toDecimal = (num) => {
    if (isNaN(num) || num === null || num.toString() == '') {
        return '0.00';
    }
    let arrayNum = num.toString().split(".");
    if (arrayNum.length == 1) {
        return num.toString() + ".00";
    }
    if (arrayNum.length > 1) {
        if (arrayNum[1].length == 0) {
            return num.toString() + "00";
        }
        if (arrayNum[1].length < 2) {
            return num.toString() + "0";
        }
        return num;
    }
}

export const formatMoney = (number, decimals, thousandsSep, decPoint) => {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep,
    dec = (typeof decPoint === 'undefined') ? '.' : decPoint;
    var s = n.toString().split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
    }
    if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
    } else {
    s[1] = s[1].substring(0, prec);
    }
    return s.join(dec);
}