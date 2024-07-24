import "./home.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import { setTransactionalData } from "./ExportTransactionalData";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

const Home = () => {
  const [userSpendingData, setUserSpendingData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [productUnitsData, setProductUnitsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubSpending = onSnapshot(
      collection(db, "userSpendingdata"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setUserSpendingData(list);
      },
      (error) => {
        console.log(error);
        setError("Failed to load user spending data");
      }
    );

    const unsubProducts = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        let productData = [];
        snapshot.forEach((doc) => {
          productData.push({ id: doc.id, ...doc.data() });
        });
        setProductsData(productData);
      },
      (error) => {
        console.log(error);
        setError("Failed to load products data");
      }
    );

    const unsubUnitsTotal = onSnapshot(
      collection(db, "productUnitsSold"),
      (snapshot) => {
        let unitsData = [];
        snapshot.forEach((doc) => {
          unitsData.push({ id: doc.id, ...doc.data() });
        });
        setProductUnitsData(unitsData);
        setLoading(false);
      },
      (error) => {
        console.log(error);
        setError("Failed to load product units data");
        setLoading(false);
      }
    );

    return () => {
      unsubSpending();
      unsubProducts();
      unsubUnitsTotal();
    };
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Calculating userMonthlyTotals
  const userMonthlyTotals = {};
  userSpendingData.forEach((user) => {
    user.data?.forEach((month) => {
      const { name, Total } = month;
      if (!userMonthlyTotals[name]) {
        userMonthlyTotals[name] = 0;
      }
      userMonthlyTotals[name] += Number(Total); // Converting Total to number before adding
    });
  });

  console.log("userMonthlyTotals:", userMonthlyTotals);

  const productSales = productUnitsData.map((product) => ({
    id: product.id,
    data:
      product.data?.map((entry) => ({
        name: entry.month,
        Total:
          (productsData.find((p) => p.id === product.id)?.price || 0) *
          entry.quantity,
      })) || [],
  }));

  let months = [];
  for (let month in userMonthlyTotals) {
    if (!months.includes(month)) {
      months.push(month);
    }
  }

  const productMonthlySales = {};
  productSales.forEach((product) => {
    product.data.forEach((month_sales) => {
      const { name, Total } = month_sales;
      if (!productMonthlySales[name]) {
        productMonthlySales[name] = 0;
      }
      productMonthlySales[name] += Total;
    });
  });
  console.log("productMonthlySales:", productMonthlySales);

  // Calculating net Transactional Data
  const TransactionalData = months.map((month) => ({
    name: month,
    Total: (userMonthlyTotals[month] || 0) + (productMonthlySales[month] || 0),
  }));

  //transfering Transactional Data to other file
  setTransactionalData(TransactionalData);
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className="charts">
          <Featured />
          <Chart
            title="Monthly Revenue"
            aspect={2 / 1}
            data={TransactionalData}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
