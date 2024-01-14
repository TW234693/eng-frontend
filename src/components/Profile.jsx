import { useNavigate } from "react-router-dom";
import { UserClientList } from "../views/UserClientList";
import { ClientProfile } from "../views/ClientProfile";
import { useEffect } from "react";

export const Profile = ({ onLogIn }) => {
  const navigation = useNavigate();

  const roles = localStorage.getItem("roles");
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (
      !roles ||
      !token ||
      !email ||
      !(roles.includes("user") || roles.includes("client"))
    ) {
      localStorage.removeItem("roles");
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      navigation("/notLoggedIn", { replace: true });
    }
  }, [roles, token, email, navigation]);

  if (roles && email && token && roles.includes("user")) {
    return <UserClientList email={email} token={token} onLogIn={onLogIn} />;
  }
  if (roles && email && token && roles.includes("client")) {
    return <ClientProfile email={email} token={token} onLogIn={onLogIn} />;
  }
};
