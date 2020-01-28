import React, { useState } from "react";
import {
  faPlus,
  faFileImport,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
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

// require nodejs module
const { join, basename, extname, dirname } = window.require("path");
// use this module to get OS's path
const { remote } = window.require("electron");
// import electron-store to support local file store
const Store = window.require("electron-store");
const fileStore = new Store({ name: "Files data" });

const saveFilesToStore = (files) => {
  const filesStoreObj = objToArr(files).reduce((result, file) => {
    const { id, path, title, createdAt } = file;
    result[id] = {
      id,
      path,
      title,
      createdAt,
    };
    return result;
  }, {});
  fileStore.set("files", filesStoreObj);
};

const App = () => {
  const [files, setFiles] = useState(fileStore.get("files") || {});
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
    const currentFile = files[fileID];
    if (!currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then((value) => {
        const newFile = { ...files[fileID], body: value, isLoaded: true };
        setFiles({ ...files, [fileID]: newFile });
      });
    }
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
        saveFilesToStore(newFiles);
      });
    } else {
      const oldPath = files[id].path;
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles);
        saveFilesToStore(newFiles);
      });
    }
  };

  const deleteFile = (id) => {
    fileHelper.deleteFile(files[id].path).then(() => {
      delete files[id];
      setFiles(files);
      saveFilesToStore(files);
      // close the tab if opened
      tabClose(id);
    });
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
    fileHelper
      .writeFile(
        join(activeFiles.path, `${activeFiles.title}.md`),
        activeFiles.body,
      )
      .then(() => {
        setUnsavedFileIDs(unsavedFileIDs.filter((id) => activeFiles.id !== id));
      });
  };
  // 使用remote模块
  const importFiles = () => {
    remote.dialog
      .showOpenDialog({
        title: "选择导入的markdown文件",
        properties: ["openFile", "multiSelections"],
        filters: [
          {
            name: "Markdown files",
            extensions: ["md"],
          },
        ],
      })
      .then((res) => {
        let paths = res.filePaths;
        if (Array.isArray(paths)) {
          // filter out the path we already have in electron store
          // ['Users/wudong/xxx']
          const fileteredPath = paths.filter((path) => {
            const alreadyAdded = Object.values(files).find((file) => {
              return file.path === path;
            });
            return !alreadyAdded;
          });
          // flatten the array
          const importFilesArr = fileteredPath.map((path) => {
            return {
              id: uuidv4(),
              title: basename(path, extname(path)),
              path,
            };
          });
          // console.log(importFilesArr);
          // get the new files object in flattenArr
          const newFiles = { ...files, ...flattenArr(importFilesArr) };
          // setState and update electron store
          setFiles(newFiles);
          saveFilesToStore(newFiles);
          // console.log(importFilesArr);
          if (importFilesArr.length > 0) {
            remote.dialog.showMessageBox({
              type: "info",
              title: `成功导入了${importFilesArr.length}个文件`,
              message: `成功导入了${importFilesArr.length}个文件`,
              buttons: ["好的"],
            });
          }
        }
      });
  };

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
                onBtnClick={importFiles}
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
                colorClass="btn-success"
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
