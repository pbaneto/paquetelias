import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SignUp } from "./components/SignUp";
import { SignIn } from "./components/SignIn";
import { AuthCallback } from "./components/AuthCallback";
import { Profile } from "./components/Profile";
import { auth } from "./lib/auth";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await auth.getCurrentUser();
        setIsAuthenticated(!!user);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/auth/v1/callback" element={<AuthCallback />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? "/profile" : "/signin"}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
