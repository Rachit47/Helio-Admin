import { useContext } from "react";
import "./sidebar.scss";
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
import { DarkModeContext } from "../../context/darkModeContext";
const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  return (
    <div className={"sidebar"}>
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">HelioDash</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li>
            <Link to="/" style={{ textDecoration: "none" }}>
              <DashboardRoundedIcon className="icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <p className="title">LISTS</p>
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <Person4RoundedIcon className="icon" />
              <span>Customers</span>
            </li>
          </Link>
          <Link to="/products" style={{ textDecoration: "none" }}>
            <li>
              <Inventory2RoundedIcon className="icon" />
              <span>Products</span>
            </li>
          </Link>
          <li>
            <BorderStyleIcon className="icon" />
            <span>Orders</span>
          </li>
          {/* <li>
            <LocalShippingRoundedIcon className="icon" />
            <span>Delivery</span>
          </li> */}
          <p className="title">USEFUL</p>
          <li>
            <InsightsRoundedIcon className="icon" />
            <span>Stats</span>
          </li>
          <li>
            <NotificationsActiveRoundedIcon className="icon" />
            <span>Notifications</span>
          </li>
          <p className="title">SERVICES</p>
          <li>
            <SettingsSystemDaydreamRoundedIcon className="icon" />
            <span>System Health</span>
          </li>
          <li>
            <InputRoundedIcon className="icon" />
            <span>Logs</span>
          </li>
          {/* <li>
            <SettingsApplicationsRoundedIcon className="icon" />
            <span>Settings</span>
          </li> */}
          <p className="title">USER</p>
          <li>
            <AccountBoxRoundedIcon className="icon" />
            <span>Profile</span>
          </li>
          <li>
            <ExitToAppRoundedIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => {
            dispatch({ type: "DARK" });
          }}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
