import React, { useEffect } from "react";
import { Redirect } from "src/components/Redirect";

export const LoginSuccess = () => {
  useEffect(() => {
    sessionStorage.setItem("loggedIn", "true");
  }, []);
  return <Redirect to={"/playlists"} />;
};
