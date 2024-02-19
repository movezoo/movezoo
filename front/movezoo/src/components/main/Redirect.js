import { useLocation } from "react-router-dom";
import { disablePageLeaveWarning } from "./pageLeaveWarning";


const Redirect = () => {
  disablePageLeaveWarning();
  const location = useLocation();
  const { url } = location.state || { url: "" };
  if (url) window.location.href = url;

  return null;
};

export default Redirect;