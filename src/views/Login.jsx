import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Axios from "axios";
import { TextField, Button, Alert, FormControl } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Login = ({ onLogIn, isLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setLoginError] = useState();

  const navigation = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email) {
      setLoginError("Email must be provided.");
      return;
    }
    if (!password) {
      setLoginError("Password must be provided.");
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
        setLoginError("Invalid credentials");
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
      <h2>Welcome, please log in</h2>
      <FormControl style={{ marginBottom: "10px" }}>
        <FormControl>
          <TextField
            label="Email"
            type="email"
            placeholder="youremail@address.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ m: "10px" }}
          />
        </FormControl>
        <FormControl>
          <TextField
            label="Password"
            type="password"
            placeholder="************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ m: "10px" }}
          />
        </FormControl>
      </FormControl>
      <Button
        sx={{ m: "10px" }}
        variant="contained"
        onClick={(e) => handleLogin(e)}
      >
        Login
      </Button>
      {loginError ? (
        <Alert severity="error" variant="filled">
          {loginError}
        </Alert>
      ) : null}
      <p>
        Dont have account yet? <a href="../register">Register here!</a>
      </p>
    </div>
  );
};
