const questions = [
  "Quanto é 3+5? Sinalize o resultado.",
  "Quanto é 3+55? Sinalize o resultado.",
  "Quanto é 5/5? Sinalize o resultado.",
  "Quanto é 3x5? Sinalize o resultado.",
  "Quanto é 3-5? Sinalize o resultado."
];

function generateQuestion() {
  const randomIndex = Math.floor(Math.random() * questions.length);
  document.getElementById("question").textContent = questions[randomIndex];
}