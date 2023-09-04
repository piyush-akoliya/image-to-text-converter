import React, { useState, useEffect } from "react";
import { Form, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "./styles/FileUploader.css";
import NavigationBar from "./NavigationBar";
import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [filesList, setFilesList] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];

    if (file && allowedTypes.includes(file.type)) {
      console.log("File is an image:", file.name);
      setSelectedFile(file);
    } else {
      alert("Please select a valid image file (JPEG, PNG, GIF).");
      e.target.value = null;
      setSelectedFile(null);
    }
  };
  useEffect(() => {
    axios(
      `${backendUrl}/dev/users/converteddocuments?email=${Cookies.get("email")}`
    )
      .then((res) => {
        console.log("Loading the data");
        console.log(res.data.filesList);
        setFilesList(res.data.filesList);
      })
      .catch((err) => {
        console.log("Failed to convert document");
      });
  }, []);

  const deleteFile = async (url) => {
    const fileName = url.substring(url.lastIndexOf("/") + 1);
    const email = Cookies.get("email");
    await axios
      .delete(
        `${backendUrl}/dev/users/deleteFile?email=${email}&documentName=${fileName}`
      )
      .then((res) => {
        console.log("Response recieved");
        setFilesList(res.data.filesList);
        Swal.fire({
          position: "top",
          icon: "success",
          title: `${res.data.message}!`,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileSubmit = async () => {
    if (selectedFile) {
      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const dataURL = reader.result;
          const base64Data = dataURL.split(",")[1];

          const payLoad = {
            email: Cookies.get("email"),
            name: Cookies.get("name"),
            image: base64Data,
          };

          const response = await axios.post(
            `${backendUrl}convertdocument`,
            payLoad
          );

          if (response.status === 200) {
            console.log(200);
            console.log(response);
            Swal.fire({
              position: "top",
              icon: "success",
              title: `${response.data.message}!`,
              showConfirmButton: false,
              timer: 1000,
            });
            setFilesList(response.data.filesList);
            setDocumentUrl(response.data.textDocumentUrl);
          }

          setSelectedFile(null);
        };

        reader.readAsDataURL(selectedFile);
      } catch (error) {
        console.error("Error converting document:", error);
        alert("Error converting document. Please try again later.");
      }
    } else {
      alert("Please select a file to convert first.");
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="documentConverter">
        <h1>Image to Document Converter</h1>
        <div className="uploadingSection">
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Start Uploading</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg, image/png, image/gif"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
          <Button
            onClick={handleFileSubmit}
            className="fileSubmit-Button"
            disabled={!selectedFile}
            style={{ marginBottom: "2em" }}
          >
            Convert
          </Button>
          {filesList.length > 0 && (
            <>
              <div>
                {documentUrl && (
                  <p>
                    <a
                      href={documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download the Converted Document
                    </a>
                  </p>
                )}

                <h3> Converted Documents - {Cookies.get("name")}</h3>
              </div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Document Name</th>
                    <th>Download</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filesList.map((file, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{file.Key.split("/").pop()}</td>
                      <td>
                        <Button variant="outline-dark">
                          <a href={file.Url}>Download</a>
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          onClick={() => deleteFile(file.Url)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FileUploader;
