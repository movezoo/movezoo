import { useLocation } from "react-router-dom";

const Redirect = () => {
  const location = useLocation();
  const { url } = location.state || { url: "" };
  if (url) window.location.href = url;

  return null;
};

export default Redirect;