"use client";

import { createContext, useContext, useState, useEffect } from 'react';
// const USER_PROFILE_API = 'http://localhost:8080/users/'; 
const USER_PROFILE_API = 'http://137.131.224.125:8080/users/'; 

const AuthProfileContext = createContext(null);

export function useAuth() {
    const context = useContext(AuthProfileContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProfileProvider');
    }
    return context;
}

export function AuthProfileProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [userProfile, setUserProfile] = useState(null); 

    const updateProfile = (newProfileData) => {
        setUserProfile(newProfileData);
    };

    const fetchProfile = async (id, token) => {
        if (!id || !token) return;

        try {
            const response = await fetch(`${USER_PROFILE_API}${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const profile = await response.json();
                setUserProfile(profile);
            } else {
                console.error("Falha ao buscar perfil:", response.status);
                setUserProfile(null);
            }
        } catch (error) {
            console.error("Erro na requisição do perfil:", error);
            setUserProfile(null);
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('id');
            
            if (token && userId) {
                setIsAuthenticated(true);
                fetchProfile(userId, token); 
            } else {
                setIsAuthenticated(false);
                setUserProfile(null);
            }
            setIsLoading(false);
        }
    }, []);

    const contextValue = {
        isAuthenticated,
        isLoading,
        userProfile,
        updateProfile, 
    };

    return (
        <AuthProfileContext.Provider value={contextValue}>
            {children}
        </AuthProfileContext.Provider>
    );
}