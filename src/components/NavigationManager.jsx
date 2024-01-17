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
import { TestComponent } from "./TestComponent";
import { AddMeal } from "../views/AddMeal";
import { UserClientList } from "../views/UserClientList";

export const NavigationManager = () => {
  const navigation = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInProfile, setLoggedInprofile] = useState(null);
  const [isClient, setIsClient] = useState(null);

  const [token, setToken] = useState(null);

  const onLogOut = useCallback(() => {
    localStorage.removeItem("roles");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    setLoggedIn(false);
    setLoggedInprofile(null);
    setIsClient(null);
    setTimeout(() => {
      if (
        !window.location.href.endsWith("/login") &&
        !window.location.href.endsWith("/register")
      ) {
        navigation("/login", { replace: true });
      }
    }, 0);
  }, [navigation]);

  const onLogIn = useCallback(
    (email, roles, token) => {
      Axios.get(
        `//localhost:3500/${
          roles.includes("user") ? `search` : `clients/getClient`
        }/email=${email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
        .then((res) => {
          console.log("loggin in");
          setIsClient(roles.includes("user") ? false : true);
          setLoggedIn(true);
          setLoggedInprofile(res.data);
          console.log(res);
          setToken(token);
          navigation("/myProfile", {
            replace: true,
          });
        })
        .catch(() => {
          console.log("Something went wrong while fetching profile info.");
          onLogOut();
        });
    },
    [navigation, onLogOut]
  );

  useEffect(() => {
    const checkLoggedInState = () => {
      const email = localStorage.getItem("email");
      const token = localStorage.getItem("token");
      const roles = localStorage.getItem("roles");

      if (email && token && roles && !loggedIn) {
        onLogIn(email, roles, token);
      } else if (loggedIn && (!email || !token || !roles)) {
        onLogOut();
      }
    };

    checkLoggedInState();
  }, [loggedIn, loggedInProfile, onLogOut, onLogIn]);

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
        <Route path="/login" element={<Login onLogIn={onLogIn} />} />
        <Route
          path="/register"
          element={<Register navigation={navigation} />}
        />
        <Route
          path="/myProfile"
          element={
            <Profile
              onLogOut={onLogOut}
              isClient={isClient}
              token={token}
              profile={loggedInProfile}
            />
          }
        />
        <Route
          path="/myClients"
          element={
            <UserClientList
              onLogOut={onLogOut}
              email={
                loggedInProfile && loggedInProfile.email
                  ? loggedInProfile.email
                  : ""
              }
              token={token}
            />
          }
        />
        <Route path="/notLoggedIn" element={<NotLoggedIn />} />
        <Route
          path="/assignClient"
          element={
            <AssignNewClient navigation={navigation} onLogOut={onLogOut} />
          }
        />
        <Route
          path="/clientDetails/:id"
          element={<ClientDetails onLogOut={onLogOut} />}
        />
        <Route
          path="/clientDetails/:id/addMeal"
          element={<AddMeal onLogOut={onLogOut} />}
        />
        <Route path="/test" element={<TestComponent />} />
      </Routes>
    </>
  );
};
