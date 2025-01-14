import { signOut } from "firebase/auth"; // Import signOut from Firebase
import { auth } from "../../firebase"; // Import your Firebase configuration
// import "./sidebar.scss";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Person4RoundedIcon from "@mui/icons-material/Person4Rounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import BorderStyleIcon from "@mui/icons-material/BorderStyle";
// import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import SettingsSystemDaydreamRoundedIcon from "@mui/icons-material/SettingsSystemDaydreamRounded";
import InputRoundedIcon from "@mui/icons-material/InputRounded";
// import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
import ExitToAppRoundedIcon from "@mui/icons-material/ExitToAppRounded";
import AccountBoxRoundedIcon from "@mui/icons-material/AccountBoxRounded";
import { Link } from "react-router-dom";
const Sidebar = () => {
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      sessionStorage.removeItem("user");
      window.location.replace("/login");
    } catch (error) {
      console.log("Error signing out: ", error);
    }
  };

  return (
    <div className="sidebar flex flex-col min-h-screen bg-gray-50 border-r border-gray-300 sm:w-[200px] xs:w-[0px] xs:hidden sm:flex">
      <div className="top mt-2 shadow-md flex items-center justify-center h-12">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo text-orange-500 font-bold text-2xl font-bold font-keania">
            HelioDash
          </span>
        </Link>
      </div>
      <hr className="border-gray-300" />
      <div className="center flex-1 overflow-y-auto py-2 px-3">
        <ul className="list-none p-0 m-0 ">
          <p className="title font-saira font-semibold text-gray-500 mt-0 mb-0 text-sm sm:text-xs">
            MAIN
          </p>
          <li className="flex items-center p-2 cursor-pointer hover:bg-blue-100">
            <Link
              to="/"
              style={{ textDecoration: "none" }}
              className="flex items-center"
            >
              <DashboardRoundedIcon className="icon text-orange-500 text-lg sm:text-md xs:text-sm" />
              <span className="ml-2 text-gray-500 font-medium text-sm sm:text-xs font-saira">
                Dashboard
              </span>
            </Link>
          </li>
          <p className="title font-saira text-xs font-semibold text-gray-500 mt-4 mb-2">
            LISTS
          </p>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li className="flex items-center p-1 cursor-pointer hover:bg-blue-100">
              <Person4RoundedIcon className="icon text-orange-500 text-lg sm:text-md xs:text-sm" />
              <span className="ml-2 text-gray-500 font-medium text-sm sm:text-xs font-saira">
                Customers
              </span>
            </li>
          </Link>
          <Link to="/products" style={{ textDecoration: "none" }}>
            <li className="flex items-center p-1 cursor-pointer hover:bg-blue-100">
              <Inventory2RoundedIcon className="icon text-orange-500 text-lg sm:text-md xs:text-sm" />
              <span className="ml-2 text-gray-500 font-medium text-sm sm:text-xs font-saira">
                Products
              </span>
            </li>
          </Link>
          <Link to="/orders" style={{ textDecoration: "none" }}>
            <li className="flex items-center p-1 cursor-pointer hover:bg-blue-100">
              <BorderStyleIcon className="icon text-orange-500 text-lg sm:text-md xs:text-sm" />
              <span className="ml-2 text-gray-500 font-medium text-sm sm:text-xs font-saira">
                Orders
              </span>
            </li>
          </Link>
          <p className="title font-saira text-xs font-semibold text-gray-500 mt-4 mb-2">
            USEFUL
          </p>
          <Link to="/stats" style={{ textDecoration: "none" }}>
            <li className="flex items-center p-1 cursor-pointer hover:bg-blue-100">
              <InsightsRoundedIcon className="icon text-orange-500 text-lg sm:text-md xs:text-sm" />
              <span className="ml-2 text-gray-500 font-medium text-sm sm:text-xs font-saira">
                Stats
              </span>
            </li>
          </Link>
          <li className="flex items-center p-1 cursor-pointer hover:bg-blue-100">
            <NotificationsActiveRoundedIcon className="icon text-orange-500 text-lg sm:text-md xs:text-sm" />
            <span className="ml-2 text-gray-500 font-medium text-sm sm:text-xs font-saira">
              Notifications
            </span>
          </li>
          <p className="title font-saira text-xs font-semibold text-gray-500 mt-4 mb-2">
            SERVICES
          </p>
          <li className="flex items-center p-1 cursor-pointer hover:bg-blue-100">
            <SettingsSystemDaydreamRoundedIcon className="icon text-orange-500 text-lg sm:text-md xs:text-sm" />
            <span className="ml-2 text-gray-500 font-medium text-sm sm:text-xs font-saira">
              System Health
            </span>
          </li>
          <li className="flex items-center p-1 cursor-pointer hover:bg-blue-100">
            <InputRoundedIcon className="icon text-orange-600 text-lg sm:text-md xs:text-sm" />
            <span className="ml-2 text-gray-500 font-medium text-sm sm:text-xs font-saira">
              Logs
            </span>
          </li>
          <p className="title font-saira text-xs font-semibold text-gray-500 mt-4 mb-2">
            USER
          </p>
          <li className="flex items-center p-1 cursor-pointer hover:bg-blue-100">
            <a
              href="https://rs505-portfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <AccountBoxRoundedIcon className="icon text-orange-600 text-lg sm:text-md xs:text-sm" />
              <span className="ml-2 text-gray-500 font-medium text-sm sm:text-xs font-saira">
                Profile
              </span>
            </a>
          </li>
          <li className="flex items-center p-1 cursor-pointer hover:bg-blue-100">
            <ExitToAppRoundedIcon className="icon text-orange-600 text-lg sm:text-md xs:text-sm" />
            <div
              onClick={handleLogout}
              className="ml-2 text-gray-500 font-medium text-sm cursor-pointer font-saira"
            >
              <span>Logout</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
