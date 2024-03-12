import { useState } from "react";
import { Language, Menu as MenuIcon } from "@mui/icons-material";
import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";

import { useTranslation } from "react-i18next";

export const GuestHeader = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);
  const isLanguageMenuOpened = Boolean(languageMenuAnchor);

  const goToLogIn = () => {
    navigation("/login", { replace: true });
  };

  const goToRegister = () => {
    navigation("/register", { replace: true });
  };

  const [menuAnchor, setMenuAnchor] = useState(null);
  const isOpened = Boolean(menuAnchor);

  const handleMenuButtonClick = (e) => {
    setMenuAnchor(e.currentTarget);
  };
  const handleClose = () => {
    setMenuAnchor(null);
  };

  const handleLangMenuButtonClick = (e) => {
    setLanguageMenuAnchor(e.currentTarget);
  };
  const handleCloseLangMenu = () => {
    setLanguageMenuAnchor(null);
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(59deg, rgba(140,193,255,1) 0%, rgba(73,74,255,1) 100%)",
        maxHeight: "50px",
        minHeight: "50px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "5px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Button
          onClick={(e) => handleMenuButtonClick(e)}
          aria-controls={isOpened ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={isOpened ? "true" : undefined}
        >
          <MenuIcon />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={menuAnchor}
          open={isOpened}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={goToRegister} sx={{ justifyContent: "center" }}>
            {`${t("register")}`}
          </MenuItem>
          <MenuItem onClick={goToLogIn} sx={{ justifyContent: "center" }}>
            {`${t("login")}`}
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => navigation("/community", { replace: true })}
            sx={{ justifyContent: "center" }}
          >
            {`${t("home_community")}`}
          </MenuItem>
        </Menu>
      </div>
      <div
        style={{
          maxWidthwidth: "50%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "5px",
          gap: "10px",
        }}
      >
        <Button
          onClick={(e) => handleLangMenuButtonClick(e)}
          aria-controls={isLanguageMenuOpened ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={isLanguageMenuOpened ? "true" : undefined}
          style={{ color: "white" }}
        >
          <Language />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={languageMenuAnchor}
          open={isLanguageMenuOpened}
          onClose={handleCloseLangMenu}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          disableScrollLock={true}
        >
          <MenuItem
            disabled={i18n.resolvedLanguage === "en"}
            onClick={() => {
              i18n.changeLanguage("en");
              localStorage.setItem("i18n", "en");
              handleCloseLangMenu();
            }}
            sx={{ justifyContent: "center" }}
          >
            <ListItemIcon style={{ color: "unset" }}>🇬🇧</ListItemIcon>
            <ListItemText>English</ListItemText>
          </MenuItem>
          <MenuItem
            disabled={i18n.resolvedLanguage === "pl"}
            onClick={() => {
              i18n.changeLanguage("pl");
              localStorage.setItem("i18n", "pl");
              handleCloseLangMenu();
            }}
            sx={{ justifyContent: "center" }}
          >
            <ListItemIcon style={{ color: "unset" }}>🇵🇱</ListItemIcon>
            <ListItemText>Polski</ListItemText>
          </MenuItem>
        </Menu>
        <Button onClick={goToLogIn} color={"success"} variant="contained">
          {`${t("login")}`}
        </Button>
        <Button onClick={goToRegister} color={"success"} variant="contained">
          {`${t("register")}`}
        </Button>
      </div>
    </div>
  );
};
