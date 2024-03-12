import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Axios from "axios";
import { TextField, Button, Alert, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

export const Login = ({ onLogIn, isLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loginError, setLoginError] = useState();
  const [showErrors, setShowErrors] = useState(false);

  const navigation = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!password) {
      setPasswordError(t("password_error_noPassword"));
      return;
    }
    setPasswordError("");
  }, [t, password, loginError]);

  useEffect(() => {
    if (!email) {
      setEmailError(t("email_error_noEmail"));
      return;
    }
    setEmailError("");
  }, [t, email, loginError]);

  useEffect(() => {
    if (loginError) {
      setLoginError(t("auth_login_invalid"));
    }
  }, [t, loginError]);

  useEffect(() => {
    setLoginError("");
  }, [email, password]);

  const handleLogin = (e) => {
    e.preventDefault();
    setShowErrors(true);

    if (passwordError || emailError) {
      return;
    }

    Axios.post("//localhost:3500/auth/login", {
      email: email,
      password: password,
    })
      .then((res) => {
        const token = res.data.accessToken;
        const { email, roles } = jwtDecode(token).UserInfo;
        localStorage.setItem("email", email);
        localStorage.setItem("roles", roles);
        localStorage.setItem("token", token);
        console.log(token);
        setLoginError("");
        onLogIn(email, roles, token, true);
      })
      .catch(() => {
        setLoginError(t("auth_login_invalid"));
      });
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigation("/home", { replace: true });
    }
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2>{t("login_welcome")}</h2>
      <FormControl style={{ marginBottom: "10px" }}>
        <FormControl>
          <TextField
            label={`${t("email")}`}
            type="email"
            placeholder={`${t("email")}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ m: "10px" }}
          />
          {emailError && showErrors ? (
            <Alert severity="error" variant="filled">
              {emailError}
            </Alert>
          ) : null}
        </FormControl>
        <FormControl>
          <TextField
            label={`${t("password")}`}
            type="password"
            placeholder="************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ m: "10px" }}
          />
          {passwordError && showErrors ? (
            <Alert severity="error" variant="filled">
              {passwordError}
            </Alert>
          ) : null}
        </FormControl>
      </FormControl>
      <Button
        sx={{ m: "10px" }}
        variant="contained"
        onClick={(e) => handleLogin(e)}
      >
        {`${t("login")}`}
      </Button>
      {loginError && showErrors ? (
        <Alert severity="error" variant="filled">
          {loginError}
        </Alert>
      ) : null}
      <p>
        {`${t("login_noAccount")} `}
        <a href="../register">{`${t("login_registerHere")}`}</a>
      </p>
    </div>
  );
};
