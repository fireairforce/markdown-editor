import React, { useState } from "react";
import { faPlus, faFileImport, faSave } from "@fortawesome/free-solid-svg-icons";
import SimpleMDE from "react-simplemde-editor";
import uuidv4 from "uuid/v4";
import { flattenArr, objToArr } from "./utils/helper";
import fileHelper from "./utils/fileHelper";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "easymde/dist/easymde.min.css";

import FileSearch from "./components/FileSearch";
import FileList from "./components/FileList";
import BottomBtn from "./components/BottomBtn";
import TableList from "./components/TableList";
import defaultFiles from "./utils/defaultFiles";

// require nodejs module
const { join, basename, extname, dirname } = window.require("path");
// use this module to get OS's path
const { remote } = window.require("electron");

const App = () => {
  const [files, setFiles] = useState(flattenArr(defaultFiles));
  const [activeFileIDs, setActiveFileIDs] = useState("");
  const [openedFileIDs, setOpenedFileIDs] = useState([]);
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([]);
  const [searchedFiles, setSearchedFiles] = useState([]);
  const filesArr = objToArr(files);

  const savedLocation = remote.app.getPath("documents");
  const activeFiles = files[activeFileIDs];
  const fileListArr = searchedFiles.length > 0 ? searchedFiles : filesArr;
  const openedFiles = openedFileIDs.map((openID) => {
    return files[openID];
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

  //  update body
  const fileChange = (id, value) => {
    if (value !== files[id].body) {
      const newFile = { ...files[id], body: value };
      setFiles({ ...files, [id]: newFile });
      // update unsavedIDs
      if (!unsavedFileIDs.includes(id)) {
        setUnsavedFileIDs([...unsavedFileIDs, id]);
      }
    }
  };

  const updateFileName = (id, title, isNew) => {
    const newPath = isNew
      ? join(savedLocation, `${title}.md`)
      : join(dirname(files[id].path), `${title}.md`);
    const modifiedFile = { ...files[id], title, isNew: false, path: newPath };
    const newFiles = { ...files, [id]: modifiedFile };
    if (isNew) {
      fileHelper.writeFile(newPath, files[id].body).then(() => {
        setFiles(newFiles);
      });
    } else {
      const oldPath = join(savedLocation, `${files[id].title}.md`);
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles);
      });
    }
  };

  const deleteFile = (id) => {
    delete files[id];
    setFiles(files);
    // close the tab if opened
    tabClose(id);
  };

  const fileSearch = (keyword) => {
    // filter out the new files based on the keyword
    const newFiles = filesArr.filter((file) => file.title.includes(keyword));

    setSearchedFiles(newFiles);
  };

  const createNewFile = () => {
    const newID = uuidv4();
    const newFile = {
      id: newID,
      title: "",
      body: "## 请输入 Markdown",
      createdAt: new Date().getTime(),
      isNew: true,
    };
    setFiles({ ...files, [newID]: newFile });
  };

  const saveCurrentFile = () => {
    fileHelper.writeFile(join(savedLocation, `${activeFiles.title}.md`),activeFiles.body).then(() => {
      setUnsavedFileIDs(unsavedFileIDs.filter(id => activeFiles.id !== id))
    })
  }

  return (
    // px-0用来去除左边的边距
    <div className="App container-fluid px-0">
      {/* no-gutters用来除去边距 */}
      <div className="row no-gutters">
        <div className="col-3 bg-light left-panel">
          <FileSearch
            title="我的云文档"
            onFileSearch={(value) => {
              fileSearch(value);
            }}
          />
          <FileList
            files={fileListArr}
            onFileClick={(id) => {
              fileClick(id);
            }}
            onFileDelete={(id) => {
              deleteFile(id);
            }}
            onSaveEdit={updateFileName}
          />
          <div className="row no-gutters button-group">
            <div className="col-6">
              <BottomBtn
                text="新建"
                colorClass="btn-primary"
                icon={faPlus}
                onBtnClick={createNewFile}
              />
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
              <BottomBtn 
                text="保存"
                colorClass='btn-success'
                icon={faSave}
                onBtnClick={saveCurrentFile}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
