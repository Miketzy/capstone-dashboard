import React from "react";
import Bargraph from "../speciesdirectory/bar-graph/Bargraph";
import Directorypie from "../speciesdirectory/directory-pie-chart/Directorypie";
import DirectoryTable from "../speciesdirectory/directorytable/DirectoryTable";

function SearchFunction({ activeComponent, query }) {
  return (
    <div className="result">
      {activeComponent === "graph" && (
        <>
          <h2>Graphs</h2>
          <Bargraph query={query} />
        </>
      )}
      {activeComponent === "pie" && (
        <>
          <h2>Pie Charts</h2>
          <Directorypie query={query} />
        </>
      )}
      {activeComponent === "table" && (
        <>
          <h2>Tables</h2>
          <DirectoryTable query={query} />
        </>
      )}
    </div>
  );
}

export default SearchFunction;
