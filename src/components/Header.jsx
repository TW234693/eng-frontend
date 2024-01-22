import { LoggedInHeader } from "./LoggedInHeader";
import { GuestHeader } from "./GuestHeader";

export const Header = ({ onLogOut, profile, navigation, isClient }) => {
  return profile ? (
    <LoggedInHeader
      onLogOut={onLogOut}
      profile={profile}
      navigation={navigation}
      isClient={isClient}
    ></LoggedInHeader>
  ) : (
    <GuestHeader navigation={navigation}></GuestHeader>
  );
};
