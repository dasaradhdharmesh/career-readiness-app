import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  // TEMP DEBUG (REMOVE LATER)
  console.log("TOKEN:", token);

  if (!token) {
    return (
      <Login
        onLogin={(t) => {
          localStorage.setItem("token", t);
          setToken(t);
        }}
      />
    );
  }

  return (
    <Dashboard
      onLogout={() => {
        localStorage.removeItem("token");
        setToken(null);
      }}
    />
  );
}
