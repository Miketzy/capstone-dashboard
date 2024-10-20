import React, { useEffect, useState } from "react";
import axios from "axios";
import "./card2.css";

function Card2() {
  const [amphibiansCount, setAmphibiansCount] = useState(0);
  const [invertebratesCount, setInvertebratesCount] = useState(0);
  const [fishCount, setFishCount] = useState(0);

  useEffect(() => {
    // Fetch amphibians count
    axios
      .get("http://localhost:8080/countamphibians")
      .then((res) => setAmphibiansCount(res.data.count))
      .catch((err) => console.error("Error fetching amphibians count:", err));

    // Fetch invertebrates count
    axios
      .get("http://localhost:8080/countinvertebrates")
      .then((res) => setInvertebratesCount(res.data.count))
      .catch((err) => console.error("Error fetching amphibians count:", err));

    // Fetch fish count
    axios
      .get("http://localhost:8080/countfish")
      .then((res) => setFishCount(res.data.count))
      .catch((err) => console.error("Error fetching amphibians count:", err));
  }, []);

  return (
    <div className="card-2">
      <div className="col-div-3">
        <div className="box-4">
          <span className="boxs4">Amphibians</span>
          <p className="box4">{amphibiansCount}</p>
        </div>
      </div>

      <div className="col-div-3">
        <div className="box-5">
          <span className="boxs5">Invertebrates</span>
          <p className="box5">{invertebratesCount}</p>
        </div>
      </div>

      <div className="col-div-3">
        <div className="box-6">
          <span className="boxs6">Fish</span>
          <p className="box6">{fishCount}</p>
        </div>
      </div>
    </div>
  );
}

export default Card2;
