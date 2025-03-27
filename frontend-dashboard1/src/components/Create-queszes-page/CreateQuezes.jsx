import React, { useState } from "react";
import axios from "axios";
import "./CreateQuezes.css";
import API_URL from "../../config"; // Dalawang level up ✅

function CreateQuizzes() {
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending data:", {
      question,
      optiona: optionA.toLowerCase(),
      optionb: optionB.toLowerCase(),
      optionc: optionC.toLowerCase(),
      optiond: optionD.toLowerCase(),
      correctanswer: correctAnswer.toLowerCase(),
    });

    if (
      !question ||
      !optionA ||
      !optionB ||
      !optionC ||
      !optionD ||
      !correctAnswer
    ) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/questions`, {
        question,
        optiona: optionA.toLowerCase(), // ✅ Convert to lowercase
        optionb: optionB.toLowerCase(),
        optionc: optionC.toLowerCase(),
        optiond: optionD.toLowerCase(),
        correctanswer: correctAnswer.toLowerCase(),
      });

      console.log("Response from server:", response.data);
      alert(response.data.message);

      // Clear form fields
      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectAnswer("");
    } catch (error) {
      console.error(
        "Error adding question:",
        error.response ? error.response.data : error.message
      );
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

export default CreateQuizzes;
