import "./productDatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { productColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
const ProductDatatable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          const docdata = doc.data();
          list.push({
            id: doc.id,
            img: docdata.img,
            title: docdata.title,
            price: docdata.price,
            quantity: docdata.quantity,
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
      await deleteDoc(doc(db, "products", id));
      setData(data.filter((data) => data.id !== id));
    } catch (err) {
      console.log(err);
    }
  };
  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 180,
      renderCell: (params) => {
        return (
          <div className="procellAction">
            <Link
              to={`/products/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="proviewButton">VIEW</div>
            </Link>
            <div
              className="prodeleteButton"
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
    <div className="prodatatable">
      <div className="prodatatableTitle">
        Add New Product
        <Link to="/products/new" className="prolink">
          Add New
        </Link>
      </div>
      <DataGrid
        className="prodatagrid"
        rows={data}
        columns={productColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default ProductDatatable;
