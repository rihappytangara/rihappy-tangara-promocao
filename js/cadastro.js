document
.getElementById("cadastro")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const cpf = document
        .getElementById("cpf")
        .value
        .replace(/\D/g,'');

    const nome = document
        .getElementById("nome")
        .value
        .trim();

    const telefone = document
        .getElementById("telefone")
        .value
        .replace(/\D/g,'');

    const valor = parseFloat(
        document
            .getElementById("valor")
            .value
            .replace(/\./g,'')
            .replace(',','.')
    );

    const cupom = document
        .getElementById("cupom")
        .value
        .trim();

    const pdv = parseInt(
        document.getElementById("pdv").value
    );

    const { data, error } = await supabaseClient.rpc(
        "registrar_cupom",
        {
            p_cpf: cpf,
            p_nome: nome,
            p_telefone: telefone,
            p_valor_compra: valor,
            p_numero_cupom: cupom,
            p_pdv: pdv
        }
    );

    const resultado =
        document.getElementById("resultado");

    if(error){

        resultado.innerHTML = `
            <div style="color:red;">
                <strong>Erro:</strong>
                ${error.message}
            </div>
        `;

        return;
    }

    resultado.innerHTML = `
        <h3>Cadastro realizado com sucesso</h3>

        <p>
            Quantidade de números:
            <strong>${data.quantidade}</strong>
        </p>

        <p>
            Seus números da sorte:
            <strong>
                ${data.numero_inicial}
                até
                ${data.numero_final}
            </strong>
        </p>
    `;

    document.getElementById("cadastro").reset();

    document
        .getElementById("cpf")
        .focus();

});


/* ==================================
   MÁSCARA CPF
================================== */

document.getElementById("cpf")
.addEventListener("input", function(e){

    let valor = e.target.value;

    valor = valor.replace(/\D/g,'');

    valor = valor.substring(0,11);

    valor = valor.replace(
        /^(\d{3})(\d)/,
        '$1.$2'
    );

    valor = valor.replace(
        /^(\d{3})\.(\d{3})(\d)/,
        '$1.$2.$3'
    );

    valor = valor.replace(
        /\.(\d{3})(\d)/,
        '.$1-$2'
    );

    e.target.value = valor;

});


/* ==================================
   MÁSCARA TELEFONE
================================== */

document.getElementById("telefone")
.addEventListener("input", function(e){

    let valor = e.target.value;

    valor = valor.replace(/\D/g,'');

    valor = valor.substring(0,11);

    valor = valor.replace(
        /^(\d{2})(\d)/,
        '($1) $2'
    );

    valor = valor.replace(
        /(\d{5})(\d)/,
        '$1-$2'
    );

    e.target.value = valor;

});


/* ==================================
   MÁSCARA VALOR
================================== */

document.getElementById("valor")
.addEventListener("input", function(e){

    let valor = e.target.value;

    valor = valor.replace(/\D/g,'');

    if(!valor){
        e.target.value = '';
        return;
    }

    valor = (parseInt(valor,10) / 100)
        .toLocaleString(
            'pt-BR',
            {
                minimumFractionDigits:2,
                maximumFractionDigits:2
            }
        );

    e.target.value = 'R$ ' + valor;

});
