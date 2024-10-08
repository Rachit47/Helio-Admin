import React, { useState, useEffect } from "react";
import "./newProduct.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import { useNavigate } from "react-router-dom";
import { serverTimestamp, collection, addDoc } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const NewProduct = ({ inputs, title }) => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState({});
  const [progressper] = useState(null);

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setData((prev) => ({ ...prev, img: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };

  const navigate = useNavigate();
  const GoBackHandler = () => {
    navigate(-1);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), {
        ...data,
        timeStamp: serverTimestamp(),
      });
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="newProduct">
      <Sidebar />
      <div className="newProductContainer">
        <Navbar />
        <div className="protop">
          <h1>{title}</h1>
          <button onClick={GoBackHandler} className="GoBackButton">
            Go Back
          </button>
        </div>
        <div className="probottom">
          <div className="proleft">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/495px-No-Image-Placeholder.svg.png?20200912122019"
              }
              alt=""
            />
          </div>
          <div className="proright">
            <form onSubmit={handleAdd}>
              <div className="productformInput">
                <label htmlFor="file">
                  Image: <CloudUploadRoundedIcon className="proicon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              {inputs.map((input) => (
                <div className="productformInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleInput}
                  />
                </div>
              ))}
              <button
                disabled={progressper !== null && progressper < 100}
                type="submit"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProduct;
