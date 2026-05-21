import { useState, useEffect } from "react";

const FORGE_TOKEN_KEY = "forge-auth-token";
const FORGE_EXPIRY_KEY = "forge-auth-expiry";

export function useForgeAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(FORGE_TOKEN_KEY);
    const storedExpiry = localStorage.getItem(FORGE_EXPIRY_KEY);

    if (storedToken && storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      if (expiryTime > Date.now()) {
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(FORGE_TOKEN_KEY);
        localStorage.removeItem(FORGE_EXPIRY_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, expiresAt: number) => {
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem(FORGE_TOKEN_KEY, newToken);
    localStorage.setItem(FORGE_EXPIRY_KEY, expiresAt.toString());
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem(FORGE_TOKEN_KEY);
    localStorage.removeItem(FORGE_EXPIRY_KEY);
  };

  return {
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
