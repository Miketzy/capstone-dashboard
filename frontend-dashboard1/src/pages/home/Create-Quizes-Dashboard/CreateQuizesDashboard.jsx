import React from "react";
import "./CreateQuizesDashboard.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import CreateQuezes from "../../../components/Create-queszes-page/CreateQuezes";
function CreateQuizesDashboard() {
  //
  return (
    <div>
      <div className="QuizesCreate-main d-flex">
        <div className="QuizesCreate-sidebarWrapper">
          <Sidebar />
        </div>

        <div className="QuizesCreate-content">
          <Navbar />
        </div>

        <div className="QuizesCreate-tit">
          <h1> Create Question</h1>
        </div>

        <div className="QuizesCreate-request">
          <CreateQuezes />
        </div>
      </div>
    </div>
  );
}

export default CreateQuizesDashboard;
