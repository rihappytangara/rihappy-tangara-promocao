/* ==================================
   VALIDAR NFC-E
================================== */

let notaValidada = false;

document
.getElementById("validarNota")
.addEventListener("click", async () => {

    const url = document
        .getElementById("url_nfce")
        .value
        .trim();

    const dadosNota =
        document.getElementById("dadosNota");

    if (!url) {

        dadosNota.innerHTML = `
            <div style="color:red;">
                Informe a URL da NFC-e.
            </div>
        `;

        return;
    }

    dadosNota.innerHTML = `
        <div>
            Validando NFC-e...
        </div>
    `;

    try {

        const resposta = await fetch(
            "https://ksltubnnpphxqhjycdau.supabase.co/functions/v1/validar-nfce",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    url
                })
            }
        );

        const dados = await resposta.json();

        if (!dados.sucesso) {

            notaValidada = false;

            dadosNota.innerHTML = `
                <div style="color:red;">
                    ${dados.erro || "NFC-e inválida"}
                </div>
            `;

            document
                .getElementById("btnCadastrar")
                .disabled = true;

            return;
        }

        document.getElementById("numero_nf").value =
            dados.numero_nf;

        document.getElementById("valor_compra").value =
            dados.valor;

        document.getElementById("chave_nf").value =
            dados.chave_nf;

        document.getElementById("data_venda").value =
            dados.data_venda;

        document.getElementById("emitente").value =
            dados.emitente;

        notaValidada = true;

        document
            .getElementById("btnCadastrar")
            .disabled = false;

        dadosNota.innerHTML = `
            <div style="color:green;">
                <p>
                    <strong>Empresa:</strong>
                    ${dados.emitente}
                </p>

                <p>
                    <strong>NFC-e:</strong>
                    ${dados.numero_nf}
                </p>

                <p>
                    <strong>Valor:</strong>
                    R$ ${Number(dados.valor)
                        .toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        )}
                </p>

                <p>
                    NFC-e validada com sucesso.
                </p>
            </div>
        `;

    } catch (erro) {

        notaValidada = false;

        document
            .getElementById("btnCadastrar")
            .disabled = true;

        dadosNota.innerHTML = `
            <div style="color:red;">
                Erro ao validar NFC-e.
            </div>
        `;

        console.error(erro);
    }

});


/* ==================================
   CADASTRAR CUPOM
================================== */

document
.getElementById("cadastro")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const resultado =
        document.getElementById("resultado");

    if (!notaValidada) {

        resultado.innerHTML = `
            <div style="color:red;">
                Valide a NFC-e antes de cadastrar.
            </div>
        `;

        return;
    }

    const cpf = document
        .getElementById("cpf")
        .value
        .replace(/\D/g, '');

    const nome = document
        .getElementById("nome")
        .value
        .trim();

    const telefone = document
        .getElementById("telefone")
        .value
        .replace(/\D/g, '');

    if (cpf.length !== 11) {

        resultado.innerHTML = `
            <div style="color:red;">
                CPF inválido.
            </div>
        `;

        return;
    }

    if (telefone.length !== 11) {

        resultado.innerHTML = `
            <div style="color:red;">
                Telefone inválido.
            </div>
        `;

        return;
    }

    resultado.innerHTML = `
        <div>
            Processando cadastro...
        </div>
    `;

    const { data, error } =
        await supabaseClient.rpc(
            "registrar_cupom",
            {

                p_cpf: cpf,

                p_nome: nome,

                p_telefone: telefone,

                p_valor_compra: parseFloat(
                    document.getElementById(
                        "valor_compra"
                    ).value
                ),

                p_numero_nf:
                    document.getElementById(
                        "numero_nf"
                    ).value,

                p_data_venda:
                    document.getElementById(
                        "data_venda"
                    ).value,

                p_chave_nf:
                    document.getElementById(
                        "chave_nf"
                    ).value,

                p_emitente:
                    document.getElementById(
                        "emitente"
                    ).value,

                p_url_nfce:
                    document.getElementById(
                        "url_nfce"
                    ).value

            }
        );

    if (error) {

        resultado.innerHTML = `
            <div style="color:red;">
                <strong>Erro:</strong>
                ${error.message}
            </div>
        `;

        return;
    }

    resultado.innerHTML = `
        <h3>
            Cadastro realizado com sucesso
        </h3>

        <p>
            Quantidade de números:
            <strong>
                ${data.quantidade}
            </strong>
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

    document
        .getElementById("cadastro")
        .reset();

    document
        .getElementById("btnCadastrar")
        .disabled = true;

    document
        .getElementById("dadosNota")
        .innerHTML = "";

    notaValidada = false;

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
