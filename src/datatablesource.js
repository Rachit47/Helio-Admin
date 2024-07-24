export const userColumns = [
  { field: "id", headerName: "ID", width: 100 },
  {
    field: "user",
    headerName: "Customer",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 250,
  },
  {
    field: "phone",
    headerName: "Phone Number",
    width: 180,
  },
  {
    field: "city",
    headerName: "City",
    width: 120,
  },
  {
    field: "country",
    headerName: "Country",
    width: 120,
  },
];

export const productColumns = [
  { field: "id", headerName: "ID", width: 120 },
  {
    field: "title",
    headerName: "Product",
    width: 250,
    renderCell: (params) => {
      return (
        <div className="procellWithImg">
          <img src={params.row.img} alt="product" className="procellImg" />
          {params.row.title}
        </div>
      );
    },
  },
  {
    field: "price",
    headerName: "Price (in $)",
    width: 150,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    width: 120,
    renderCell: (params) => {
      return (
        <div className={`procellWithStatus ${params.row.quantity}`}>
          {params.row.quantity}
        </div>
      );
    },
  },
];

export const orderColumns = [
  { field: "id", headerName: "Order ID", width: 150 },
  { field: "customer", headerName: "Customer", width: 180 },
  {
    field: "product",
    headerName: "Product",
    width: 230,
  },
  {
    field: "orderDate",
    headerName: "Order Date",
    width: 150,
  },
  {
    field: "amount",
    headerName: "Amount ($)",
    width: 140,
  },
  {
    field: "paymentMethod",
    headerName: "Payment Method",
    width: 180,
    renderCell: (params) => {
      return (
        <div className={`paymentMethod ${params.row.paymentMethod}`}>
          {params.row.paymentMethod}
        </div>
      );
    },
  },
];
