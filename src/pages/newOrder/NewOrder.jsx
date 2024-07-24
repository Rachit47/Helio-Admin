import React, { useState, useEffect } from "react";
import "./newOrder.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const NewOrder = ({ inputs, title }) => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState({});

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
    let value = e.target.value;
    if (id === "amount") {
      value = Number(value); // Conversion of amount to a number
    } else if (id === "orderDate") {
      value = new Date(value); // Conversion of date string to Date object
    }
    setData({ ...data, [id]: value });
  };

  const navigate = useNavigate();
  const GoBackHandler = () => {
    navigate(-1);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "orders"), {
        ...data,
        amount: Number(data.amount), // to ensure that amount is saved as a number
        orderDate: Timestamp.fromDate(new Date(data.orderDate)), // Conversion of Date object to Firestore Timestamp datatype
      });
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="newOrder">
      <Sidebar />
      <div className="newOrderContainer">
        <Navbar />
        <div className="ordertop">
          <h1>{title}</h1>
          <button onClick={GoBackHandler} className="GoBackButton">
            Go Back
          </button>
        </div>
        <div className="orderbottom">
          <div className="orderright">
            <form onSubmit={handleAdd}>
              {inputs.map((input) => (
                <div className="orderformInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleInput}
                  />
                </div>
              ))}
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
