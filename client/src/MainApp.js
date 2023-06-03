import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  redirect,
} from "react-router-dom";

import "./MainApp.scss";
import Nav from "./nav/Nav";
import App from "./app/App";
import Player from "./player/Player";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {isLoggedIn} from "./store/thunks/user";

function MainApp() {
  const [loading, setLoading] = useState(true)

  // Redux
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    dispatch(isLoggedIn())
  }, [])

  useEffect(() => {
    if(user.auth === true) {
      setLoading(false)
    }
  }, [user])

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
          loading ? <div>Loading...</div> :

            <div className="main-app">
              <Nav />
              <App />
              <Player />
            </div>

            // <Navigate to='/login' />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainApp;
