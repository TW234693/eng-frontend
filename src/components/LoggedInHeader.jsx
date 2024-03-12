import {
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { Language, Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const LoggedInHeader = ({ onLogOut, profile, navigation, isClient }) => {
  const { t, i18n } = useTranslation();

  const [navigationMenuAnchor, setNavigationMenuAnchor] = useState(null);
  const isNavigationMenuOpened = Boolean(navigationMenuAnchor);

  const [languageMenuAnchor, setLanguageMenuAnchor] = useState(null);
  const isLanguageMenuOpened = Boolean(languageMenuAnchor);

  const goToProfile = () => {
    navigation("/myProfile", { replace: true });
  };

  const handleNavMenuButtonClick = (e) => {
    setNavigationMenuAnchor(e.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setNavigationMenuAnchor(null);
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
        backgroundColor: "rgb(66,185,245)",
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
          onClick={(e) => handleNavMenuButtonClick(e)}
          aria-controls={isNavigationMenuOpened ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={isNavigationMenuOpened ? "true" : undefined}
          style={{ color: "white" }}
        >
          <MenuIcon />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={navigationMenuAnchor}
          open={isNavigationMenuOpened}
          onClose={handleCloseNavMenu}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          disableScrollLock={true}
        >
          <MenuItem
            onClick={() => {
              navigation("/home", { replace: true });
              handleCloseNavMenu();
            }}
            sx={{ justifyContent: "center" }}
          >
            {`${t("home")}`}
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              navigation("/myProfile", { replace: true });
              handleCloseNavMenu();
            }}
            sx={{ justifyContent: "center" }}
          >
            {`${t("home_profile")}`}
          </MenuItem>
          <MenuItem
            onClick={() => {
              navigation("/community", { replace: true });
              handleCloseNavMenu();
            }}
            sx={{ justifyContent: "center" }}
          >
            {`${t("home_community")}`}
          </MenuItem>
          {!isClient && (
            <MenuItem
              onClick={() => {
                navigation("/myClients", { replace: true });
                handleCloseNavMenu();
              }}
              sx={{ justifyContent: "center" }}
            >
              {`${t("home_clients")}`}
            </MenuItem>
          )}
          {!isClient && (
            <MenuItem
              onClick={() => {
                navigation("/myIngredients", { replace: true });
                handleCloseNavMenu();
              }}
              sx={{ justifyContent: "center" }}
            >
              {`${t("home_ingredients")}`}
            </MenuItem>
          )}
          {!isClient && (
            <MenuItem
              onClick={() => {
                navigation("/myMealTemplates", { replace: true });
                handleCloseNavMenu();
              }}
              sx={{ justifyContent: "center" }}
            >
              {`${t("home_templates")}`}
            </MenuItem>
          )}
          {isClient && (
            <MenuItem
              onClick={() => {
                navigation("/myMeals", { replace: true });
                handleCloseNavMenu();
              }}
              sx={{ justifyContent: "center" }}
            >
              {`${t("home_myMeals")}`}
            </MenuItem>
          )}
        </Menu>
        <div
          onClick={goToProfile}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={
              profile.photo && new URL(profile.photo)
                ? profile.photo
                : "https://www.w3schools.com/howto/img_avatar.png"
            }
            style={{
              maxHeight: "50px",
              minHeight: "50px",
              minWidth: "50px",
              maxWidth: "50px",
              margin: "10px",
              objectFit: "fill",
              borderRadius: "3px",
            }}
            alt="Profile"
          ></img>
          <span>
            {profile.name} {profile.surname}
          </span>
        </div>
      </div>
      <div>
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
        <Button onClick={onLogOut} color={"error"} variant="contained">
          {`${t("logout")}`}
        </Button>
      </div>
    </div>
  );
};
