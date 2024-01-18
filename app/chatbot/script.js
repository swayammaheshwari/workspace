const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;

const csvFilePath = "public/data/dataset.csv";

function getResponse(input, quoteData) {
  for (let i = 0; i < quoteData.length; i++) {
    if (quoteData[i][0] === input) {
      return quoteData[i][1];
    }
  }
  return "Sorry, I didn't understand you. Can you please repeat that?";
}

function speak(message) {
  const utterance = new SpeechSynthesisUtterance(message);
  speechSynthesis.speak(utterance);
}

async function loadCSVData(csvFilePath) {
  const response = await fetch(csvFilePath);
  const data = await response.text();
  return data
    .split("\n")
    .map((line) => line.split(","))
    .filter((line) => line.length === 2);
}

loadCSVData(csvFilePath)
  .then((quoteData) => {
    recognition.addEventListener("result", (event) => {
      const last = event.results.length - 1;
      const input = event.results[last][0].transcript;
      const response = getResponse(input, quoteData);
      speak(response);
    });

    recognition.addEventListener("end", recognition.start);

    recognition.start();
  })
  .catch((error) => console.error(error));
