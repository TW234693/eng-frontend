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
import { useTranslation } from "react-i18next";

const PASSWORD_LOWERCASE_REGEX = /^(?=.*[a-z]).*$/;
const PASSWORD_UPPERCASE_REGEX = /^(?=.*[A-Z]).*$/;
const PASSWORD_NUMBER_REGEX = /^(?=.*[0-9]).*$/;
const PASSWORD_SPECIAL_REGEX = /^(?=.*[!@#$%^&*]).*$/;
const PASSWORD_LENGTH_REGEX = /^.{8,32}$/;

export const ClientProfileCard = ({ profile, token, fullHeight = true }) => {
  const { t } = useTranslation();

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
  const [showErrors, setShowErrors] = useState(false);

  const [name, setName] = useState(profile.name);
  const [nameError, setNameError] = useState("");

  const [surname, setSurname] = useState(profile.surname);
  const [surnameError, setSurnameError] = useState("");

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
    if (profile) {
      setName(profile.name);
      setSurname(profile.surname);
      setPhoto(profile.photo ? profile.photo : defaultPhoto);
    }
  }, [profile]);

  useEffect(() => {
    if (currentPassword.length <= 0) {
      setCurrentPasswordError(t("password_error_noCurrent"));
      return;
    }
    setCurrentPasswordError("");
  }, [currentPassword, t]);

  useEffect(() => {
    if (!PASSWORD_LENGTH_REGEX.test(newPassword)) {
      setNewPasswordError(t("password_error_length"));
      return;
    }
    if (!PASSWORD_LOWERCASE_REGEX.test(newPassword)) {
      setNewPasswordError(t("password_error_noLowercase"));
      return;
    }
    if (!PASSWORD_UPPERCASE_REGEX.test(newPassword)) {
      setNewPasswordError(t("password_error_noUppercase"));
      return;
    }
    if (!PASSWORD_NUMBER_REGEX.test(newPassword)) {
      setNewPasswordError(t("password_error_noDigit"));
      return;
    }
    if (!PASSWORD_SPECIAL_REGEX.test(newPassword)) {
      setNewPasswordError(t("password_error_noSpecial"));
      return;
    }
    if (newPassword !== newPasswordRepeat) {
      setNewPasswordError(t("password_error_repeatMismatch"));
      return;
    }
    setNewPasswordError("");
  }, [newPassword, newPasswordRepeat, t]);

  useEffect(() => {
    if (!name) {
      setNameError(t("firstName_error_missing"));
      return;
    }
    setNameError("");
  }, [name, t]);

  useEffect(() => {
    if (!surname) {
      setSurnameError(t("familyName_error_missing"));
      return;
    }
    setSurnameError("");
  }, [surname, t]);

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
      photo,
    };

    if (updatingPassword) {
      updateProfileDTO.currentPassword = currentPassword;
      updateProfileDTO.newPassword = newPassword;
    }

    console.log(updateProfileDTO);

    Axios.patch(
      `//localhost:3500/clients/updateClient/email=${profile.email}`,
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
        setResponseMsg(t(responseMessage));

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
        setResponseMsg(t(responseMessage));
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
        padding: "10px 10px 0 10px",
        margin: "10px",
        height: fullHeight ? "100%" : "auto",
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
            borderRadius: "12px",
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
            borderRadius: "6px",
            display: `${isEditable && inEditMode ? "inline" : "none"}`,
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
            borderRadius: "3px",
            display: `${isEditable && inEditMode ? "inline" : "none"}`,
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
              {inEditMode ? t("form_stopEditing") : t("form_startEditing")}
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
                {`${t("form_saveChanges")}`}
              </Button>
            </ListItem>
            <ListItem disablePadding>
              <Button
                onClick={resetData}
                startIcon={<Clear />}
                fullWidth
                color="error"
              >
                {`${t("form_resetChanges")}`}
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
          {inEditMode ? t("profile_form_updateProfileHeading") : null}
        </Divider>
        {(!isEditable || inEditMode) && (
          <ListItem>
            {inEditMode ? (
              <TextField
                label={t("profile_form_pfpURL")}
                type="url"
                value={photo}
                placeholder={t("profile_form_emptyPfp")}
                onChange={(e) => setPhoto(e.target.value)}
                onBlur={(e) =>
                  setPhoto(e.target.value ? e.target.value : defaultPhoto)
                }
                fullWidth
              />
            ) : isEditable ? (
              <ListItemText
                style={{
                  whiteSpace: "pre-wrap",
                  display: `${isEditable ? "auto" : "none"}`,
                }}
                primary={`${t("profile_picture")} :\n${
                  photo ? photo : `(${t("default_image")})`
                }`}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  margin: "4px 0",
                }}
              >
                <span>{`${t("email")}`}: </span>
                <span>{profile.email}</span>
              </div>
            )}
          </ListItem>
        )}
        {(!isEditable || inEditMode) && (
          <Divider sx={{ display: inEditMode ? "none" : "auto" }} />
        )}
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
              <span>{`${t("first_name")}`}:</span>
              <span>{name}</span>
            </div>
          ) : (
            <TextField
              label={t("first_name")}
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
              <span>{`${t("family_name")}`}:</span>
              <span>{surname}</span>
            </div>
          ) : (
            <TextField
              label={t("family_name")}
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
        {inEditMode && (
          <ListItem>
            <Button
              startIcon={!updatingPassword ? <Edit /> : <EditOff />}
              onClick={() => setUpdatingPassword(!updatingPassword)}
              fullWidth
            >
              {updatingPassword
                ? t("profile_form_doNotChangePassword")
                : t("profile_form_changePassword")}
            </Button>
          </ListItem>
        )}

        <Divider
          textAlign="center"
          sx={{ display: updatingPassword && inEditMode ? "auto" : "none" }}
        >
          {`${t("profile_form_updatePasswordHeading")}`}
        </Divider>
        {!updatingPassword || !inEditMode ? null : (
          <ListItem>
            <TextField
              label={t("profile_form_currentPassword")}
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
              label={t("profile_form_newPasswordRepeat")}
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
