let notaValidada = false;
let urlNfceLida = "";

/* =========================
   LEITOR QR CODE
========================= */

document
  .getElementById("btnQrCode")
  .addEventListener("click", iniciarLeitorQr);

async function iniciarLeitorQr() {

  const reader =
    document.getElementById("reader");

  reader.style.display = "block";

  const html5QrCode =
    new Html5Qrcode("reader");

  try {

    await html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250
      },
      async (textoLido) => {

        await html5QrCode.stop();

        reader.style.display = "none";

        urlNfceLida = textoLido;

        validarNfce(textoLido);
      }
    );

  } catch (erro) {

    console.error(erro);

    reader.style.display = "none";

    document.getElementById("dadosNota").innerHTML =
      "<span style='color:red'>Não foi possível acessar a câmera.</span>";
  }
}

/* =========================
   VALIDAR NFC-E
========================= */

async function validarNfce(url) {

  const dadosNota =
    document.getElementById("dadosNota");

  dadosNota.innerHTML =
    "Validando NFC-e...";

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

      document.getElementById(
        "btnCadastrar"
      ).disabled = true;

      dadosNota.innerHTML =
        `<span style="color:red">${dados.erro}</span>`;

      return;
    }

    document.getElementById(
      "numero_nf"
    ).value = dados.numero_nf;

    document.getElementById(
      "valor_compra"
    ).value = dados.valor;

    document.getElementById(
      "chave_nf"
    ).value = dados.chave_nf;

    document.getElementById(
      "data_venda"
    ).value = dados.data_venda;

    document.getElementById(
      "emitente"
    ).value = dados.emitente;

    notaValidada = true;

    document.getElementById(
      "btnCadastrar"
    ).disabled = false;

    dadosNota.innerHTML = `
      <div style="color:green">
        <strong>Empresa:</strong> ${dados.emitente}<br>
        <strong>NFC-e:</strong> ${dados.numero_nf}<br>
        <strong>Valor:</strong> R$ ${Number(dados.valor).toLocaleString("pt-BR",{minimumFractionDigits:2})}<br>
        NFC-e validada com sucesso.
      </div>
    `;

  } catch (erro) {

    console.error(erro);

    notaValidada = false;

    document.getElementById(
      "btnCadastrar"
    ).disabled = true;

    dadosNota.innerHTML =
      "<span style='color:red'>Erro ao validar NFC-e.</span>";
  }
}

/* =========================
   CADASTRAR CUPOM
========================= */

   document
  .getElementById("cadastro")
  .addEventListener("submit", async (e) => {

    e.preventDefault();

    const resultado =
      document.getElementById("resultado");

     const erroPeriodo =
    validarPeriodoPromocao();

if (erroPeriodo) {

    resultado.innerHTML =
        `<span style="color:red">${erroPeriodo}</span>`;

    return;
}
    if (!notaValidada) {

      resultado.innerHTML =
        "<span style='color:red'>Valide a NFC-e antes de cadastrar.</span>";

      return;
    }

    const cpf =
      document
        .getElementById("cpf")
        .value
        .replace(/\D/g, "");

    const nome =
      document
        .getElementById("nome")
        .value
        .trim();

    const telefone =
      document
        .getElementById("telefone")
        .value
        .replace(/\D/g, "");

const dataBr =
  document.getElementById(
    "data_venda"
  ).value;

let dataIso = null;

if (dataBr) {

  const partes =
    dataBr.match(
      /(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/
    );

  if (partes) {

    dataIso =
      `${partes[3]}-${partes[2]}-${partes[1]} ` +
      `${partes[4]}:${partes[5]}:${partes[6]}`;
  }
}
     
if (partes) {

  dataIso =
    `${partes[3]}-${partes[2]}-${partes[1]} ` +
    `${partes[4]}:${partes[5]}:${partes[6]}`;
}

console.log("dataBr:", dataBr);
console.log("dataIso:", dataIso);
     
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
      p_data_venda: dataIso,
      p_chave_nf:
        document.getElementById(
          "chave_nf"
        ).value,
      p_emitente:
        document.getElementById(
          "emitente"
        ).value,
      p_url_nfce: urlNfceLida
    }
  );

    if (error) {

      resultado.innerHTML =
        `<span style="color:red">${error.message}</span>`;

      return;
    }

    resultado.innerHTML = `
      <h3>Cadastro realizado com sucesso</h3>
      <p>Quantidade: <strong>${data.quantidade}</strong></p>
      <p>Números da sorte:</p>
      <strong>
        ${data.numero_inicial}
        até
        ${data.numero_final}
      </strong>
    `;

    document.getElementById(
      "btnCadastrar"
    ).disabled = true;

    notaValidada = false;
  });

/* =========================
   MÁSCARA CPF
========================= */

document
  .getElementById("cpf")
  .addEventListener("input", (e) => {

    let v =
      e.target.value.replace(/\D/g, "");

    v = v.substring(0, 11);

    v = v.replace(
      /^(\d{3})(\d)/,
      "$1.$2"
    );

    v = v.replace(
      /^(\d{3})\.(\d{3})(\d)/,
      "$1.$2.$3"
    );

    v = v.replace(
      /\.(\d{3})(\d)/,
      ".$1-$2"
    );

    e.target.value = v;
  });

/* =========================
   MÁSCARA TELEFONE
========================= */

document
  .getElementById("telefone")
  .addEventListener("input", (e) => {

    let v =
      e.target.value.replace(/\D/g, "");

    v = v.substring(0, 11);

    v = v.replace(
      /^(\d{2})(\d)/,
      "($1) $2"
    );

    v = v.replace(
      /(\d{5})(\d)/,
      "$1-$2"
    );

    e.target.value = v;
  });

function validarPeriodoPromocao() {

  if (!CONFIG.PROMOCAO_ATIVA) {
    return "Promoção encerrada.";
  }

  const hoje = new Date();

  const inicio =
    new Date(CONFIG.DATA_INICIO + "T00:00:00");

  const fim =
    new Date(CONFIG.DATA_FIM + "T23:59:59");

  if (hoje < inicio) {
    return "Compra anterior a Promoção.";
  }

  if (hoje > fim) {
    return "Promoção encerrada.";
  }

  return null;
}
