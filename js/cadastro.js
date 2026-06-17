document
.getElementById("cadastro")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const cpf = document.getElementById("cpf").value;
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const valor = parseFloat(
        document.getElementById("valor").value.replace(",", ".")
    );
    const cupom = document.getElementById("cupom").value;
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
        resultado.innerHTML =
            `<strong>Erro:</strong> ${error.message}`;
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
});
