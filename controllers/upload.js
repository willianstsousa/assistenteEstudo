(async () => {
  document.addEventListener("DOMContentLoaded", function () {
    const formInputArquivo = document.getElementById("formInputArquivo");
    formInputArquivo.addEventListener("submit", function (event) {
      event.preventDefault();
      alert("Chamada para salvar arquivo");
    });
  });
})();
