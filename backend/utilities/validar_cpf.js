function validarCPF(cpf) {

    
    if (Number.isNaN(Number(cpf))) {
        return {
            message: "O CPF deve conter apenas números",
            type: `error`
        };
    }
    
    if (cpf.length !== 11) {
        return {
            message: "O CPF deve conter 11 dígitos",
            type: `error`
        };
    }


    // verificar se todos os digitos sao iguais
    if (cpf.split("").every((char) => char === cpf[0])) {
        return {
            message: "CPF inválido",
            type: `error`
        };
    }

    
    let soma = 0;
    let resto;
    
    //validar primeiro digito
    for (let i = 1; i <= 9; i++) {
        soma += Number(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    
    let digito_um = resto === 10 || resto === 11 ? 0 : resto;
    
    
    // validar segundo digito
    soma = 0;

    for (let i = 1; i <= 10; i++) {
        soma += Number(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;

    let digito_dois = resto === 10 || resto === 11 ? 0 : resto;    

    if (Number(cpf.substring(9, 11)) !== Number(`${digito_um}${digito_dois}`)) {
        return {
            message: "CPF inválido",
            type: `error`
        };
    } else {
        return {
            message: "CPF válido",
            type: `success`,
            cpf: cpf
        }
    }

}

module.exports = validarCPF;