import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./orderslist.scss";
import OrdersDatatable from "../../components/ordersdatatable/OrdersDatatable";

const OrdersList = () => {
  return (
    <div className="orderlist">
      <Sidebar />
      <div className="orderlistContainer">
        <Navbar />
        <OrdersDatatable />
      </div>
    </div>
  );
};

export default OrdersList;
