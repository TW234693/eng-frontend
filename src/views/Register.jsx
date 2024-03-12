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
import { useTranslation } from "react-i18next";

const EMAIL_REGEX =
  /^(?:(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|.(?:".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_LOWERCASE_REGEX = /^(?=.*[a-z]).*$/;
const PASSWORD_UPPERCASE_REGEX = /^(?=.*[A-Z]).*$/;
const PASSWORD_NUMBER_REGEX = /^(?=.*[0-9]).*$/;
const PASSWORD_SPECIAL_REGEX = /^(?=.*[!@#$%^&*]).*$/;
const PASSWORD_LENGTH_REGEX = /^.{8,32}$/;

export const Register = ({ navigation, isLoggedIn }) => {
  const { t } = useTranslation();

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
      setPasswordError(t("password_error_length"));
      return;
    }
    if (!PASSWORD_LOWERCASE_REGEX.test(password)) {
      setPasswordError(t("password_error_noLowercase"));
      return;
    }
    if (!PASSWORD_UPPERCASE_REGEX.test(password)) {
      setPasswordError(t("password_error_noUppercase"));
      return;
    }
    if (!PASSWORD_NUMBER_REGEX.test(password)) {
      setPasswordError(t("password_error_noDigit"));
      return;
    }
    if (!PASSWORD_SPECIAL_REGEX.test(password)) {
      setPasswordError(t("password_error_noSpecial"));
      return;
    }
    if (password !== passwordRepeat) {
      setPasswordError(t("password_error_repeatMismatch"));
      return;
    }
    setPasswordError("");
  }, [password, passwordRepeat, t]);

  useEffect(() => {
    if (!email) {
      setEmailError(t("email_error_noEmail"));
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setEmailError(t("email_error_invalid"));
      return;
    }
    setEmailError("");
  }, [email, t]);

  useEffect(() => {
    if (isLoggedIn) {
      navigation("/home", { replace: true });
    }
  });

  useEffect(() => {
    if (registerError) {
      setRegisterError(t("auth_register_invalid"));
    }
  }, [t, registerError]);

  const handleRegister = (event) => {
    event.preventDefault();

    if (passwordError || emailError) {
      return;
    }
    if (!name) {
      setRegisterError(t("firstName_error_missing"));
      return;
    }
    if (!surname) {
      setRegisterError(t("familyName_error_missing"));
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

    Axios.post("//localhost:3500/register", registerRequestObject)
      .then((res) => {
        const responseMessage = res.data.message;
        setRegisterError(responseMessage);
        setTimeout(() => {
          navigation("/login", { replace: true });
        }, 2000);
      })
      .catch(() => {
        setRegisterError(t("auth_register_invalid"));
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
        <h2>{`${t("register_welcome")}`}</h2>
        <FormControl>
          <FormLabel style={{ color: "black" }}>{`${t(
            "register_form_reasonQuestion"
          )}`}</FormLabel>
          <RadioGroup name="radio-buttons-group">
            <FormControlLabel
              value="user"
              control={<Radio />}
              label={`${t("register_form_reasonDietitian")}`}
              onChange={(e) => {
                setIsClient(e.target.value === "client");
              }}
              checked={!isClient}
            />
            <FormControlLabel
              value="client"
              control={<Radio />}
              label={`${t("register_form_reasonClient")}`}
              onChange={(e) => {
                setIsClient(e.target.value === "client");
              }}
              checked={isClient}
            />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <TextField
            label={`${t("email")}`}
            type="email"
            placeholder={`${t("email")}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            label={`${t("password")}`}
            type="password"
            placeholder="************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            color={passwordError && showErrors ? "error" : "primary"}
            sx={{ m: "10px" }}
          />
          <TextField
            label={`${t("password_repeat")}`}
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
            label={`${t("first_name")}`}
            type="text"
            placeholder={`${t("first_name")}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ m: "10px" }}
          />
        </FormControl>
        <FormControl>
          <TextField
            label={`${t("family_name")}`}
            type="text"
            placeholder={`${t("family_name")}`}
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            sx={{ m: "10px" }}
          />
        </FormControl>
        {!isClient ? (
          <FormControl>
            <FormLabel style={{ color: "black" }}>{`${t(
              "register_form_tellAboutYou"
            )}`}</FormLabel>
            <TextField
              multiline
              minRows={3}
              label={`${t("about_person")}`}
              type="text"
              placeholder={`${t("about_person")}...`}
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
        {`${t("register")}`}
      </Button>

      <p style={{ display: registerError ? "block" : "none" }}>
        {registerError}
      </p>
      <p>
        {`${t("register_accountAlready")} `}
        <a href="../login">{`${t("register_loginHere")}`}</a>
      </p>
    </div>
  );
};
