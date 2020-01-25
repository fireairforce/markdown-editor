import React, { useState } from "react";
import { faPlus, faFileImport } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "easymde/dist/easymde.min.css";
import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import BottomBtn from "./components/BottomBtn";
import TableList from "./components/TableList";
import defaultFiles from "./utils/defaultFiles";
import SimpleMDE from "react-simplemde-editor";

const App = () => {
  const [files, setFiles] = useState(defaultFiles);
  const [activeFileIDs, setActiveFileIDs] = useState("");
  const [openedFileIDs, setOpenedFileIDs] = useState([]);
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([]);
  const openedFiles = openedFileIDs.map((openID) => {
    return files.find((file) => file.id === openID);
  });

  const fileClick = (fileID) => {
    // set current active fileID
    setActiveFileIDs(fileID);
    // if openedFileIDs don't contain fileID
    if (!openedFileIDs.includes(fileID)) {
      //  merge active fileID into openFileID
      setOpenedFileIDs([...openedFileIDs, fileID]);
    }
  };

  const tabClick = (fileID) => {
    // set current active fileID
    setActiveFileIDs(fileID);
  };

  const tabClose = (id) => {
    // remove currentID from openedFileIDs
    const tabWithOut = openedFileIDs.filter((fileID) => fileID !== id);
    setOpenedFileIDs(tabWithOut);
    // set the active to the first opened tab if still tabs left
    if (tabWithOut.length > 0) {
      setActiveFileIDs(tabWithOut[0]);
    } else {
      setActiveFileIDs();
    }
  };

  const fileChange = (id, value) => {
    // loop throught the files and exchange a new body
    const newFiles = files.map((file) => {
      if (file.id === id) {
        file.body = value;
      }
      return file;
    });
    setFiles(newFiles);
    if (!unsavedFileIDs.includes(id)) {
      setUnsavedFileIDs([...unsavedFileIDs, id]);
    }
  };

  const activeFiles = files.find((file) => file.id === activeFileIDs);
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
            files={files}
            onFileClick={(id) => {
              fileClick(id);
            }}
            onFileDelete={(id) => {
              console.log("delete", id);
            }}
            onSaveEdit={(id, newValue) => {
              console.log(id);
              console.log(newValue);
            }}
          />
          <div className="row no-gutters button-group">
            <div className="col-6">
              <BottomBtn text="新建" colorClass="btn-primary" icon={faPlus} />
            </div>
            <div className="col-6">
              <BottomBtn
                text="导入"
                colorClass="btn-success"
                icon={faFileImport}
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          {!activeFiles && (
            <div className="start-page">选择或创建新的 Markdown 文档</div>
          )}
          {activeFiles && (
            <>
              <TableList
                files={openedFiles}
                activeId={activeFileIDs}
                unsaveIds={unsavedFileIDs}
                onTabClick={(id) => {
                  tabClick(id);
                }}
                onCloseTab={(id) => {
                  tabClose(id);
                }}
              />
              <SimpleMDE
                key={activeFiles && activeFileIDs}
                value={activeFiles && activeFiles.body}
                onChange={(value) => {
                  fileChange(activeFiles.id, value);
                }}
                options={{
                  minHeight: "515px",
                }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
