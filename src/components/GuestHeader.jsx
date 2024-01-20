import { Button } from "@mui/material";
import { Menu } from "@mui/icons-material";

export const GuestHeader = ({ navigation }) => {
  const goToLogIn = () => {
    navigation("/login", { replace: true });
  };

  const goToRegister = () => {
    navigation("/register", { replace: true });
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
        <Button>
          <Menu />
        </Button>
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
