import { useContext } from "react";
// import "./navbar.scss";
import avatar_logo from "./Portfolio_avatar.jpg";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import FullscreenExitRoundedIcon from "@mui/icons-material/FullscreenExitRounded";
import ListRoundedIcon from "@mui/icons-material/ListRounded";
import { DarkModeContext } from "../../context/darkModeContext";
const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <div className="navbar h-14 border-b border-gray-300 flex items-center text-sm text-gray-700">
      <div className="wrapper w-full px-5 flex items-center justify-between pt-0 pb-0">
        {/* Search Section */}
        <div className="search flex items-center border border-gray-300 p-1">
          <input
            type="text"
            placeholder="Search..."
            className="border-none outline-none bg-transparent text-gray-500 text-xs placeholder:text-xs"
          />
          <SearchRoundedIcon className="icon text-lg cursor-pointer" />
        </div>

        {/* Navbar Items */}
        <div className="items flex items-center space-x-5">
          <div className="item flex items-center space-x-2">
            <LanguageRoundedIcon className="icon text-lg cursor-pointer" />
            <span>English</span>
          </div>
          <div className="item flex items-center">
            <DarkModeRoundedIcon
              className="icon text-lg cursor-pointer"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>
          <div className="item flex items-center">
            <FullscreenExitRoundedIcon
              className="icon text-lg cursor-pointer"
              onClick={toggleFullscreen}
            />
          </div>
          {/* Optional: Uncomment notifications and chat */}
          {/* <div className="item relative flex items-center">
        <NotificationsNoneRoundedIcon className="icon text-lg cursor-pointer" />
        <div className="counter absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
          1
        </div>
      </div>
      <div className="item relative flex items-center">
        <ChatBubbleOutlineRoundedIcon className="icon text-lg cursor-pointer" />
        <div className="counter absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
          1
        </div>
      </div> */}
          <div className="item flex items-center">
            <ListRoundedIcon className="icon text-lg cursor-pointer" />
          </div>
          <div className="item flex items-center">
            <img
              src={avatar_logo}
              alt="avatar"
              className="avatar w-10 h-10 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
