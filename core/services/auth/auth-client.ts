import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const API_URL = Platform.OS === "android" ? process.env.EXPO_PUBLIC_API_ANDROID : process.env.EXPO_PUBLIC_API_IOS

console.log(API_URL);


export const authClient = createAuthClient({
    baseURL: `${API_URL}/auth`, // Base URL of your Better Auth backend.
    storage: SecureStore,
    scheme: "terminalbus",
    disableCache: true,
    plugins: [
        expoClient({
            scheme: "terminalbus",
            storagePrefix: "terminalbus",
            storage: SecureStore,
        })
    ],
});