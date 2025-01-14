import React, { useEffect, useState } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../../firebase";

const Featured = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [productsData, setProductsData] = useState([]);
  const [productUnitsData, setProductUnitsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setLoading(false);
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
      }
    );

    return () => {
      unsubUnitsTotal();
      unsubProducts();
    };
  }, []);

  let unitsTotal = [];
  for (let product of productUnitsData) {
    let eachProductTotalUnits = 0;
    for (let productData of product.sales) {
      eachProductTotalUnits += productData.units;
    }
    const prodName = productsData.find((p) => p.id === product.id)?.title;
    unitsTotal.push({ name: prodName, value: eachProductTotalUnits });
  }

  if (loading) {
    return <div className="text-gray-500 text-center">Loading...</div>;
  }

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke={fill} />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#999"
        >{`PV ${value}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const onPieEnter = (data, index) => {
    setActiveIndex(index);
  };

  return (
    <div className="flex-1 lg:flex-[5] shadow-[4px_6px_15px_2px_rgba(201,201,201,0.6)] relative transition-transform duration-300 hover:scale-105 hover:shadow-[4px_6px_15px_2px_rgba(201,201,201,0.6)] p-4 mr-4 mt-0 text-gray-500 rounded-lg">
      <h3 className="font-bold font-saira text-lg mb-4 text-center">
        Total Units Sold per Product
      </h3>
      <div className="w-full h-[350px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={unitsTotal}
              cx="50%" // Center horizontally
              cy="50%" // Center vertically
              innerRadius="60%" // Relative to container size
              outerRadius="80%" // Relative to container size
              fill="#f26255"
              dataKey="value"
              onMouseEnter={onPieEnter}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Featured;
