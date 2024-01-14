import { Profile } from "./Profile";
import Axios from "axios";
import { Route, Navigate, useNavigate, Routes } from "react-router-dom";
import { Login } from "../views/Login";
import { AssignNewClient } from "../views/AssignNewClient";
import { Register } from "../views/Register";
import { NotLoggedIn } from "../views/NotLoggedIn";
import { ClientDetails } from "../views/ClientDetails";
import React, { useEffect, useState, useCallback } from "react";
import { Header } from "./Header";
import { isEqual } from "lodash";
import { TestComponent } from "./TestComponent";
import { AddMeal } from "../views/AddMeal";

export const NavigationManager = () => {
  const navigation = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInProfile, setLoggedInprofile] = useState(null);

  const onLogOut = useCallback(() => {
    localStorage.removeItem("roles");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    setLoggedIn(false);
    setLoggedInprofile(null);
    setTimeout(() => {
      if (
        !window.location.href.endsWith("/login") &&
        !window.location.href.endsWith("/register")
      ) {
        navigation("/login", { replace: true });
      }
    }, 0);
  }, [navigation]);

  const onLogIn = (profileInfo) => {
    setLoggedIn(true);
    setLoggedInprofile(profileInfo);
  };

  useEffect(() => {
    const checkLoggedInState = () => {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem("token");
      const roles = localStorage.getItem("roles");

      if (email && token && roles) {
        Axios.get(`//localhost:3500/search/email=${email}`)
          .then((res) => {
            if (!loggedIn || !isEqual(res.data, loggedInProfile)) {
              console.log("logging in");
              onLogIn(res.data);
            }
          })
          .catch(() => {
            console.log("Something went wrong while fetching profile info.");
          });
      } else {
        console.log("logging out");
        onLogOut();
      }
    };

    checkLoggedInState();
  }, [loggedIn, loggedInProfile, onLogOut]);

  return (
    <>
      <Header
        profile={loggedInProfile}
        onLogOut={onLogOut}
        navigation={navigation}
      ></Header>
      <Routes>
        {/* <Route path="/" element={<Layout />}> */}
        {/* <Route index element={<Home />} /> */}
        <Route index element={<Navigate to="/register" replace />} />
        <Route path="/login" element={<Login navigation={navigation} />} />
        <Route
          path="/register"
          element={<Register navigation={navigation} />}
        />
        <Route path="/myProfile" element={<Profile onLogIn={onLogIn} />} />
        <Route path="/notLoggedIn" element={<NotLoggedIn />} />
        <Route
          path="/assignClient"
          element={<AssignNewClient navigation={navigation} />}
        />
        <Route path="/clientDetails/:id" element={<ClientDetails />} />
        <Route path="/clientDetails/:id/addMeal" element={<AddMeal />} />
        <Route path="/test" element={<TestComponent />} />
      </Routes>
    </>
  );
};
