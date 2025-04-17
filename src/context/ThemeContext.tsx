import React, { createContext, useState, useContext } from "react";
import Toast, { BaseToast } from "react-native-toast-message";

type ThemeContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
    bernardMode: boolean;
    toggleBernardMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [bernardMode, setBernardMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newVal = !prev;
            if (newVal) {
                setBernardMode(false); // auto-disable Bernard

                Toast.show({
                    type: "dark",
                    text1: "Dark Mode Engaged 🌒",
                    text2: "Visual systems optimized. 😎"
                });
            }
            return newVal;
        });
    };

    const toggleBernardMode = () => {
        setBernardMode((prev) => {
            const newVal = !prev;
            if (newVal) {
                setDarkMode(false); // auto-disable Dark Mode

                Toast.show({
                    type: "bernard",
                    text1: "Bernard Mode Activated 🐸",
                    text2: "Darkness has been banished to the swamp."
                });
            }
            return newVal;
        });
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode, bernardMode, toggleBernardMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeSettings = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useThemeSettings must be used within ThemeProvider");
    return context;
};
