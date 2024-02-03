import { Button, Divider, Menu, MenuItem } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";

export const LoggedInHeader = ({ onLogOut, profile, navigation, isClient }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const isOpened = Boolean(menuAnchor);

  const goBack = () => {
    navigation("/myProfile", { replace: true });
  };

  const handleMenuButtonClick = (e) => {
    setMenuAnchor(e.currentTarget);
  };
  const handleClose = () => {
    setMenuAnchor(null);
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
          <MenuItem onClick={() => navigation("/home", { replace: true })}>
            Home
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => navigation("/myProfile", { replace: true })}>
            My Profile
          </MenuItem>
          {!isClient && (
            <MenuItem
              onClick={() => navigation("/myClients", { replace: true })}
            >
              Clients
            </MenuItem>
          )}
          {!isClient && (
            <MenuItem
              onClick={() => navigation("/myIngredients", { replace: true })}
            >
              Ingredients
            </MenuItem>
          )}
        </Menu>
        <div
          onClick={goBack}
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
              borderRadius: "50%",
            }}
            alt="Profile"
          ></img>
          <span>
            {profile.name} {profile.surname}
          </span>
        </div>
      </div>
      <div>
        <Button onClick={onLogOut} color={"error"} variant="contained">
          Log Out
        </Button>
      </div>
    </div>
  );
};
