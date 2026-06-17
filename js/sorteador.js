const SENHA_ADMIN = "Brinquedo1@";

const senha = prompt("Digite a senha de acesso:");

if (senha !== SENHA_ADMIN) {
    alert("Acesso negado.");
    window.location.href = "index.html";
}document
.getElementById("btnSortear")
.addEventListener("click", async () => {

    const resultado =
        document.getElementById("resultado");

    resultado.innerHTML =
        "Realizando sorteio...";

    const { data, error } =
        await supabase.rpc(
            "realizar_sorteio"
        );

    if (error) {

        resultado.innerHTML =
            "Erro: " + error.message;

        return;
    }

    resultado.innerHTML = `
        <h2>Número Sorteado</h2>

        <div class="numero">
            ${data.numero_sorteado}
        </div>

        <h2>Ganhador</h2>

        <p><b>Nome:</b> ${data.nome}</p>
        <p><b>CPF:</b> ${data.cpf}</p>
        <p><b>Telefone:</b> ${data.telefone}</p>

        <p><b>Cupom:</b> ${data.numero_cupom}</p>

        <p>
            <b>Intervalo:</b>
            ${data.numero_inicial}
            até
            ${data.numero_final}
        </p>

        <p>
            <b>Valor da Compra:</b>
            R$ ${Number(data.valor_compra)
                .toFixed(2)}
        </p>
    `;
});
