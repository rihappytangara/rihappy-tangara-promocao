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

document
.getElementById("cpf")
.addEventListener("input", function(e){

    let v = e.target.value.replace(/\D/g,'');

    v = v.replace(/(\d{3})(\d)/,'$1.$2');
    v = v.replace(/(\d{3})(\d)/,'$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/,'$1-$2');

    e.target.value = v;

});


/* ==================================
   MÁSCARA TELEFONE
================================== */

document
.getElementById("telefone")
.addEventListener("input", function(e){

    let v = e.target.value.replace(/\D/g,'');

    v = v.replace(
        /^(\d{2})(\d)/,
        '($1) $2'
    );

    v = v.replace(
        /(\d{5})(\d)/,
        '$1-$2'
    );

    e.target.value = v;

});


/* ==================================
   MÁSCARA VALOR
================================== */

document
.getElementById("valor")
.addEventListener("input", function(e){

    let v = e.target.value.replace(/\D/g,'');

    if(v === ''){
        e.target.value = '';
        return;
    }

    v = (
        parseInt(v,10) / 100
    )
    .toFixed(2)
    .replace('.',',');

    v = v.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        '.'
    );

    e.target.value = v;

});
