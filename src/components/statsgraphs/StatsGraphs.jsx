import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./statsgraphs.scss";
import "react-circular-progressbar/dist/styles.css";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

const StatsGraphs = () => {
  const [productUnitsData, setProductUnitsData] = useState([]);
  const [productsNames, setProductsNames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching only product names
        const unsubProductNames = onSnapshot(
          collection(db, "products"),
          (snapshot) => {
            let productData = [];
            snapshot.forEach((doc) => {
              productData.push({
                id: doc.id,
                name: doc.data().title,
              });
            });
            setProductsNames(productData);
          },
          (error) => {
            console.log(error);
          }
        );

        // Fetching the product units sold
        const unsubUnits = onSnapshot(
          collection(db, "productUnitsSold"),
          (snapshot) => {
            let unitsData = [];
            snapshot.docs.forEach((doc) => {
              let productName = productsNames.find(
                (p) => p.id === doc.id
              )?.name;
              unitsData.push({ id: doc.id, name: productName, ...doc.data() });
            });
            setProductUnitsData(unitsData);
            setLoading(false);
          },
          (error) => {
            console.log(error);
          }
        );

        // Unsubscribing from database snapshots when component unmounts
        return () => {
          unsubProductNames();
          unsubUnits();
        };
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [productsNames]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="statsgraph">
      <div className="statsTitle">Product Units Sold Per Month</div>
      <ResponsiveContainer width="100%" aspect={2 / 1.2} className="StatsContainer">
        <LineChart width={500} height={300}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            type="category"
            allowDuplicatedCategory={false}
          />
          <YAxis dataKey="units" />
          <Tooltip />
          <Legend />
          {productUnitsData.map((s) => (
            <Line dataKey="units" data={s.sales} name={s.name} key={s.name} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsGraphs;
