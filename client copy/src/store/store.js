// Import Modules
import { defineStore } from "pinia";

// Create Store
export const useCredentialsStore = defineStore("credentials", {
    state: () => {
        return {
            token: null,
            account_type: null,
            user: null,
            user_id: null,
            isLoggedIn: false,
        };
    },
    actions: {
        init() {
            // Check if user is logged in, if so, set the state to the user's info, otherwise set the state to null
            if (localStorage.getItem("userInfo")) {
                const { token, account_type, user, user_id, isLoggedIn } = JSON.parse(
                    localStorage.getItem("userInfo")
                );
                (this.token = token),
                    (this.account_type = account_type),
                    (this.user = user),
                    (this.user_id = user_id);
                this.isLoggedIn = isLoggedIn;
            } else {
                this.token = null;
                this.account_type = null;
                this.user = null;
                this.user_id = null;
                this.isLoggedIn = false;
                localStorage.setItem(
                    "userInfo",
                    JSON.stringify({
                        token: this.token,
                        account_type: this.account_type,
                        user: this.user,
                        user_id: this.user_id,
                        isLoggedIn: this.isLoggedIn,
                    })
                );
            }
        },
        // Set the state to the user's info and save it to local storage, so that the user will be logged in on refresh
        login(token, account_type, user, user_id) {
            this.token = token;
            this.account_type = account_type;
            this.user = user;
            this.user_id = user_id;
            this.isLoggedIn = true;
            localStorage.setItem(
                "userInfo",
                JSON.stringify({
                    token: this.token,
                    account_type: this.account_type,
                    user: this.user,
                    user_id: this.user_id,
                    isLoggedIn: this.isLoggedIn,
                })
            );
        },
        // Set the state to null and save it to local storage, so that the user will be logged out on refresh
        logout() {
            this.token = null;
            this.account_type = null;
            this.user = null;
            this.user_id = null;
            this.isLoggedIn = false;
            localStorage.setItem(
                "userInfo",
                JSON.stringify({
                    token: this.token,
                    account_type: this.account_type,
                    user: this.user,
                    user_id: this.user_id,
                    isLoggedIn: this.isLoggedIn,
                })
            );
        },
    },
});
