import {
  Card,
  CardMedia,
  List,
  Button,
  Divider,
  ListItem,
  Alert,
  TextField,
  ListItemText,
  Typography,
  IconButton,
  InputAdornment,
  Snackbar,
} from "@mui/material";
import Axios from "axios";
import { useEffect, useState } from "react";
import {
  Clear,
  Save,
  Edit,
  EditOff,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const PASSWORD_LOWERCASE_REGEX = /^(?=.*[a-z]).*$/;
const PASSWORD_UPPERCASE_REGEX = /^(?=.*[A-Z]).*$/;
const PASSWORD_NUMBER_REGEX = /^(?=.*[0-9]).*$/;
const PASSWORD_SPECIAL_REGEX = /^(?=.*[!@#$%^&*]).*$/;
const PASSWORD_LENGTH_REGEX = /^.{8,32}$/;

export const UserProfileCard = ({ profile, token }) => {
  const isEditable = !!token;
  const defaultPhoto = "https://www.w3schools.com/howto/img_avatar.png";
  const [responseMsg, setResponseMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const [inEditMode, setInEditMode] = useState(false);
  const [expandDescription, setExpandDescription] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const [name, setName] = useState(profile.name);
  const [nameError, setNameError] = useState("");

  const [surname, setSurname] = useState(profile.surname);
  const [surnameError, setSurnameError] = useState("");

  const [description, setDescription] = useState(profile.description);
  const [photo, setPhoto] = useState(
    profile.photo ? profile.photo : defaultPhoto
  );

  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeat, setNewPasswordRepeat] = useState("");
  const [obscurePassword, setObscurePassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");

  useEffect(() => {
    if (currentPassword.length <= 0) {
      setCurrentPasswordError("You must provide your current password.");
      return;
    }
    setCurrentPasswordError("");
  }, [currentPassword]);

  useEffect(() => {
    if (!PASSWORD_LENGTH_REGEX.test(newPassword)) {
      setNewPasswordError(
        "The new password must be between 8 and 32 characters long."
      );
      return;
    }
    if (!PASSWORD_LOWERCASE_REGEX.test(newPassword)) {
      setNewPasswordError(
        "The new password must contain at least one lower-case letter."
      );
      return;
    }
    if (!PASSWORD_UPPERCASE_REGEX.test(newPassword)) {
      setNewPasswordError(
        "The new password must contain at least one upper case letter."
      );
      return;
    }
    if (!PASSWORD_NUMBER_REGEX.test(newPassword)) {
      setNewPasswordError("The new password must contain at least one number.");
      return;
    }
    if (!PASSWORD_SPECIAL_REGEX.test(newPassword)) {
      setNewPasswordError(
        "The new password must contain at least one of the following characters: ! @ # $ % ^ & *"
      );
      return;
    }
    if (newPassword !== newPasswordRepeat) {
      setNewPasswordError("Provided new passwords do not match.");
      return;
    }
    setNewPasswordError("");
  }, [newPassword, newPasswordRepeat]);

  useEffect(() => {
    if (!name) {
      setNameError("The first name cannot be empty.");
      return;
    }
    setNameError("");
  }, [name]);

  useEffect(() => {
    if (!surname) {
      setSurnameError("The surname cannot be empty.");
      return;
    }
    setSurnameError("");
  }, [surname]);

  const toggleEditMode = () => {
    if (!isEditable) {
      return;
    }
    setInEditMode(!inEditMode);
  };

  const resetData = () => {
    if (!isEditable) {
      return;
    }
    setName(profile.name);
    setSurname(profile.surname);
    setDescription(profile.description);
    setPhoto(profile.photo ? profile.photo : defaultPhoto);
    setNewPassword("");
    setNewPasswordRepeat("");
    setCurrentPassword("");
  };

  const onSaveChanges = () => {
    setShowErrors(true);

    if (
      !isEditable ||
      (newPasswordError !== "" && updatingPassword) ||
      (currentPasswordError !== "" && updatingPassword) ||
      nameError !== "" ||
      surnameError !== ""
    ) {
      return;
    }

    const updateProfileDTO = {
      name,
      surname,
      description,
      photo,
    };

    if (updatingPassword) {
      updateProfileDTO.currentPassword = currentPassword;
      updateProfileDTO.newPassword = newPassword;
    }

    console.log(updateProfileDTO);

    Axios.patch(
      `//localhost:3500/users/updateUser/email=${profile.email}`,
      updateProfileDTO,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        console.log(res);
        const responseMessage = res.data.message;
        console.log(responseMessage);
        console.log(res.data.user);

        setUpdatingPassword(false);
        setInEditMode(false);
        setIsSuccess(true);
        setResponseMsg(responseMessage);

        setOpenSnackbar(true);
      })
      .catch((err) => {
        console.log(err);
        setUpdatingPassword(false);
        setInEditMode(false);
        resetData();
        setOpenSnackbar(true);

        const responseMessage = err.response.data.message;
        setIsSuccess(false);
        setResponseMsg(responseMessage);
      });
  };

  if (!profile) {
    return null;
  }

  return (
    <Card
      raised
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        padding: "10px",
      }}
    >
      <Snackbar open={openSnackbar && isEditable} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={isSuccess ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {responseMsg}
        </Alert>
      </Snackbar>
      <div>
        <CardMedia
          component="img"
          image={photo ? photo : defaultPhoto}
          sx={{
            maxHeight: "200px",
            minHeight: "200px",
            minWidth: "200px",
            maxWidth: "200px",
            objectFit: "fill",
            display: "inline",
            margin: "0 10px",
          }}
        />
        <CardMedia
          component="img"
          image={photo ? photo : defaultPhoto}
          sx={{
            objectFit: "fill",
            maxHeight: "100px",
            minHeight: "100px",
            minWidth: "100px",
            maxWidth: "100px",
            margin: "0 10px",
            display: `${isEditable ? "inline" : "none"}`,
          }}
        />
        <CardMedia
          component="img"
          image={photo ? photo : defaultPhoto}
          sx={{
            objectFit: "fill",
            maxHeight: "50px",
            minHeight: "50px",
            minWidth: "50px",
            maxWidth: "50px",
            margin: "0 10px",
            display: `${isEditable ? "inline" : "none"}`,
          }}
        />
      </div>
      <List style={{ width: "80%" }}>
        {isEditable && (
          <ListItem disablePadding>
            <Button
              onClick={toggleEditMode}
              startIcon={!inEditMode ? <Edit /> : <EditOff />}
              fullWidth
              color="info"
            >
              {inEditMode ? "Stop Editing" : "Start editing"}
            </Button>
          </ListItem>
        )}
        {inEditMode && (
          <>
            <ListItem disablePadding>
              <Button
                onClick={onSaveChanges}
                startIcon={<Save />}
                fullWidth
                color="success"
              >
                Save Changes
              </Button>
            </ListItem>
            <ListItem disablePadding>
              <Button
                onClick={resetData}
                startIcon={<Clear />}
                fullWidth
                color="error"
              >
                Reset changes
              </Button>
            </ListItem>
          </>
        )}
        <Divider
          textAlign="center"
          style={{
            marginTop: "10px",
            display: `${isEditable ? "auto" : "none"}`,
          }}
        >
          {inEditMode ? "Update your profile" : null}
        </Divider>
        <ListItem>
          {inEditMode ? (
            <TextField
              label={"Profile picture URL"}
              type="url"
              value={photo}
              placeholder="If left empty, the above default image will be used."
              onChange={(e) => setPhoto(e.target.value)}
              onBlur={(e) =>
                setPhoto(e.target.value ? e.target.value : defaultPhoto)
              }
              fullWidth
            />
          ) : (
            <ListItemText
              style={{
                whiteSpace: "pre-wrap",
                display: `${isEditable ? "auto" : "none"}`,
              }}
              primary={`Profile picture :\n${
                photo ? photo : "(Default image)"
              }`}
            />
          )}
        </ListItem>
        <Divider sx={{ display: inEditMode ? "none" : "auto" }} />
        <ListItem>
          {!inEditMode ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                margin: "4px 0",
              }}
            >
              <span>First name:</span>
              <span>{name}</span>
            </div>
          ) : (
            // <ListItemText primary={`First name: ${name}`} />
            <TextField
              label={"First name"}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError.length > 0 && showErrors}
              fullWidth
            />
          )}
        </ListItem>
        {nameError && showErrors && inEditMode ? (
          <ListItem>
            <Alert severity="error" variant="filled">
              {nameError}
            </Alert>
          </ListItem>
        ) : null}
        <Divider sx={{ display: inEditMode ? "none" : "auto" }} />
        <ListItem>
          {!inEditMode ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                margin: "4px 0",
              }}
            >
              <span>Surname:</span>
              <span>{surname}</span>
            </div>
          ) : (
            <TextField
              label={"Surname"}
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              error={surnameError.length > 0 && showErrors}
              fullWidth
            />
          )}
        </ListItem>
        {surnameError && showErrors && inEditMode ? (
          <ListItem>
            <Alert severity="error" variant="filled">
              {surnameError}
            </Alert>
          </ListItem>
        ) : null}
        <Divider sx={{ display: inEditMode ? "none" : "auto" }} />
        <ListItem onClick={() => setExpandDescription(!expandDescription)}>
          {inEditMode ? (
            <TextField
              multiline
              fullWidth
              minRows={3}
              maxRows={Infinity}
              label={"About yourself"}
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          ) : (
            <Typography
              sx={{
                overflow: "hidden",
                cursor: "pointer",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: `${expandDescription ? "3" : "Infinity"}`,
                WebkitBoxOrient: "vertical",
              }}
            >
              About:<br></br>
              {description}
            </Typography>
          )}
        </ListItem>

        {inEditMode && (
          <ListItem>
            <Button
              startIcon={!updatingPassword ? <Edit /> : <EditOff />}
              onClick={() => setUpdatingPassword(!updatingPassword)}
              fullWidth
            >
              {updatingPassword ? "Do not change password" : "Change password"}
            </Button>
          </ListItem>
        )}

        <Divider
          textAlign="center"
          sx={{ display: updatingPassword && inEditMode ? "auto" : "none" }}
        >
          Update your password
        </Divider>
        {!updatingPassword || !inEditMode ? null : (
          <ListItem>
            <TextField
              label={"Current password"}
              type={obscurePassword ? "password" : "text"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
              error={currentPasswordError.length > 0 && showErrors}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setObscurePassword(!obscurePassword)}
                      onMouseDown={() => setObscurePassword(!obscurePassword)}
                      edge="end"
                    >
                      {obscurePassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
        )}
        {currentPasswordError &&
        showErrors &&
        updatingPassword &&
        inEditMode ? (
          <Alert
            severity="error"
            variant="filled"
            sx={{ display: inEditMode ? "auto" : "none" }}
          >
            {currentPasswordError}
          </Alert>
        ) : null}
        {!updatingPassword || !inEditMode ? null : (
          <ListItem>
            <TextField
              label={"New password"}
              type={obscurePassword ? "password" : "text"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={newPasswordError.length > 0 && showErrors}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setObscurePassword(!obscurePassword)}
                      onMouseDown={() => setObscurePassword(!obscurePassword)}
                      edge="end"
                    >
                      {obscurePassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
        )}

        {!updatingPassword || !inEditMode ? null : (
          <ListItem>
            <TextField
              label={"Repeat new password"}
              type={obscurePassword ? "password" : "text"}
              value={newPasswordRepeat}
              onChange={(e) => setNewPasswordRepeat(e.target.value)}
              error={newPasswordError.length > 0 && showErrors}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setObscurePassword(!obscurePassword)}
                      onMouseDown={() => setObscurePassword(!obscurePassword)}
                      edge="end"
                    >
                      {obscurePassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
        )}

        {newPasswordError && showErrors && updatingPassword && inEditMode ? (
          <Alert
            severity="error"
            variant="filled"
            sx={{ display: inEditMode ? "auto" : "none" }}
          >
            {newPasswordError}
          </Alert>
        ) : null}
      </List>
    </Card>
  );
};
