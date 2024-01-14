import "./App.css";
// import { Profile } from "./components/Profile";
import {
  BrowserRouter,
  // Routes,
  // Route,
  // Navigate,
  // useNavigate,
} from "react-router-dom";
// import { Login } from "./views/Login";
// import { Register } from "./views/Register";
// import { NotLoggedIn } from "./views/NotLoggedIn";
// import { useState } from "react";
// import { Header } from "./components/Header";
import { NavigationManager } from "./components/NavigationManager";

function App() {
  // const [loggedIn, setLoggedIn] = useState(false);
  // const [loggedInEmail, setLoggedInEmail] = useState("");

  // const onLogout = () => {
  //   localStorage.removeItem("roles");
  //   localStorage.removeItem("email");
  //   localStorage.removeItem("token");
  //   setLoggedInEmail("");
  //   setLoggedIn(false);
  //   // navigation("/login", { replace: true });
  // };

  // const onLogIn = (email) => {
  //   setLoggedIn(true);
  //   console.log(`email given: ${email}`);
  //   setLoggedInEmail(email);
  //   // navigation("/myProfile", { replace: true });
  // };

  return (
    <div className="App">
      <BrowserRouter>
        {
          //   <Routes>
          //   {/* <Route path="/" element={<Layout />}> */}
          //   {/* <Route index element={<Home />} /> */}
          //   <Route index element={<Navigate to="/register" replace />} />
          //   <Route path="/login" element={<Login onLogIn={onLogIn} />} />
          //   <Route path="/register" element={<Register />} />
          //   <Route path="/myProfile" element={<Profile />} />
          //   <Route path="/notLoggedIn" element={<NotLoggedIn />} />
          //   {/* </Route> */}
          // </Routes>
        }
        <NavigationManager />
      </BrowserRouter>
    </div>
  );
}

export default App;
