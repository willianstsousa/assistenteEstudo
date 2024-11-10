let palavras = [];
let indicePalavraAtual = 0;
let utterance;

function lerTexto() {
  const textAreaElement = document.getElementById("textAreaTextoInput");
  textAreaElement.classList.add("d-none");
  const texto = textAreaElement.value;

  const pElementTexto = document.getElementById("texto");
  pElementTexto.classList.remove("d-none");
  pElementTexto.innerText = texto;

  // Divide o texto em palavras e cria spans ao redor de cada uma
  palavras = texto.split(" ");
  document.getElementById("texto").innerHTML = palavras
    .map((palavra, index) => `<span id="palavra-${index}">${palavra}</span>`)
    .join(" ");

  // Inicia a leitura
  utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = "pt-BR";

  // Evento que dispara sempre que uma parte do texto é falada
  utterance.onboundary = function (event) {
    if (event.name === "word") {
      destacarPalavra(event.charIndex);
    }
  };

  // Iniciar leitura
  window.speechSynthesis.speak(utterance);

  // Evento que dispara quando a leitura termina
  utterance.onend = function () {
    indicePalavraAtual = 0;
    document.getElementById("texto").classList.add("d-none");
    document.getElementById("textAreaTextoInput").classList.remove("d-none");
  };
}

function destacarPalavra(charIndex) {
  // Remove o sublinhado da palavra anterior
  if (indicePalavraAtual > 0) {
    document
      .getElementById(`palavra-${indicePalavraAtual - 1}`)
      .classList.remove("sublinhado");
  }

  // Destaca a palavra atual
  document
    .getElementById(`palavra-${indicePalavraAtual}`)
    .classList.add("sublinhado");
  indicePalavraAtual++;
}

function pararLeitura() {
  const btnParar = document.getElementById("btnPausarLeitura");
  btnParar.classList.remove("d-block");
  btnParar.classList.add("d-none");
  const btnContinuar = document.getElementById("btnContinuarLeitura");
  btnContinuar.classList.add("d-block");
  btnContinuar.classList.remove("d-none");
  window.speechSynthesis.pause();
}

function continuarLeitura() {
  const btnParar = document.getElementById("btnPausarLeitura");
  btnParar.classList.add("d-block");
  btnParar.classList.remove("d-none");
  const btnContinuar = document.getElementById("btnContinuarLeitura");
  btnContinuar.classList.remove("d-block");
  btnContinuar.classList.add("d-none");
  window.speechSynthesis.resume();
}

function cancelarLeitura() {
  const btnParar = document.getElementById("btnPausarLeitura");
  btnParar.classList.add("d-block");
  btnParar.classList.remove("d-none");
  const btnContinuar = document.getElementById("btnContinuarLeitura");
  btnContinuar.classList.remove("d-block");
  btnContinuar.classList.add("d-none");
  window.speechSynthesis.cancel();
  indicePalavraAtual = 0;
  document.getElementById("texto").classList.add("d-none");
  document.getElementById("textAreaTextoInput").classList.remove("d-none");
}
