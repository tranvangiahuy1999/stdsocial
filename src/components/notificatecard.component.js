import React, { useState, useEffect } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { ImBin } from "react-icons/im";
import { Modal } from "antd";
import axiosInstance from "../api/service";
import { useAlert } from "react-alert";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { BASE_URL } from "../constants";

const editorConfiguration = {
  toolbar: [
    "heading",
    "|",
    "undo",
    "redo",
    "bold",
    "italic",
    "blockQuote",
    "ckfinder",
    "imageStyle:full",
    "imageStyle:side",
    "link",
    "numberedList",
    "bulletedList",
    "mediaEmbed",
    "insertTable",
    "tableColumn",
    "tableRow",
    "mergeTableCells",
  ],
};

const NotiCard = (props) => {
  const [userData, getUserData] = useState();
  const [deleteModalState, setDeleteModalState] = useState(false);
  const [deleteState, setDeleteState] = useState(false);

  const [title, setTitle] = useState(props.title);
  const [desc, setDesc] = useState(props.subtitle);

  const [editModalState, setEditModelState] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editContent, setEditContent] = useState("");
  const [hoverState, setHoverState] = useState(false);

  const alert = useAlert();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const showDelModal = () => {
    setDeleteModalState(true);
  };

  const handleDelOk = () => {
    deleteHandle();
    setDeleteModalState(false);
  };

  const handleDelCancel = () => {
    setDeleteModalState(false);
  };

  const showEditModal = () => {
    setEditTitle(props.title);
    setEditDesc(props.subtitle);
    setEditContent(props.content);
    setEditModelState(true);
  };

  const handleEditOk = () => {
    editHandle();
  };

  const handleEditCancel = () => {
    setEditModelState(false);
  };

  function deleteHandle() {
    axiosInstance
      .delete(`/notification/delete/${props.noti_id}`)
      .then((res) => {
        if (res.data.code === 0) {
          alert.show("Delete success", {
            type: "success",
          });
          setDeleteState(true);
        } else {
          alert.show(res.data.message, {
            type: "error",
          });
        }
      })
      .catch((e) => console.error(e));
  }

  function editHandle() {
    const body = {
      title: editTitle,
      description: editDesc,
      faculty: props.falcutyname,
      content: editContent,
    };
    axiosInstance
      .put(
        `${BASE_URL}/notification/update/${props.noti_id}`,
        body
      )
      .then((res) => {
        if (res.data.code === 0) {
          alert.show("Updated", {
            type: "success",
          });
          setTitle(editTitle);
          setDesc(editDesc);
          setEditModelState(false);
        } else {
          alert.show(res.data.message, {
            type: "error",
          });
        }
      })
      .catch((e) => console.error(e));
  }

  function getCurrentUser() {
    axiosInstance
      .get(`/account/current`)
      .then((res) => {
        if (res.data.code === 0) {
          getUserData(res.data.data);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return deleteState ? (
    <div className="empty-data">
      <div className="empty-text">Deleted notification</div>
    </div>
  ) : (
    <div
      className="noti-card m-1"
      style={{
        borderLeft: props.borderStyle,
        backgroundColor: hoverState ? "white" : "rgba(248,248,248,255)",
      }}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
    >
      <Modal
        title="Confirm to delete"
        open={deleteModalState}
        onOk={handleDelOk}
        onCancel={handleDelCancel}
      >
        Are you sure you want to delete this notification?{" "}
        <span style={{ color: "red" }}>*There is no running back!</span>
      </Modal>

      <Modal
        title="Update notification"
        open={editModalState}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
      >
        <div>
          <div className="form-group">
            <input
              className="form-control"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
            ></input>
          </div>
          <div className="form-group">
            <input
              className="form-control"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Description"
            ></input>
          </div>
          <div className="form-group">
            <input
              className="form-control"
              value={props.falcutyname}
              disabled={true}
              placeholder="Faculty"
            ></input>
          </div>
          <div className="form-group">
            <CKEditor
              editor={ClassicEditor}
              data={editContent}
              config={editorConfiguration}
              onReady={(editor) => {
                editor.editing.view.change((writer) => {
                  writer.setStyle(
                    "height",
                    "200px",
                    editor.editing.view.document.getRoot()
                  );
                });
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditContent(data);
              }}
            />
          </div>
        </div>
      </Modal>
      <div className="ml-3 p-1">
        {hoverState ? (
          <div className="row">
            <div className="col-9" onClick={props.seedetail}>
              <div
                style={{
                  fontSize: "18px",
                  color: props.textStyle,
                  fontWeight: "500",
                }}
              >
                {title}
              </div>
              <div style={{ color: "gray" }}>{desc}</div>
              <div style={{ color: "lightgray", fontSize: "14px" }}>
                {props.date}
                <span>/ {props.falcutyname}</span>
              </div>
            </div>
            <div
              className="col-3 mt-auto mb-auto"
              style={{ textAlign: "right" }}
            >
              {userData && userData.role !== "student" && (
                <div>
                  <button
                    className="btn btn-primary mr-1"
                    style={{ textAlign: "center" }}
                  >
                    <AiOutlineEdit
                      onClick={showEditModal}
                      size="17px"
                      color="white"
                    ></AiOutlineEdit>
                  </button>
                  <button
                    className="btn btn-danger mr-2"
                    style={{ textAlign: "center" }}
                  >
                    <ImBin
                      onClick={showDelModal}
                      size="15px"
                      color="white"
                    ></ImBin>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div onClick={props.seedetail}>
            <div
              style={{
                fontSize: "18px",
                color: props.textStyle,
                fontWeight: "500",
              }}
            >
              {title}
            </div>
            <div style={{ color: "gray", fontSize: "14px" }}>
              {props.date}
              <span>/ {props.falcutyname}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotiCard;
