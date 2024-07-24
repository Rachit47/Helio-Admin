import React, { useEffect, useState } from "react";
import "./widget.scss";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import MonetizationOnRoundedIcon from "@mui/icons-material/MonetizationOnRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import { getTransactionalData } from "../../pages/home/ExportTransactionalData";

const Widget = ({ type }) => {
  const [usersDiff, setUsersDiff] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [Balance, setBalance] = useState(0);
  const [ordersDiff, setOrdersDiff] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);

  const calculatePercentDiff = (currentValue, previousValue) => {
    if (previousValue === 0) return currentValue === 0 ? 0 : 100;
    return ((currentValue - previousValue) / previousValue) * 100;
  };

  useEffect(() => {
    // Real-time listener for total users
    const unsubTotalUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        setTotalUsers(snapshot.docs.length);
      },
      (error) => {
        console.error(error);
      }
    );

    // Real-time listener for total orders
    const unsubTotalOrders = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        setTotalOrders(snapshot.docs.length);
      },
      (error) => {
        console.error(error);
      }
    );

    const unsubBalance = onSnapshot(
      collection(db, "balance"),
      (snapshot) => {
        let bal = 0;
        snapshot.docs.forEach((doc) => {
          const docData = doc.data();
          bal += docData.staticAmount;
        });
        setBalance(bal);
      },
      (error) => {
        console.error(error);
      }
    );

    //Extracting the end-points (dates) of current month and the last month
    const today = new Date();

    const firstDayOfThisMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    const firstDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const lastDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    );

    const fetchUserDiffData = async () => {
      const thisMonthQuery = query(
        collection(db, "users"),
        where("timeStamp", ">=", firstDayOfThisMonth),
        where("timeStamp", "<=", today)
      );
      const lastMonthQuery = query(
        collection(db, "users"),
        where("timeStamp", ">=", firstDayOfLastMonth),
        where("timeStamp", "<=", lastDayOfLastMonth)
      );

      const thisMonthData = await getDocs(thisMonthQuery);
      const lastMonthData = await getDocs(lastMonthQuery);

      setUsersDiff(
        calculatePercentDiff(
          thisMonthData.docs.length,
          lastMonthData.docs.length
        )
      );
    };

    const fetchOrderDiffData = async () => {
      const thisMonthOrdersQuery = query(
        collection(db, "orders"),
        where("orderDate", ">=", firstDayOfThisMonth),
        where("orderDate", "<=", today)
      );
      const lastMonthOrdersQuery = query(
        collection(db, "orders"),
        where("orderDate", ">=", firstDayOfLastMonth),
        where("orderDate", "<=", lastDayOfLastMonth)
      );

      const thisMonthOrdersData = await getDocs(thisMonthOrdersQuery);
      const lastMonthOrdersData = await getDocs(lastMonthOrdersQuery);

      setOrdersDiff(
        calculatePercentDiff(
          thisMonthOrdersData.docs.length,
          lastMonthOrdersData.docs.length
        )
      );
    };

    // Fetch data initially
    fetchUserDiffData();
    fetchOrderDiffData();

    // Real-time listener for user statistics
    const unsubUserStats = onSnapshot(
      collection(db, "users"),
      async (snapshot) => {
        await fetchUserDiffData();
      },
      (error) => {
        console.error(error);
      }
    );

    // Real-time listener for order statistics
    const unsubOrderStats = onSnapshot(
      collection(db, "orders"),
      async (snapshot) => {
        await fetchOrderDiffData();
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      unsubTotalUsers();
      unsubUserStats();
      unsubTotalOrders();
      unsubOrderStats();
      unsubBalance();
    };
  }, []);

  let totaltransactionEarnings = 0;

  const transactiondata = getTransactionalData();
  transactiondata.forEach((t) => {
    totaltransactionEarnings += t.Total;
  });

  const totalBalance = Balance + totaltransactionEarnings;

  let data;
  switch (type) {
    case "user":
      data = {
        title: "USERS",
        page: "users",
        value: totalUsers,
        sign: usersDiff < 0 ? true : false,
        percentDiff: usersDiff ? Math.abs(usersDiff).toFixed(2) : 0,
        showDiff: true,
        isMoney: false,
        link: "View All Customers",
        icon: (
          <PersonRoundedIcon
            className="icon"
            style={{ color: "crimson", backgroundColor: "rgba(255,0,0,0.2)" }}
          />
        ),
      };
      break;
    case "order":
      data = {
        title: "ORDERS",
        value: totalOrders,
        page: "orders",
        showDiff: true,
        isMoney: false,
        sign: ordersDiff < 0 ? true : false,
        percentDiff: ordersDiff ? Math.abs(ordersDiff).toFixed(2) : 0,
        link: "View All Orders",
        icon: (
          <ShoppingCartRoundedIcon
            className="icon"
            style={{
              color: "goldenrod",
              backgroundColor: "rgba(218,165,32,0.2)",
            }}
          />
        ),
      };
      break;
    case "earning":
      data = {
        title: "EARNINGS",
        value: totaltransactionEarnings,
        showDiff: false,
        isMoney: true,
        icon: (
          <MonetizationOnRoundedIcon
            className="icon"
            style={{ color: "green", backgroundColor: "rgba(0,128,0,0.2)" }}
          />
        ),
      };
      break;
    case "balance":
      data = {
        title: "NET BALANCE",
        isMoney: true,
        value: totalBalance,
        showDiff: false,
        icon: (
          <AccountBalanceWalletRoundedIcon
            className="icon"
            style={{ color: "purple", backgroundColor: "rgba(128,0,128,0.2)" }}
          />
        ),
      };
      break;
    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {data.value}
        </span>
        <span className="link">
          <Link to={`${data.page}`} style={{ textDecoration: "none" }}>
            {data.link}
          </Link>
        </span>
      </div>
      <div className="right">
        {data.showDiff &&
          (data.sign === false ? (
            <div className="percentage positive">
              <ExpandLessRoundedIcon />
              {data.percentDiff}%
            </div>
          ) : (
            <div className="percentage negative">
              <ExpandMoreRoundedIcon />
              {data.percentDiff}%
            </div>
          ))}
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
