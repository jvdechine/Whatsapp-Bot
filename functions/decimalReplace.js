function changeDecimalMoney(amount){
    const UNICODE_NON_BREAKING_SPACE = String.fromCharCode(160);
    const USUAL_SPACE = String.fromCharCode(32);
    const fromFloatToMoney = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount).replace(UNICODE_NON_BREAKING_SPACE, USUAL_SPACE);
    return fromFloatToMoney;
}

function changeDecimalNumber(number){
    const UNICODE_NON_BREAKING_SPACE = String.fromCharCode(160);
    const USUAL_SPACE = String.fromCharCode(32);
    const fromFloatToDecimal = new Intl.NumberFormat('pt-BR', { style: 'decimal', currency: 'BRL' }).format(number).replace(UNICODE_NON_BREAKING_SPACE, USUAL_SPACE);
    return fromFloatToDecimal;
}

exports.changeDecimalMoney = changeDecimalMoney;
exports.changeDecimalNumber = changeDecimalNumber;