(async () => {
  let metadata = {
    hasMore: true,
    limit: 0,
    offset: 0,
    total: 0,
  };

  let anoSelecionado = 2023;
  let countPaginaAtual = 1;
  let countPaginaTotal = 1;
  function getQuestoes(anoProva, offset) {
    return new Promise((resolve, reject) => {
      const options = { method: "GET" };

      fetch(
        `https://api.enem.dev/v1/exams/${anoProva}/questions?limit=50&offset=${offset}`,
        options
      )
        .then((response) => response.json())
        .then((response) => resolve(response))
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    const myModal = new bootstrap.Modal(
      document.getElementById("staticBackdrop"),
      {
        backdrop: true,
      }
    );
    const questoesRoot = document.getElementById("questoesRoot");
    const formQuestoes = document.getElementById("formQuestoes");
    const sectionSelecaoAno = document.getElementById("sectionSelecaoAno");
    const navegacaoAnterior = document.getElementById("navegacaoAnterior");
    const navegacaoPosterior = document.getElementById("navegacaoPosterior");
    const paginaAtual = document.getElementById("paginaAtual");
    const paginaTotal = document.getElementById("paginaTotal");

    function montaGridQuestoes(questoes) {
      return new Promise((resolve, reject) => {
        try {
          if (Array.isArray(questoes)) {
            questoesRoot.innerHTML = "";
            questoes.forEach((questao, indexQuestoes) => {
              const divMainCard = document.createElement("div");
              divMainCard.classList.add("card", "mb-3", "p-3");

              const paragrafoTitulo = document.createElement("p");
              paragrafoTitulo.innerText = questao.title;
              divMainCard.appendChild(paragrafoTitulo);

              const paragrafoIntroducao = document.createElement("p");
              paragrafoIntroducao.innerText = questao.alternativesIntroduction;
              divMainCard.appendChild(paragrafoIntroducao);

              const ulAlternativas = document.createElement("ul");
              ulAlternativas.classList.add("list-group");
              ulAlternativas.id = `questao_${indexQuestoes + 1}`;
              questao.alternatives.forEach((alternativa, indexAlternativas) => {
                const liAlternativa = document.createElement("li");

                liAlternativa.id = `questao_${indexQuestoes + 1}_alternativa_${
                  indexAlternativas + 1
                }`;

                liAlternativa.classList.add("list-group-item", "selecionado");
                liAlternativa.innerText = `${alternativa.letter} - ${alternativa.text}`;
                liAlternativa.onclick = function () {
                  const element = document.getElementById(
                    `questao_${indexQuestoes + 1}_alternativa_${
                      indexAlternativas + 1
                    }`
                  );
                  resetarEscolhas(`questao_${indexQuestoes + 1}`);
                  if (alternativa.isCorrect) {
                    element.classList.add("list-group-item-success");
                  } else {
                    element.classList.add("list-group-item-danger");
                  }
                };
                ulAlternativas.appendChild(liAlternativa);
              });

              divMainCard.appendChild(ulAlternativas);
              questoesRoot.appendChild(divMainCard);
            });
            sectionSelecaoAno.style.display = "none";
            montaNavegacao();
            resolve();
          } else {
            throw "Questões não encontradas";
          }
        } catch (error) {
          alert("Erro ao montar grid de questões");
          reject(error);
        }
      });
    }

    function montaNavegacao() {
      paginaAtual.innerText = countPaginaAtual;
      paginaTotal.innerText = countPaginaTotal;
    }

    function resetarEscolhas(idAlternativas) {
      const alternativas = document.getElementById(idAlternativas).children;
      for (let index = 0; index < alternativas.length; index++) {
        const element = alternativas[index];
        element.classList.remove("list-group-item-success");
        element.classList.remove("list-group-item-danger");
      }
    }

    function mostraLoading() {
      myModal.show();
    }

    function escondeLoading() {
      myModal.hide();
    }

    navegacaoPosterior.addEventListener("click", async function () {
      if (countPaginaAtual < countPaginaTotal) {
        metadata.offset = countPaginaAtual * 50;
        const response = await getQuestoes(anoSelecionado, metadata.offset);
        metadata.total = response.metadata.total;
        metadata.hasMore = response.metadata.hasMore;
        countPaginaAtual++;
        await montaGridQuestoes(response.questions);
        montaNavegacao();
      }
    });

    navegacaoAnterior.addEventListener("click", async function () {
      if (countPaginaAtual > 1) {
        countPaginaAtual--;
        metadata.offset = countPaginaAtual * 50 - 50;
        const response = await getQuestoes(anoSelecionado, metadata.offset);
        metadata.total = response.metadata.total;
        metadata.hasMore = response.metadata.hasMore;
        await montaGridQuestoes(response.questions);
        montaNavegacao();
      }
    });

    formQuestoes.addEventListener("submit", async function (event) {
      event.preventDefault();
      mostraLoading();
      //console.log(event);
      const anoProva = document.getElementById("ano").value;
      // const offset = document.getElementById("offset").value;

      // const response = await getQuestoes(anoProva, offset);
      if (metadata.hasMore === false) {
        alert("Não há mais questões para carregar");
        return;
      }
      const response = await getQuestoes(anoProva, metadata.offset);
      anoSelecionado = anoProva;
      metadata.offset += response.metadata.limit;
      metadata.total = response.metadata.total;
      metadata.hasMore = response.metadata.hasMore;
      countPaginaTotal = Math.ceil(metadata.total / 50);
      await montaGridQuestoes(response.questions);
      escondeLoading();
    });
  });
})();
