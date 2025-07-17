const params = new URLSearchParams(window.location.search);
const examId = parseInt(params.get("id"));
const exam = teil2Data.find((e) => e.id === examId);

if (!exam) {
  document.body.innerHTML = "<h2>Exam not found</h2>";
} else {
  document.getElementById("exam-title").textContent = exam.title;
  document.getElementById("exam-text").textContent = exam.text;

  const container = document.getElementById("questions-container");

  exam.questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.classList.add("question");

    const html = `
      <h3>${i + 1}. ${q.question_text}</h3>
      ${["option_a", "option_b", "option_c"]
        .map(
          (opt) => `
        <label>
          <input type="radio" name="q${q.id}" value="${opt.split("_")[1]}"> 
          ${String.fromCharCode(65 + opt.split("_")[1].charCodeAt(0) - 97)}: ${
            q.option[opt]
          }
        </label><br/>
      `
        )
        .join("")}
    `;
    div.innerHTML = html;
    container.appendChild(div);
  });

  document.getElementById("submit-btn").addEventListener("click", () => {
    const allAnswered = exam.questions.every((q) => {
      return document.querySelector(`input[name="q${q.id}"]:checked`);
    });

    if (!allAnswered) return alert("Please answer all questions!");

    let score = 0;
    exam.questions.forEach((q) => {
      const selected = document.querySelector(
        `input[name="q${q.id}"]:checked`
      ).value;
      const correct = q.correct_option.toLowerCase();
      const labels = document.querySelectorAll(`input[name="q${q.id}"]`);

      if (selected === correct) {
        score++;
      }

      labels.forEach((input) => {
        if (input.value === correct) {
          input.parentElement.style.color = "green";
          input.parentElement.style.fontWeight = "bold";
        } else if (input.checked) {
          input.parentElement.style.color = "red";
        }
        input.disabled = true;
      });
    });

    // Create and display score element
    const scoreElement = document.createElement("div");
    scoreElement.classList.add("score-display");
    scoreElement.innerHTML = `
      <h2 style="text-align: center; margin: 20px 0; color: var(--primary)">
        Your score: ${score}/${exam.questions.length}
      </h2>
    `;
    document
      .querySelector(".actions")
      .insertAdjacentElement("beforebegin", scoreElement);

    document.getElementById("submit-btn").style.display = "none";
    document.getElementById("results-buttons").style.display = "block";
  });
}
