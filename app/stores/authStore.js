import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { request } from '@/util/request';
import { useUserStore } from '@/stores/userStore';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      otpSent: false,
      otpUserId: null, // store user_id after OTP is sent

      // -------------------------------
      // Login (email or phone) → sends OTP
      // -------------------------------
      login: async (login, password) => {
        set({ loading: true, error: null, otpSent: false });

        try {
          const res = await request('/login', 'POST', { login, password });

          // -------------------------------
          // OTP flow commented
          // -------------------------------
          /*
          if (res?.user_id && !res?.token) {
            set({ otpSent: true, otpUserId: res.user_id });
            return { otpSent: true, user_id: res.user_id };
          }
          */

          const user = res?.user || res?.data?.user || res;
          const token = res?.token || res?.data?.token || res?.data?.access_token;

          if (!user || !token) throw new Error('Invalid login response.');

          set({ user, token, otpSent: false });
          return { user, token };
        } catch (err) {
          const msg = err?.response?.data?.message || err.message || 'Login failed';
          set({ error: msg });
          throw new Error(msg);
        } finally {
          set({ loading: false });
        }
      },

      // -------------------------------
      // Verify OTP
      // -------------------------------
      verifyOtp: async (otp) => {
        set({ loading: true, error: null });

        try {
          const res = await request('/verify-otp', 'POST', {
            user_id: get().otpUserId,
            otp,
          });

          const user = res?.user;
          const token = res?.token;
          if (!user || !token) throw new Error('OTP verification failed.');

          set({ user, token, otpSent: false, otpUserId: null });
          return { user, token };
        } catch (err) {
          const msg = err?.response?.data?.error || err.message || 'OTP verification failed';
          set({ error: msg });
          throw new Error(msg);
        } finally {
          set({ loading: false });
        }
      },

      // -------------------------------
      // Register
      // -------------------------------
register: async ({ name, email, password, confirm_password, phone_number }) => {
  set({ loading: true, error: null });

  try {
    const res = await request('/register', 'POST', {
      name,
      email,
      password,
      confirm_password,
      phone_number,
    });

    const user = res?.data?.user;
    const token = res?.data?.access_token;

    if (!user || !token) throw new Error('Invalid register response');

    set({ user, token });
    return { user, token };
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Registration failed';
    set({ error: msg });
    throw new Error(msg);
  } finally {
    set({ loading: false });
  }
},

      // -------------------------------
      // Login with existing token
      // -------------------------------
      loginWithToken: async (token) => {
        set({ loading: true, error: null });

        try {
          set({ token });
          const res = await request('/profile', 'GET', null, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res?.data) throw new Error('Failed to fetch user data.');
          set({ user: res.data });
          return res.data;
        } catch (err) {
          set({ user: null, token: null, error: err.message || 'Login with token failed' });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      // -------------------------------
      // Logout
      // -------------------------------
      logout: async () => {
        try {
          await request('/logout', 'POST', null, {
            headers: { Authorization: `Bearer ${get().token}` },
          });
        } catch (err) {
          console.warn('Logout API failed, logging out client-side.', err);
        }

        set({ user: null, token: null, otpSent: false, otpUserId: null });
        useUserStore.getState().clearUser();
      },

      getToken: () => get().token,

      // Helpers to manually set token/user (needed for handleSubmit)
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);
