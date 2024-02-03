import { useState, useEffect } from "react";
import Axios from "axios";
import { TextField, FormControl, Button, Alert } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const EMAIL_REGEX =
  /^(?:(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*)|.(?:".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const AssignNewClient = ({ navigation, checkLoggedInState }) => {
  const userEmail = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const [showErrors, setShowErrors] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [assigningResponse, setAssigningResponse] = useState("");
  const [emailError, setEmailError] = useState("");
  const [assignmentCompleted, setAssignmentCompleted] = useState(false);

  useEffect(() => {
    if (!clientEmail) {
      setEmailError("Please provide an email.");
      return;
    }
    if (!EMAIL_REGEX.test(clientEmail)) {
      setEmailError("Please provide a valid email address.");
      return;
    }
    setEmailError("");
  }, [clientEmail]);

  const handleAssign = (event) => {
    event.preventDefault();

    if (emailError) {
      return;
    }

    if (!userEmail || !token) {
      checkLoggedInState();
    }

    const assignClientRequestObject = {
      userEmail: userEmail,
      clientEmail: clientEmail,
    };

    // console.log(assignClientRequestObject);

    Axios.patch("//localhost:3500/users/assign", assignClientRequestObject, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const responseMessage = res.data.message;
        setAssignmentCompleted(true);
        setAssigningResponse(responseMessage);
        navigation("/myClients", { replace: true });
      })
      .catch((error) => {
        const responseMessage = error.response.data.message;
        setAssignmentCompleted(false);
        setAssigningResponse(responseMessage);
      });
  };

  const goBack = () => {
    navigation("/myClients", { replace: true });
  };

  if (!token || !userEmail) {
    checkLoggedInState();
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Button
          onClick={goBack}
          variant={"contained"}
          startIcon={<ArrowBack />}
        >
          Go back
        </Button>
      </div>
      <FormControl
        style={{
          minWidth: "30%",
          maxWidth: "30%",
          marginBottom: "10px",
        }}
      >
        <h2>Please, enter the email of the client you would like to add</h2>
        <FormControl>
          {!emailError && showErrors && assigningResponse ? (
            <Alert
              severity={assignmentCompleted ? "success" : "error"}
              variant="filled"
            >
              {assigningResponse}
            </Alert>
          ) : null}
          <TextField
            label={"Client's Email"}
            type="email"
            placeholder="clientemail@address.com"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            color={emailError && showErrors ? "error" : "primary"}
            sx={{ m: "10px 0 10px 0" }}
          />
          {emailError && showErrors ? (
            <Alert severity="error" variant="filled">
              {emailError}
            </Alert>
          ) : null}
        </FormControl>
      </FormControl>
      <Button
        variant="contained"
        onClick={(e) => {
          handleAssign(e);
          setShowErrors(true);
        }}
      >
        Assign
      </Button>
    </div>
  );
};
