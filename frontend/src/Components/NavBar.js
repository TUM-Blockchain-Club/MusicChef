import React from "react";
import { Link } from "react-router-dom";
import { slide as Menu } from "react-burger-menu";

export default function NavBar() {
  return (
    <div>
      {/* <nav> */}
      <Menu>
        {/* <ul>
          <li className="bm-item"> */}
            <Link to="/">Home</Link>
          {/* </li>
          <li className="bm-item"> */}
            <Link to="/upload">Upload new song</Link>
          {/* </li>
        </ul> */}
      </Menu>
      {/* </nav> */}
    </div>
  );
}
