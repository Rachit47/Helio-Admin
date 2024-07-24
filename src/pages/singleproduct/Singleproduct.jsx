import React, { useEffect, useState } from "react";
import "./singleproduct.scss"; // Ensure this path is correct
import { useParams, useNavigate } from "react-router-dom";
import { onSnapshot, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";

const Singleproduct = () => {
  const { productId } = useParams();
  const [eachProductData, setEachProductData] = useState(null);
  const [productUnitsData, setProductUnitsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ month: "", units: 0 });
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    price: 0,
    description: "",
    quantity: 0,
    img: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubProducts = onSnapshot(
      doc(db, "products", productId),
      (doc) => {
        if (doc.exists()) {
          setEachProductData(doc.data());
        } else {
          setEachProductData(null);
        }
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );

    const unsubProductUnits = onSnapshot(
      doc(db, "productUnitsSold", productId),
      (doc) => {
        if (doc.exists()) {
          setProductUnitsData(doc.data().sales || []);
        } else setProductUnitsData([]);
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setLoading(false);
      }
    );

    return () => {
      unsubProducts();
      unsubProductUnits();
    };
  }, [productId]);

  const productSalesData = productUnitsData.map((entry) => ({
    name: entry.month,
    Total: eachProductData ? eachProductData.price * entry.units : 0,
  }));

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

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = doc(db, "productUnitsSold", productId);

      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : { sales: [] };

      let monthExists = false;
      const updatedSales = existingData.sales.map((entry) => {
        if (entry.month === formData.month) {
          monthExists = true;
          return { ...entry, units: Number(formData.units) };
        }
        return entry;
      });

      if (!monthExists) {
        updatedSales.push({
          month: formData.month,
          units: Number(formData.units),
        });
      }
      const updatedData = {
        ...existingData,
        sales: updatedSales,
      };

      await setDoc(docRef, updatedData);

      setFormData({ month: "", units: 0 });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = doc(db, "products", productId);

      await updateDoc(docRef, {
        title: editData.title,
        price: Number(editData.price),
        description: editData.description,
        quantity: Number(editData.quantity),
        img: editData.img,
      });

      setShowEditForm(false);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const openEditForm = () => {
    setEditData({
      title: eachProductData.title,
      price: Number(eachProductData.price),
      description: eachProductData.description,
      quantity: Number(eachProductData.quantity),
      img: eachProductData.img,
    });
    setShowEditForm(true);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  if (!eachProductData) {
    return <div>Product not found for ID: {productId}</div>;
  }

  return (
    <div className="singleproduct">
      <Sidebar />
      <div className="singleproductContainer">
        <Navbar />
        <div className="top">
          <button onClick={GoBackHandler} className="GoBackButton">
            Go Back
          </button>
        </div>
        <div className="left-right">
          <div className="left">
            <div className="editButton" onClick={openEditForm}>
              Edit
            </div>
            <h1 className="title">Product Information</h1>
            <div className="item">
              <img src={eachProductData.img} alt="" className="itemImg" />
              <div className="details">
                <h1 className="itemTitle">{eachProductData.title}</h1>
                <div className="detailItem">
                  <span className="itemKey">Category:</span>
                  <span className="itemValue">{eachProductData.category}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Description:</span>
                  <span className="itemValue">
                    {eachProductData.description}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Price:</span>
                  <span className="itemValue">$ {eachProductData.price}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <h2>Enter Product Units Sold</h2>
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Month</label>
                <input
                  type="text"
                  name="month"
                  placeholder="Month"
                  value={formData.month}
                  onChange={handleInputChange}
                />
                <label>Units</label>
                <input
                  type="number"
                  name="units"
                  placeholder="Units"
                  value={formData.units}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit">Send</button>
            </form>
          </div>
        </div>
        <div className="bottom">
          <Chart
            aspect={3 / 1}
            title="Product Sales Revenue (Last 6 Months)"
            data={productSalesData}
          />
        </div>
        {showEditForm && (
          <div className="editFormOverlay">
            <div className="editFormContainer">
              <h2>Edit Product Details</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="formInput">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={editData.title}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="formInput">
                  <label>Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={editData.price}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="formInput">
                  <label>Description</label>
                  <input
                    type="text"
                    name="description"
                    placeholder="Description"
                    value={editData.description}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="formInput">
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={editData.quantity}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="formInput">
                  <label>Image URL</label>
                  <input
                    type="text"
                    name="img"
                    placeholder="Image URL"
                    value={editData.img}
                    onChange={handleEditInputChange}
                  />
                </div>
                <button type="submit">Save</button>
                <button
                  type="button"
                  className="cancelButton"
                  onClick={() => setShowEditForm(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Singleproduct;
