import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const UserProfile = ({ profile, token, onLogOut }) => {
  const navigation = useNavigate();

  if (!profile || !token) {
    onLogOut();
  }

  return (
    <>
      <h2>some main profile page idk</h2>
      <Button
        onClick={() =>
          navigation("/myClients", {
            replace: true,
          })
        }
      >
        Client list
      </Button>
    </>
  );
};
