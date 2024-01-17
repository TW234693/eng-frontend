import { useEffect } from "react";
import { ClientProfile } from "../views/ClientProfile";
import { UserProfile } from "../views/UserProfile";

export const Profile = ({ onLogOut, isClient, token, profile }) => {
  useEffect(() => {
    if (!profile || !token || !profile.email) {
      onLogOut();
    }
  }, [token, profile, onLogOut]);

  if (token && !isClient && profile && onLogOut) {
    return <UserProfile profile={profile} token={token} onLogOut={onLogOut} />;
    // return <UserClientList email={email} token={token} />;
  }
  if (token && isClient && profile && onLogOut) {
    return (
      <ClientProfile email={profile.email} token={token} onLogOut={onLogOut} />
    );
  }
};
