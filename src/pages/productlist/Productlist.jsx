import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./productlist.scss";
import ProductDatatable from "../../components/productDatatable/productDatatable";

const Productlist = () => {
  return (
    <div className="prolist">
      <Sidebar />
      <div className="prolistContainer">
        <Navbar />
        <hr className="border-gray-300" />
        <ProductDatatable />
      </div>
    </div>
  );
};

export default Productlist;
