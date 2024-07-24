import React, { useEffect, useState } from "react";
import "./single.scss";
import { useParams, useNavigate } from "react-router-dom";
import { onSnapshot, setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";

const Single = () => {
  const { userId } = useParams(); // Extracting userId from the route params
  const [eachUserData, setEachUserData] = useState(null);
  const [spendingData, setSpendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", Total: 0 });

  useEffect(() => {
    const unsubUsers = onSnapshot(
      doc(db, "users", userId),
      (doc) => {
        if (doc.exists()) {
          setEachUserData(doc.data() || []);
        } else {
          setEachUserData([]);
        }
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );

    const unsubSpending = onSnapshot(
      doc(db, "userSpendingdata", userId),
      (doc) => {
        if (doc.exists()) {
          setSpendingData(doc.data().data || []);
        } else {
          setSpendingData([]);
        }
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );

    return () => {
      unsubUsers();
      unsubSpending();
    };
  }, [userId]);

  const navigate = useNavigate();
  const GoBackHandler = () => {
    navigate(-1);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = doc(db, "userSpendingdata", userId);

      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : { data: [] };

      let monthExists = false;
      const updatedSpendingdata = existingData.data.map((entry) => {
        if (entry.name === formData.name) {
          monthExists = true;
          return { ...entry, Total: Number(formData.Total) };
        }
        return entry;
      });

      if (!monthExists) {
        updatedSpendingdata.push({
          name: formData.name,
          Total: Number(formData.Total),
        });
      }

      const updatedData = {
        ...existingData,
        data: updatedSpendingdata,
      };

      await setDoc(docRef, updatedData);

      setFormData({ name: "", Total: 0 }); // Clear form after submission
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>; // Display a loading indicator while fetching data
  }
  if (!eachUserData) {
    return <div>User not found for ID: {userId}</div>;
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <button onClick={GoBackHandler} className="GoBackButton">
            Go Back
          </button>
        </div>
        <div className="left-right">
          <div className="left">
            <h1 className="title">Customer Information</h1>

            <div className="item">
              <img src={eachUserData.img} alt="" className="itemImg" />
              <div className="details">
                <h1 className="itemTitle">{eachUserData.username}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{eachUserData.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{eachUserData.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">City:</span>
                  <span className="itemValue">{eachUserData.city}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Country:</span>
                  <span className="itemValue">{eachUserData.country}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <h2>Add User Spending Data</h2>
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Month</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Month"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <label>Total Expenditure</label>
                <input
                  type="number"
                  name="Total"
                  placeholder="Total"
                  value={formData.Total}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
        {/* Form for Adding Single Spending Data */}
        <div className="bottom">
          <Chart aspect={3 / 1} title="Customer Spending" data={spendingData} />
        </div>
      </div>
    </div>
  );
};

export default Single;
