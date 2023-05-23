import "./Nav.scss";
import "./NavLibrary.scss";
import { IoHomeOutline, IoSearch, IoLibraryOutline } from "react-icons/io5";

const Nav = (props) => {
  return (
    <div>
      <div className="nav">
        <div className="nav-link">
          <IoHomeOutline /> Home
        </div>
        <div className="nav-link">
          <IoSearch /> Search
        </div>
      </div>
      <div className="library">
        <div className="library-link">
          <div>
            <IoLibraryOutline /> Library
          </div>
          <div className="library-link__add">+</div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
