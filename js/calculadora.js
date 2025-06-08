document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("calcForm");
    const tabela = document.getElementById("calcTabela");
    const modal = document.getElementById("modal");
    const modalNome = document.getElementById("modalNome");
    const modalDataNasc = document.getElementById("modalDataNasc");
    const closeModal = document.querySelector(".close");

    let idades = [];
    let calcEditando = null;

    // 🔹 Carrega as idades do localStorage
    const idadesSalvas = localStorage.getItem("idades");
    if (idadesSalvas) {
        idades = JSON.parse(idadesSalvas);
        atualizarTabela();
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        let idIdadeInput = document.getElementById("idIdade");
        let idIdade = idIdadeInput ? idIdadeInput.value.trim() : "";

        if (!idIdade) {
            // Gera ID novo (Último ID + 1)
            
            const ultimoId = idades.length > 0 ? Math.max(...idades.map(i => parseInt(i.id))) : 0;
            idIdade = (ultimoId + 1).toString();

        }

        const nome = document.getElementById("Nome").value.trim();
        const dataNasc = document.getElementById("dataNasc").value.trim();

        if (!idIdade || !nome || !dataNasc) {
            alert("Preencha todos os campos!");
            return;
        }

        const novaIdade = {
            id: idIdade,
            nome: nome,
            dataNasc: dataNasc,
            idade: calcularIdade(dataNasc)
        };

        if (calcEditando !== null) {
            idades[calcEditando] = novaIdade;
            calcEditando = null;
            document.querySelector(".calcularSubmit").textContent = "Adicionar Idade";
        } else {
            idades.push(novaIdade);
        }

        salvarIdades();
        atualizarTabela();
        form.reset();
    });

    function atualizarTabela() {
        tabela.innerHTML = "";

        idades.forEach((idade, index) => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${idade.id}</td>
                <td>${idade.nome}</td>
                <td>${calcularIdade(idade.dataNasc)} </td>
                <td>
                    <button class="details-btn">Detalhes</button>
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Excluir</button>
                </td>
            `;

            linha.querySelector(".details-btn").addEventListener("click", function () {
                abrirModal(idade.id, idade.nome, idade.dataNasc, idade.descricao);
            });

            linha.querySelector(".edit-btn").addEventListener("click", function () {
                editarIdade(index);
            });

            linha.querySelector(".delete-btn").addEventListener("click", function () {
                excluirIdade(index);
            });

            tabela.appendChild(linha);
        });
    }

    // Função para calcular a idade através da data de nascimento
    function calcularIdade(dataNascimento){
        const hoje = new Date();
        const nascimento = new Date(dataNascimento);

        let anos = hoje.getFullYear() - nascimento.getFullYear();
        let meses = hoje.getMonth() - nascimento.getMonth();
        let dias = hoje.getDate() - nascimento.getDate();

        if (dias < 0) {
            meses--;
            dias += new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate();
        }
        if (meses < 0) {
            anos--;
            meses += 12;
        }

        return `${anos} anos, ${meses} meses, ${dias} dias`;
    }

    function abrirModal(id, nome, dataNasc) {
        document.getElementById("modalId").textContent = id;
        modalNome.textContent = nome;
        modalDataNasc.textContent = dataNasc;
        // Chamada que retorna o resultado do calculo da idade
        modalIdade.textContent = calcularIdade(dataNasc);
        modal.style.display = "flex";
    }

    function editarIdade(index) {
        const idade = idades[index];

        document.getElementById("idIdade").value = idade.id;
        document.getElementById("Nome").value = idade.nome;
        document.getElementById("dataNasc").value = idade.dataNasc;

        calcEditando = index;
        document.querySelector(".calcularSubmit").textContent = "Salvar Alterações";
    }

    function excluirIdade(index) {
        if (confirm("Tem certeza que deseja excluir essa Idade?")) {
            idades.splice(index, 1);
            salvarIdades();
            atualizarTabela();
        }
    }

    function salvarIdades() {
        localStorage.setItem("idades", JSON.stringify(idades));
    }

    // Fechar a modal
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});
