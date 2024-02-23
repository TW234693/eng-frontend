import { useState } from "react";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Button, Divider, Menu, MenuItem } from "@mui/material";

export const GuestHeader = ({ navigation }) => {
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
          <MenuItem onClick={goToRegister}>Register</MenuItem>
          <MenuItem onClick={goToLogIn}>Login</MenuItem>
          <Divider />
          <MenuItem onClick={() => navigation("/community", { replace: true })}>
            Community
          </MenuItem>
        </Menu>
      </div>
      <div
        style={{
          width: "200px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "5px",
        }}
      >
        <Button onClick={goToLogIn} color={"success"} variant="contained">
          Log In
        </Button>
        <Button onClick={goToRegister} color={"success"} variant="contained">
          Register
        </Button>
      </div>
    </div>
  );
};
