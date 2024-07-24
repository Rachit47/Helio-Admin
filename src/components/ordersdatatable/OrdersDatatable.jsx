import "./ordersdatatable.scss";
import * as React from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { orderColumns } from "../../datatablesource";
import { useState, useEffect } from "react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
const OrdersDatatable = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          const docdata = doc.data();
          const orderDateTimestamp = docdata.orderDate;
          const orderDate = orderDateTimestamp.toDate();
          const year = orderDate.getFullYear();
          const month = orderDate.getMonth() + 1;
          const day = orderDate.getDate();
          const formattedDate = `${day}-${month}-${year}`;
          list.push({
            id: doc.id,
            customer: docdata.customer,
            orderDate: formattedDate,
            amount: Number(docdata.amount),
            product: docdata.product,
            paymentMethod: docdata.paymentMethod,
          });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      setData(data.filter((data) => data.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="ordercellAction">
            <div
              className="orderdeleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              DELETE
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="orderdatatable">
      <div className="orderdatatableTitle">
        Orders{" "}
        <Link to="/orders/new" className="orderlink">
          Add New
        </Link>
      </div>
      <DataGrid
        className="orderdatagrid"
        rows={data}
        columns={orderColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default OrdersDatatable;
