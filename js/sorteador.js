if (
    sessionStorage.getItem("admin_logado")
    !== "sim"
) {
    location.href = "admin.html";
}
async function carregarResumo() {

    const { data: cupons } = await supabaseClient
        .from('cupons')
        .select('numero_sorte_final')
        .order('numero_sorte_final', { ascending: false })
        .limit(1);

    if (cupons && cupons.length > 0) {
        document.getElementById('totalNumeros').innerText =
            cupons[0].numero_sorte_final;
    }

    const { count } = await supabaseClient
        .from('sorteios')
        .select('*', { count: 'exact', head: true });

    document.getElementById('totalSorteios').innerText =
        count || 0;
}

async function carregarHistorico() {

    const { data, error } = await supabaseClient
        .from('sorteios')
        .select(`
            numero_sorteado,
            created_at,
            cliente_id
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    let html = '';

    for (const item of data) {

        const { data: cliente } = await supabaseClient
            .from('clientes')
            .select('nome')
            .eq('id', item.cliente_id)
            .single();

        html += `
            <tr>
                <td>${new Date(item.created_at).toLocaleString('pt-BR')}</td>
                <td>${item.numero_sorteado}</td>
                <td>${cliente?.nome || ''}</td>
            </tr>
        `;
    }

    document.getElementById('historico').innerHTML = html;
}

async function realizarSorteio() {

    if (!confirm('Confirma realizar o sorteio?')) {
        return;
    }

    const { data, error } = await supabaseClient
        .rpc('realizar_sorteio');

    if (error) {
        alert(error.message);
        console.error(error);
        return;
    }

    document.getElementById('numeroSorteado').innerText =
        data.numero_sorteado;

    document.getElementById('nome').innerText =
        data.nome;

    document.getElementById('cpf').innerText =
        data.cpf;

    document.getElementById('telefone').innerText =
        data.telefone;

    document.getElementById('cupom').innerText =
        data.numero_cupom;

    document.getElementById('valor').innerText =
        Number(data.valor_compra).toFixed(2);

    document.getElementById('faixa').innerText =
        `${data.numero_inicial} até ${data.numero_final}`;

    await carregarResumo();
    await carregarHistorico();
}

document
    .getElementById('btnSortear')
    .addEventListener('click', realizarSorteio);

carregarResumo();
carregarHistorico();
document
    .getElementById("btnSair")
    .addEventListener("click", () => {

        sessionStorage.removeItem(
            "admin_logado"
        );

        location.href = "admin.html";

    });
