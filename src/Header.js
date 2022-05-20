import React from "react";
import "./Header.css";
import SearchIcon from "@mui/icons-material/Search";
import HeaderOption from "./HeaderOption";
import { useDispatch } from "react-redux";
import { auth } from "./firebase";
import { logout } from "./features/userSlice";
import LogoutIcon from "@mui/icons-material/Logout";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutOfApp = () => {
    Swal.fire({
      confirmButtonColor: "red",
      position: "top",
      title: "Are you sure to log out?",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        dispatch(logout());
        auth.signOut();
      }
    });
  };
  return (
    <div className="header">
      <div className="header__left">
        <a href="/">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2065/2065157.png"
            alt=""
          />
        </a>

        <div className="header__search">
          <SearchIcon />
          <input placeholder="Search" type="text" />
        </div>
      </div>

      <div className="header__right">
        <HeaderOption
          avatar={true}
          title="Me"
          onClick={() => {
            // navigate("/my-page");
            window.location.href = "/my-page";
          }}
        />

        <HeaderOption
          Icon={LogoutIcon}
          title="Sign Out"
          onClick={logoutOfApp}
        />
      </div>
    </div>
  );
}

export default Header;
