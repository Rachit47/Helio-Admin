import React, { useEffect, useState } from "react";
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
    // Real-time listeners for users, orders, and balance
    const unsubTotalUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        setTotalUsers(snapshot.docs.length);
      },
      (error) => {
        console.error(error);
      }
    );

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

    fetchUserDiffData();
    fetchOrderDiffData();

    const unsubUserStats = onSnapshot(
      collection(db, "users"),
      async () => {
        await fetchUserDiffData();
      },
      (error) => {
        console.error(error);
      }
    );

    const unsubOrderStats = onSnapshot(
      collection(db, "orders"),
      async () => {
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
    <div className="widget-container flex flex-wrap justify-center gap-4  mr-0">
      <div className="widget p-4 pt-2 pb-2 rounded-lg h-auto  lg:w-[295px] md:w-[730px] sm:w-[730px] font-saira shadow-[4px_6px_15px_2px_rgba(201,201,201,0.6)] relative transition-transform duration-300 hover:scale-105 hover:shadow-[4px_6px_15px_2px_rgba(201,201,201,0.6)] ">
        <div className="left flex flex-col justify-between">
          <span className="title font-saira text-gray-500 text-sm font-bold sm:text-base">
            {data.title}
          </span>
          <span className="counter font-saira text-xl font-light sm:text-2xl">
            {data.isMoney && "$"} {data.value}
          </span>
          <span className="link font-saira text-gray-400 text-xs sm:text-sm">
            <Link to={`${data.page}`} className="underline font-saira">
              {data.link}
            </Link>
          </span>
        </div>

        {/* Percentage positioned within the widget */}
        {data.showDiff && (
          <div
            className={`percentage absolute top-2 right-2 text-sm font-saira ${
              data.sign ? "text-red-500" : "text-green-500"
            }`}
          >
            {data.sign ? <ExpandMoreRoundedIcon /> : <ExpandLessRoundedIcon />}
            {data.percentDiff}%
          </div>
        )}

        {/* Icon positioned within the widget */}
        <div className="absolute bottom-4 right-4 flex items-center justify-center">
          {data.icon}
        </div>
      </div>

      {/* Repeat more Widgets */}
    </div>
  );
};

export default Widget;
