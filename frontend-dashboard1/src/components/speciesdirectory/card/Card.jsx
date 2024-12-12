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
      .get("https://bioexplorer-backend.onrender.com/countSpecies")
      .then((res) => {
        console.log("Total Species:", res.data.totalSpecies); // Log the total species count
        setTotalSpecies(res.data.totalSpecies);
      })
      .catch((err) => {
        console.error("Error fetching total species count:", err);
      });

    axios
      .get("https://bioexplorer-backend.onrender.com/countmammals")
      .then((res) => {
        console.log("Mammals Count:", res.data.count); // Log the mammals count
        setMammalsCount(res.data.count);
      })
      .catch((err) => {
        console.error("Error fetching mammals count:", err);
      });

    axios
      .get("https://bioexplorer-backend.onrender.com/countbirds")
      .then((res) => {
        console.log("Birds Count:", res.data.count); // Log the birds count
        setBirdsCount(res.data.count);
      })
      .catch((err) => {
        console.error("Error fetching birds count:", err);
      });

    axios
      .get("https://bioexplorer-backend.onrender.com/countReptiles")
      .then((res) => {
        console.log("Reptiles Count:", res.data.count); // Log the reptiles count
        setReptilesCount(res.data.count);
      })
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
