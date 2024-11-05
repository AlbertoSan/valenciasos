import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: false,
    user: null,
    token: null,
    error: null,
    isLoading: false,
  }),

  actions: {
    async login({ username, password }) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ username, password }),
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          this.isAuthenticated = true;
          this.user = data.user;
          this.token = data.token;
          localStorage.setItem(
            "auth",
            JSON.stringify({
              isAuthenticated: true,
              user: data.user,
              token: data.token,
            }),
          );
          return true;
        }

        throw new Error(data.error || "Credenciales inválidas");
      } catch (error) {
        console.error("Login error:", error);
        if (error.name === "TypeError" && error.message.includes("fetch")) {
          this.error =
            "Error de conexión. Por favor, verifica tu conexión a internet.";
        } else {
          this.error =
            error.message ||
            "Error al iniciar sesión. Por favor, intenta de nuevo.";
        }
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.token = null;
      this.error = null;
      localStorage.removeItem("auth");
    },

    async initializeAuth() {
      try {
        const auth = localStorage.getItem("auth");
        if (auth) {
          const { isAuthenticated, user, token } = JSON.parse(auth);
          if (isAuthenticated && user && token) {
            // Verify token is still valid with the server
            const response = await fetch("/api/health", {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
              credentials: "include",
            });

            if (response.ok) {
              this.isAuthenticated = isAuthenticated;
              this.user = user;
              this.token = token;
              return;
            }
          }
          // If we get here, token is invalid
          this.logout();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        this.logout();
      }
    },

    clearError() {
      this.error = null;
    },
  },
});
