import { useState } from "react";
import axios from "axios";
import API_URL from "../../config"; // Dalawang level up ✅

function CreateQuizzes() {
  const [questionType, setQuestionType] = useState("Multiple-Choice");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [statement, setStatement] = useState("");
  const [answer, setAnswer] = useState("");

  const [itemA1, setItemA1] = useState("");
  const [itemA2, setItemA2] = useState("");
  const [itemB1, setItemB1] = useState("");
  const [itemB2, setItemB2] = useState("");

  const handMatchingleSubmit = async () => {
    console.log("Values Before Submission:", {
      itemA1,
      itemA2,
      itemB1,
      itemB2,
    }); // Debugging log

    if (!itemA1.trim() || !itemA2.trim() || !itemB1.trim() || !itemB2.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/matching-questions`, {
        itemA: itemA1.trim(),
        itemB: itemB1.trim(),
      });
      await axios.post(`${API_URL}/api/matching-questions`, {
        itemA: itemA2.trim(),
        itemB: itemB2.trim(),
      });

      alert("Matching questions saved successfully.");
      setItemA1("");
      setItemA2("");
      setItemB1("");
      setItemB2("");
    } catch (error) {
      console.error(
        "Error saving matching question:",
        error.response?.data || error.message
      );
      alert("Failed to save matching question.");
    }
  };

  const handIdentificationleSubmit = async () => {
    if (!statement || !answer) {
      alert("Both fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/identification-questions`,
        {
          statement,
          answer,
        }
      );

      alert(response.data.message);
      setStatement("");
      setAnswer("");
    } catch (error) {
      console.error("Error saving question:", error);
      alert("Failed to save question.");
    }
  };

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
    <div className="">
      <br />
      <br />
      <div className="bg-blue-500 shadow-lg rounded-lg p-6 h-10 flex items-center">
        <h1 className="text-2xl  text-white">Create Quizzes</h1>
      </div>
      <div className="p-6  flex flex-col items-center  text-gray-900 ">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">
            Select Question Type:
          </label>
          <select
            className="border-2 border-gray-400 p-2 rounded-md bg-white text-gray-900"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="Multiple-Choice"> Multiple-Choice </option>
            <option value="identification">Identification</option>
            <option value="matching">Matching Type</option>
          </select>
        </div>

        {questionType === "Multiple-Choice" && (
          <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg border-2 border-black">
            <h2 className="text-gray-800 font-semibold mb-2">
              Multiple-Choice Question
            </h2>
            <input
              type="text"
              placeholder="Enter question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="border p-2 w-full rounded-md mb-2 bg-white text-gray-900"
            />
            <input
              type="text"
              placeholder="Option A"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              className="border p-2 w-full rounded-md mb-2 bg-white text-gray-900"
            />
            <input
              type="text"
              placeholder="Option B"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              className="border p-2 w-full rounded-md mb-2 bg-white text-gray-900"
            />
            <input
              type="text"
              placeholder="Option C"
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
              className="border p-2 w-full rounded-md mb-2 bg-white text-gray-900"
            />
            <input
              type="text"
              placeholder="Option D"
              value={optionD}
              onChange={(e) => setOptionD(e.target.value)}
              className="border p-2 w-full rounded-md mb-2 bg-white text-gray-900"
            />

            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              className="border p-2 w-full rounded-md mb-2 bg-white text-gray-900"
            >
              <option value="">Select Correct Answer</option>
              <option value={optionA}>Option A</option>
              <option value={optionB}>Option B</option>
              <option value={optionC}>Option C</option>
              <option value={optionD}>Option D</option>
            </select>

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white p-2 rounded-md mt-4"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        )}

        {questionType === "identification" && (
          <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg border-2 border-black">
            <h2 className="text-gray-800 font-semibold mb-2">
              Identification Question
            </h2>
            <textarea
              placeholder="Enter statement"
              className="border p-2 w-full rounded-md bg-white text-gray-900"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              rows={4} // optional: adjust number of rows
            />

            <input
              type="text"
              placeholder="Answer"
              className="border p-2 w-full rounded-md mt-2 bg-white text-gray-900"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <br />
            <br />
            <div className="flex justify-center">
              <button
                onClick={handIdentificationleSubmit}
                className="bg-blue-500 text-white p-2 rounded-md mt-4 block mx-auto"
              >
                Submit Question
              </button>
            </div>
          </div>
        )}

        {questionType === "matching" && (
          <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-lg border-2 border-black">
            <h2 className="text-gray-800 font-semibold mb-2">Matching Type</h2>
            <div className="flex gap-4">
              <div className="w-1/2">
                <h3 className="text-gray-700 font-medium">Column A</h3>
                <input
                  type="text"
                  placeholder="Item 1"
                  className="border p-2 w-full rounded-md mt-1 bg-white text-gray-900"
                  value={itemA1}
                  onChange={(e) => setItemA1(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Item 2"
                  className="border p-2 w-full rounded-md mt-1 bg-white text-gray-900"
                  value={itemA2}
                  onChange={(e) => setItemA2(e.target.value)}
                />
              </div>

              <div className="w-1/2">
                <h3 className="text-gray-700 font-medium">Column B</h3>
                <input
                  type="text"
                  placeholder="Match 1"
                  className="border p-2 w-full rounded-md mt-1 bg-white text-gray-900"
                  value={itemB1}
                  onChange={(e) => setItemB1(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Match 2"
                  className="border p-2 w-full rounded-md mt-1 bg-white text-gray-900"
                  value={itemB2}
                  onChange={(e) => setItemB2(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={handMatchingleSubmit}
                className="bg-blue-500 text-white p-2 rounded-md mt-4 "
              >
                Submit Matching Question
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateQuizzes;
