import { useLocation } from "react-router-dom";

function WelcomePage() {
  const location = useLocation();
  const username = location.state?.username || "User";

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome, {username}</h1>
    </div>
  );
}

export default WelcomePage;
