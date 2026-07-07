import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { themes } from "../utils/Theme";

const ThemeContext = createContext();


export default function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    localStorage.setItem(
      "theme",
      dark ? "dark" : "light"
    );
  }, [dark]);

  return (
    <ThemeContext.Provider
      value={{
        dark,
        setDark,
        theme: dark ? themes.dark : themes.light,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);