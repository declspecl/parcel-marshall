import React, { createContext, useState, useContext, useEffect } from "react";
import Toast, { BaseToast } from "react-native-toast-message";
import { PersistantStoreService } from "@/store/PersistantStoreService";

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
    const storeService = new PersistantStoreService();

    useEffect(() => {
        const loadTheme = async () => {
            const theme = await storeService.getThemeAsync();
            if (theme) {
                setDarkMode(theme.darkMode);
                setBernardMode(theme.bernardMode);
            }
        };
        loadTheme();
    }, []);

    useEffect(() => {
        storeService.setTheme({ darkMode, bernardMode });
    }, [darkMode, bernardMode]);

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newVal = !prev;
            if (newVal) {
                setBernardMode(false);
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
                setDarkMode(false);
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
