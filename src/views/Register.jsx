import { useState, useEffect } from "react";
import Axios from "axios";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  TextField,
  FormControl,
  Button,
  Alert,
} from "@mui/material";

// const EMAIL_REGEX2 =
//   /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
const EMAIL_REGEX =
  /^(?:(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|.(?:".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_LOWERCASE_REGEX = /^(?=.*[a-z]).*$/;
const PASSWORD_UPPERCASE_REGEX = /^(?=.*[A-Z]).*$/;
const PASSWORD_NUMBER_REGEX = /^(?=.*[0-9]).*$/;
const PASSWORD_SPECIAL_REGEX = /^(?=.*[!@#$%^&*]).*$/;
const PASSWORD_LENGTH_REGEX = /^.{8,32}$/;

export const Register = ({ navigation, isLoggedIn }) => {
  const [showErrors, setShowErrors] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [description, setDescription] = useState("");
  const [isClient, setIsClient] = useState(false);

  const [registerError, setRegisterError] = useState("");

  useEffect(() => {
    if (!PASSWORD_LENGTH_REGEX.test(password)) {
      setPasswordError(
        "The password must be between 8 and 32 characters long."
      );
      return;
    }
    if (!PASSWORD_LOWERCASE_REGEX.test(password)) {
      setPasswordError(
        "The password must contain at least one lower-case letter."
      );
      return;
    }
    if (!PASSWORD_UPPERCASE_REGEX.test(password)) {
      setPasswordError(
        "The password must contain at least one upper case letter."
      );
      return;
    }
    if (!PASSWORD_NUMBER_REGEX.test(password)) {
      setPasswordError("The password must contain at least one number.");
      return;
    }
    if (!PASSWORD_SPECIAL_REGEX.test(password)) {
      setPasswordError(
        "The password must contain at least one of the following characters: ! @ # $ % ^ & *"
      );
      return;
    }
    if (password !== passwordRepeat) {
      setPasswordError("Provided passwords do not match.");
      return;
    }
    setPasswordError("");
  }, [password, passwordRepeat]);

  useEffect(() => {
    if (!email) {
      setEmailError("Please provide an email.");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setEmailError("Please provide a valid email address.");
      return;
    }
    setEmailError("");
  }, [email]);

  useEffect(() => {
    if (isLoggedIn) {
      navigation("/home", { replace: true });
    }
  });

  const handleRegister = (event) => {
    event.preventDefault();

    if (passwordError || emailError) {
      return;
    }
    if (!name) {
      setRegisterError("Name must be provided.");
      return;
    }
    if (!surname) {
      setRegisterError("Surname must be provided.");
      return;
    }

    const registerRequestObject = {
      email: email,
      password: password,
      name: name,
      surname: surname,
      isClient: isClient,
    };
    if (!isClient) {
      registerRequestObject.description = description;
    }

    // console.log(registerRequestObject);
    // return;

    Axios.post("//localhost:3500/register", registerRequestObject)
      .then((res) => {
        const responseMessage = res.data.message;
        setRegisterError(responseMessage);
        setTimeout(() => {
          navigation("/login", { replace: true });
        }, 2000);
      })
      .catch(() => {
        setRegisterError("Invalid credentials");
      });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <FormControl
        style={{
          minWidth: "30%",
          maxWidth: "30%",
        }}
      >
        <h2>Welcome, please register</h2>
        <FormControl>
          <FormLabel style={{ color: "black" }}>
            Why do you want to use the app?
          </FormLabel>
          <RadioGroup name="radio-buttons-group">
            <FormControlLabel
              value="user"
              control={<Radio />}
              label="I want to create diet plans for others"
              onChange={(e) => {
                setIsClient(e.target.value === "client");
              }}
              checked={!isClient}
            />
            <FormControlLabel
              value="client"
              control={<Radio />}
              label="I need help with creating my diet plan"
              onChange={(e) => {
                setIsClient(e.target.value === "client");
              }}
              checked={isClient}
            />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <TextField
            label={"Email"}
            type="email"
            placeholder="youremail@address.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // helperText={emailError && showErrors ? emailError : null}
            color={emailError && showErrors ? "error" : "primary"}
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
            label={"Password"}
            type="password"
            placeholder="************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            color={passwordError && showErrors ? "error" : "primary"}
            sx={{ m: "10px" }}
          />
          <TextField
            label={"Repeat password"}
            type="password"
            placeholder="************"
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
            color={passwordError && showErrors ? "error" : "primary"}
            sx={{ m: "10px" }}
          />
          {passwordError && showErrors ? (
            <Alert severity="error" variant="filled">
              {passwordError}
            </Alert>
          ) : null}
        </FormControl>
        <FormControl>
          <TextField
            label={"Name"}
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ m: "10px" }}
          />
        </FormControl>
        <FormControl>
          <TextField
            label={"Surname"}
            type="text"
            placeholder="Your surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            sx={{ m: "10px" }}
          />
        </FormControl>
        {!isClient ? (
          <FormControl>
            <FormLabel style={{ color: "black" }}>
              Tell your clients something about yourself:
            </FormLabel>
            <TextField
              multiline
              minRows={3}
              label={"Description"}
              type="text"
              placeholder="Description ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ m: "10px" }}
            />
          </FormControl>
        ) : null}
      </FormControl>
      <Button
        variant="contained"
        onClick={(e) => {
          handleRegister(e);
          setShowErrors(true);
        }}
      >
        Register
      </Button>

      <p style={{ display: registerError ? "block" : "none" }}>
        {registerError}
      </p>
      <p>
        Dont have account yet? <a href="../login">Log in here!</a>
      </p>
    </div>
  );
};
