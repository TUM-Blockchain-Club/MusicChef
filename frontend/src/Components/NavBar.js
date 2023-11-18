import React from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";

export default function NavBar() {
  return (
    <div>
      <Menu>
            <Link to="/">Home</Link>
            <Link to="/upload">Upload new song</Link>
      </Menu>
    </div>
  );
}
