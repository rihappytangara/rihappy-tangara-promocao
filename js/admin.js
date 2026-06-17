const SENHA_ADMIN = "Temperro28@";

document
    .getElementById("entrar")
    .addEventListener("click", () => {

        const senha =
            document.getElementById("senha").value;

        if (senha === SENHA_ADMIN) {

            sessionStorage.setItem(
                "admin_logado",
                "sim"
            );

            location.href = "sorteador.html";

        } else {

            alert("Senha inválida.");

        }
    });
