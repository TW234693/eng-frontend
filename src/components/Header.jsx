import { LoggedInHeader } from "./LoggedInHeader";
import { GuestHeader } from "./GuestHeader";

export const Header = ({ onLogOut, profile, navigation }) => {
  return profile ? (
    <LoggedInHeader
      onLogOut={onLogOut}
      profile={profile}
      navigation={navigation}
    ></LoggedInHeader>
  ) : (
    <GuestHeader navigation={navigation}></GuestHeader>
  );
};
