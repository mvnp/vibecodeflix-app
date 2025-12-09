import { Session } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth";
import { supabase } from "../services/supabase";
import { Profile } from "../types";

interface AuthContextProps {
    session: Session | null;
    user: Session["user"] | null;
    profile: Profile | null;
    isLoading: boolean;
    isAdmin: boolean;
    isCompanyAdmin: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
    session: null,
    user: null,
    profile: null,
    isLoading: true,
    isAdmin: false,
    isCompanyAdmin: false,
    signOut: async () => { },
    refreshProfile: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session?.user) {
                authService.getProfile(session.user.id).then((p) => {
                    setProfile(p);
                    setIsLoading(false);
                });
            } else {
                setIsLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session?.user) {
                if (!profile || profile.id !== session.user.id) {
                    const p = await authService.getProfile(session.user.id);
                    setProfile(p);
                }
            } else {
                setProfile(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const refreshProfile = async () => {
        if (session?.user) {
            const p = await authService.getProfile(session.user.id);
            setProfile(p);
        }
    };

    const signOut = async () => {
        await authService.logout();
        setSession(null);
        setProfile(null);
    };

    const isAdmin = profile?.role === 'super_admin';
    const isCompanyAdmin = profile?.role === 'company_admin';

    return (
        <AuthContext.Provider
            value={{
                session,
                user: session?.user ?? null,
                profile,
                isLoading,
                isAdmin,
                isCompanyAdmin,
                signOut,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
