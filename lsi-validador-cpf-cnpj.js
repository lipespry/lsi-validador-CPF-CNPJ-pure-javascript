//_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-//
//. ___.....LSI...........________.......______..................__..__.......//
//./\  \................./\  _____\...../ _____\......LSI......./\ \ \ \......//
//.\ \_ \.......__  _____\ \ \____/..../\ \____/ ______  __  ___\ \ \_\ \..LSI//
//..\//\ \...../\_\/\  __ \ \ \_____...\ \ \____/\  __ \/\ \/ ___\ \____ \....//
//....\ \ \....\/\ \ \ \/ /\ \  ____\...\ \____ \ \ \/ /\ \  /___/\/____\ \...//
//.....\ \ \..._\ \ \ \  /..\ \ \___/....\/____\ \ \  /..\ \ \.........\ \ \..//
//.LSI..\_\ \__\ \ \ \ \ \...\ \ \______....____\ \ \ \...\ \ \.......__\_\ \.//
//....../\________\ \_\ \_\...\ \_______\../\_____/\ \_\...\ \ \...../\_____/.//
//......\/________/\/_/\/_/....\/_______/..\/____/..\/_/....\/_/.....\/____/..//
//¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-//
//    LSI          Felipe Moraes - felipemdeoliveira@live.com          LSI    //
//¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-¯-//

function LSIValidaCPFCPNJ(opcoesUsuario)
{
    'use strict';

    // Opções padrão
    this.padrao = {

        // Adicionar máscara enquanto digita?
        // CPF: 000.000.000-00
        // CNPJ: 00.000.000/0000-00
        mascara: true,

        // Quais tipos de documentos são aceitos?
        // CPF: 'cpf'
        // CNPJ: 'cnpj'
        // AMBOS: 'cpfcnpj'
        tipo: 'cpfcnpj',

        // Qual o evento gatilho para a validação?
        // Ao sair do input: 'focusout'
        // Ao clicar no input: 'click'
        // Ao inserir dados no input: 'input'
        // Ao alterar o input: 'change'
        // Ao abaixar alguma tecla: 'keydown'
        // Ao levantar alguma tecla: 'keyup'
        // ...
        evento: 'change',

        // Ação a ser executada quando o documento for válido
        valido: function(){
            console.log('Documento válido');
        },

        // Ação a ser executada quando o documento for inválido
        invalido: function(){
            console.log('Documento inválido');
        },

        vazio: function(){
            console.log('Documento em branco');
        }
    }

    // Preparação das opções
    for (let opcao in this.padrao) {
        this[opcao] = this.padrao[opcao];
    }

    if (typeof opcoesUsuario == 'object') {
        for (let opcao in opcoesUsuario) {
            this[opcao] = opcoesUsuario[opcao];
        }
    }

    // Extendendo o escopo da instância
    let inst = this;

    // Preparação do input
    if (inst.tipo == 'cpf')
        inst.alvo.setAttribute('maxlength', 14);
    else
        inst.alvo.setAttribute('maxlength', 18);

    // Inicialização da máscara
    if (inst.mascara == true) {
        inst.alvo.addEventListener(
            'input',
            function(){
                inst.execMascara();
            },
            false
        );
    }

    // Inicialização da validação
    inst.alvo.addEventListener(
        inst.evento,
        function(){
            if (inst.alvo.value == '')
                inst.vazio();
            else if (inst.tipo == 'cpf') {
                if (inst.validaCpf() === true)
                    inst.valido();
                else
                    inst.invalido();
            } else if (inst.tipo == 'cnpj') {
                if (inst.validaCnpj() === true)
                    inst.valido();
                else
                    inst.invalido();
            } else if (inst.tipo == 'cpfcnpj') {
                if (
                    (inst.alvo.value.length == 14 && inst.validaCpf() === true)
                    || (inst.alvo.value.length == 18 && inst.validaCnpj() === true)
                    )
                    inst.valido();
                else
                    inst.invalido();
            }
        },
        false
    );

    this.execMascara = function()
    {
        let valor = inst.alvo.value;
        valor = valor.replace(/\D/g, '');

        if (inst.tipo == 'cpf' && valor.length <= 11)
            inst.alvo.value = inst.mascaraCpf(valor);
        else if (inst.tipo == 'cnpj' && valor.length <= 14)
            inst.alvo.value = inst.mascaraCnpj(valor);
        else if (inst.tipo == 'cpfcnpj' && valor.length <= 14) {
            if (valor.length <= 11)
                inst.alvo.value = inst.mascaraCpf(valor);
            else
                inst.alvo.value = inst.mascaraCnpj(valor);
        } else
            inst.alvo.value = valor;
    }

    this.mascaraCpf = function(num)
    {
        num = num.replace(/(\d{3})(\d)/,"$1.$2");
        num = num.replace(/(\d{3})(\d)/,"$1.$2");
        num = num.replace(/(\d{3})(\d{1,2})$/,"$1-$2");
        return num;
    }

    this.mascaraCnpj = function(num)
    {
        num = num.replace(/(\d{2})(\d)/, '$1.$2');
        num = num.replace(/(\d{3})(\d)/, '$1.$2');
        num = num.replace(/(\d{3})(\d)/, '$1/$2');
        num = num.replace(/(\d{4})(\d)/, '$1-$2');
        return num;
    }

    this.validaCpf = function()
    {
        let Soma;
        let Resto;
        let strCPF;
        strCPF = inst.alvo.value.replace(/\D/g,"");
        Soma = 0;

        for (let i = 0; i <= 9; i++) {
            let repetidos = ('').padStart(strCPF.length, i);
            if (strCPF == repetidos)
                return false;
        }

        for (let i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
            Resto = (Soma * 10) % 11;
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
        Soma = 0;
        for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
            Resto = (Soma * 10) % 11;
        if ((Resto == 10) || (Resto == 11))  Resto = 0;
        if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
        return true;
    }

    this.validaCnpj = function()
    {
        let cnpj = inst.alvo.value.replace(/[^\d]+/g,'');

        if (cnpj.length != 14)
            return false;

        for (let i = 0; i <= 9; i++) {
            let repetidos = ('').padStart(cnpj.length, i);
            if (cnpj == repetidos)
                return false;
        }

        let tamanho = cnpj.length - 2
        let numeros = cnpj.substring(0,tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        let resultado;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return false;
        tamanho = tamanho + 1;
        numeros = cnpj.substring(0,tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            return false;
        return true;
    }
}

HTMLInputElement.prototype.LSIValidaCPFCPNJ = function(opcoes) {
    if (typeof opcoes == 'undefined')
        opcoes = {}
    opcoes.alvo = this;
    new LSIValidaCPFCPNJ(opcoes);
}

NodeList.prototype.LSIValidaCPFCPNJ = function(opcoes){
    this.forEach(
        function(obj){
            if (obj.constructor.name === 'HTMLInputElement')
                obj.LSIValidaCPFCPNJ(opcoes);
        }
    );
}
