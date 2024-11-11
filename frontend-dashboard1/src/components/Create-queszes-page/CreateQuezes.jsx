import React, { useState } from "react";
import axios from "axios";
import "./CreateQuezes.css";

function CreateQuezes() {
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [message] = useState("");

  // Function para mag-handle ng form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !question.trim() ||
      !optionA.trim() ||
      !optionB.trim() ||
      !optionC.trim() ||
      !optionD.trim() ||
      !correctAnswer.trim()
    ) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/questions", {
        question,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
      });
      alert(response.data.message);
      // I-clear ang lahat ng fields
      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectAnswer("");
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question. Please try again.");
    }
  };

  return (
    <div className="admin-add-question">
      <h2>Add New Multiple-Choice Question</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter the question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="question-input"
        />

        <input
          type="text"
          placeholder="Option A"
          value={optionA}
          onChange={(e) => setOptionA(e.target.value)}
          className="option-input"
        />

        <input
          type="text"
          placeholder="Option B"
          value={optionB}
          onChange={(e) => setOptionB(e.target.value)}
          className="option-input"
        />

        <input
          type="text"
          placeholder="Option C"
          value={optionC}
          onChange={(e) => setOptionC(e.target.value)}
          className="option-input"
        />

        <input
          type="text"
          placeholder="Option D"
          value={optionD}
          onChange={(e) => setOptionD(e.target.value)}
          className="option-input"
        />

        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className="correct-answer-select"
        >
          <option value="">Select Correct Answer</option>
          <option value={optionA}>Option A</option>
          <option value={optionB}>Option B</option>
          <option value={optionC}>Option C</option>
          <option value={optionD}>Option D</option>
        </select>

        <button type="submit" className="submit-button">
          Add Question
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default CreateQuezes;
