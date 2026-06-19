document
.getElementById("consulta")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const cpf = document
        .getElementById("cpf")
        .value
        .replace(/\D/g,'');

    const resultado =
        document.getElementById("resultado");

    resultado.innerHTML =
        "Consultando...";

    const { data, error } =
        await supabaseClient
            .from("vw_consulta_cpf")
            .select("*")
            .eq("cpf", cpf)
            .order("created_at");

    if (error) {
        resultado.innerHTML =
            `<strong>Erro:</strong> ${error.message}`;
        return;
    }

    if (!data.length) {
        resultado.innerHTML =
            "<strong>Nenhum cupom encontrado para este CPF.</strong>";
        return;
    }

    let html = `
        <h2>${data[0].nome}</h2>
        <p>Telefone: ${data[0].telefone}</p>

        <table border="1" cellpadding="8">
            <tr>
                <th>NFC-e</th>
                <th>Valor</th>
                <th>Qtd. Números</th>
                <th>Números da Sorte</th>
            </tr>
    `;

    let totalNumeros = 0;

    data.forEach(item => {

        totalNumeros += item.qtde_numeros;

        html += `
            <tr>
                <td>${item.numero_nf}</td>
                <td>R$ ${item.valor_compra}</td>
                <td>${item.qtde_numeros}</td>
                <td>
                    ${item.numero_sorte_inicial}
                    até
                    ${item.numero_sorte_final}
                </td>
            </tr>
        `;
    });

    html += `
        </table>

        <br>

        <strong>
            Total de números da sorte:
            ${totalNumeros}
        </strong>
    `;

    resultado.innerHTML = html;

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

