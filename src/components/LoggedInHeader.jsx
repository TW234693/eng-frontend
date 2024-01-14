import { Button, Menu, MenuItem } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";

export const LoggedInHeader = ({ onLogOut, profile, navigation }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const isOpened = Boolean(menuAnchor);

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
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem>
        </Menu>
        <img
          src={
            profile.photo && new URL(profile.photo)
              ? profile.photo
              : "https://www.w3schools.com/howto/img_avatar.png"
          }
          style={{
            minHeight: "50px",
            maxHeight: "50px",
            objectFit: "contain",
            margin: "10px",
            borderRadius: "50%",
          }}
          alt="Profile"
        ></img>
        <span>
          {profile.name} {profile.surname}
        </span>
      </div>
      <div>
        <Button onClick={onLogOut} color={"error"} variant="contained">
          Log Out
        </Button>
      </div>
    </div>
  );
};
