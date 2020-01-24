import React from "react";
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import BottomBtn from "./components/BottomBtn";
import TableList from "./components/TableList";
import defaultFiles from "./utils/defaultFiles";

function App() {
  return (
    // px-0用来去除左边的边距
    <div className="App container-fluid px-0">
      {/* no-gutters用来除去边距 */}
      <div className="row no-gutters">
        <div className="col-3 bg-light left-panel">
          <FileSearch
            title="我的云文档"
            onFileSearch={(value) => {
              console.log(value);
            }}
          />
          <FileList
            files={defaultFiles}
            onFileClick={(id) => {
              console.log(id);
            }}
            onFileDelete={(id) => {
              console.log("delete", id);
            }}
            onSaveEdit={(id, newValue) => {
              console.log(id);
              console.log(newValue);
            }}
          />
          <div className="row no-gutters">
            <div className="col-6">
              <BottomBtn 
                text="新建"
                colorClass='btn-primary'
                icon={faPlus}
              />
            </div>
            <div className="col-6">
            <BottomBtn 
                text="导入"
                colorClass='btn-success'
                icon={faFileImport}
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          <TableList
            files={defaultFiles}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
