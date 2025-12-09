import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { AppState, Platform } from "react-native";
import "react-native-url-polyfill/auto";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

const isWeb = Platform.OS === 'web';
// Check if running in a browser environment (client-side)
const isBrowser = isWeb && typeof window !== 'undefined';
// Check if running in a native environment
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

// Custom storage adapter to prevent SSR crashes on web
const ExpoStorage = {
    getItem: (key: string) => {
        if (isNative || isBrowser) {
            return AsyncStorage.getItem(key);
        }
        return Promise.resolve(null);
    },
    setItem: (key: string, value: string) => {
        if (isNative || isBrowser) {
            return AsyncStorage.setItem(key, value);
        }
        return Promise.resolve();
    },
    removeItem: (key: string) => {
        if (isNative || isBrowser) {
            return AsyncStorage.removeItem(key);
        }
        return Promise.resolve();
    },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground.
AppState.addEventListener("change", (state) => {
    if (state === "active") {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});

