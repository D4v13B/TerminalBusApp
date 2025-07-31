import { authClient } from '@/core/services/auth/auth-client';
import SecureStorage from '@/infrastructure/store/SecureStore';
import { User } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  accessToken?: string;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  cedula: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState('');

  // async function fetchUserInfo(token: string) {
  //   const response = await fetch(
  //     'https://www.googleapis.com/oauth2/v2/userinfo',
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );

  //   const data = await response.json();

  //   console.log('Hola', data);

  //   setUser(data);
  // }

  // async function googleLogin() {
  //   const respuesta = (await authClient.signIn.social({
  //     provider: 'google',
  //     callbackURL: 'myapp://Home',
  //   })) as { url: string; redirect: boolean };

  //   // Forzar redirección manualmente:
  //   if (respuesta.url) {
  //     // En React Native, puedes usar Linking:
  //     console.log(respuesta.url);

  //     // Linking.openURL(respuesta.url);
  //   }

  //   console.log(respuesta.url);
  // }

  // Simulated auth functions - replace with real API calls
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        throw new Error('Error al momento de logearse');
      }

      const loggedUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        image: data.user.image as string,
        isVerified: data.user.emailVerified,
      };

      saveAccessToken(data.token);

      setUser(loggedUser);
    } catch (error) {
      console.log(error);
      throw new Error('Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        cedula: userData.cedula,
        isVerified: false,
      };
      setUser(newUser);
    } catch (error) {
      throw new Error('Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const saveAccessToken = (token: string) => {
    SecureStorage.setItem('auth_token', token);
    setAccessToken(token);
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const token = await SecureStorage.getItem('auth_token');

        const { data, error } = await authClient.getSession({
          fetchOptions: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });
        
        // console.log(data);

        if (error) {
          console.error('Error al obtener la sesión:', error.message);
          // Podrías hacer logout o redirigir
          return;
        }

        if (data?.session) {
          // Aquí puedes setear el user o token
          // console.log('Sesión activa:', data.session);
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            avatar: data.user.image as string,
            isVerified: data.user.emailVerified,
          });
        } else {
          console.log('No hay sesión activa.');
        }
      } catch (err) {
        console.error('Error inesperado al verificar sesión:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
