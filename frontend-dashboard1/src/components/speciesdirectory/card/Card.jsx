import React, { useEffect, useState } from "react";
import "./card.css"; // Ensure the path is correct
import axios from "axios";

function Card() {
  const [totalSpecies, setTotalSpecies] = useState(0);
  const [mammalsCount, setMammalsCount] = useState(0);
  const [birdsCount, setBirdsCount] = useState(0);
  const [reptilesCount, setReptilesCount] = useState(0);

  useEffect(() => {
    // Fetch species counts from the backend API
    axios
      .get("https://capstone-dashboard-d30v.onrender.com/countSpecies")
      .then((res) => setTotalSpecies(res.data.totalSpecies)) // Set total species count
      .catch((err) => {
        console.error("Error fetching total species count:", err);
      });

    axios
      .get("https://capstone-dashboard-d30v.onrender.com/countmammals")
      .then((res) => setMammalsCount(res.data.count)) // Set mammals count
      .catch((err) => {
        console.error("Error fetching mammals count:", err);
      });

    axios
      .get("https://capstone-dashboard-d30v.onrender.com/countbirds")
      .then((res) => setBirdsCount(res.data.count)) // Set birds count
      .catch((err) => {
        console.error("Error fetching birds count:", err);
      });

    axios
      .get("https://capstone-dashboard-d30v.onrender.com/countReptiles")
      .then((res) => setReptilesCount(res.data.count)) // Set reptiles count
      .catch((err) => {
        console.error("Error fetching reptiles count:", err);
      });
  }, []);

  return (
    <div className="card1">
      <div className="col-div-3">
        <div className="boxes">
          <span className="boxes2">All Species</span>
          <p className="boxes1">{totalSpecies}</p>
        </div>
      </div>

      <div className="col-div-3">
        <div className="box-1">
          <span className="boxs">Mammals</span>
          <p className="box1">{mammalsCount}</p>
        </div>
      </div>

      <div className="col-div-3">
        <div className="box-2">
          <span className="boxs2">Birds</span>
          <p className="box2">{birdsCount}</p>
        </div>
      </div>

      <div className="col-div-3">
        <div className="box-3">
          <span className="boxs3">Reptiles</span>
          <p className="box3">{reptilesCount}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;
