// Import Modules
import { createRouter, createWebHistory } from "vue-router";

// Import Pages
import Login from "@/pages/login/Login.vue";
import Contact from "@/pages/contact/Contact.vue";
import TeacherSignup from "@/pages/signup/TeacherSignup.vue";
import StudentSignup from "@/pages/signup/StudentSignup.vue";
import Index from "@/pages/index/Index.vue";
import Admin from "@/pages/admin-profile/Admin.vue";
import Teacher from "@/pages/teacher-profile/Teacher.vue";
import Student from "@/pages/student-profile/Student.vue";

// Import Store
import { useCredentialsStore } from "./../store/store.js";

// Export Router
const router = createRouter({
    mode: "history",
    history: createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
        // always scroll to top
        return { top: 0 };
    },
    routes: [
        {
            // Test Page
            path: "/test",
            name: "test",
            component: Admin,
            meta: { account_type: ["student", "teacher", "admin"] },
        },
        {
            // Index Page
            path: "/",
            name: "index",
            component: Index,
        },
        {
            // Contact Page
            path: "/contact",
            name: "contact",
            component: Contact,
        },
        {
            // Login Page
            path: "/login",
            name: "login",
            component: Login,
        },
        {
            // Teacher Signup Page
            path: "/teacher/signup",
            name: "teacher signup",
            component: TeacherSignup,
        },
        {
            // Student Signup Page
            path: "/student/signup",
            name: "student signup",
            component: StudentSignup,
        },
        {
            // Admin Page
            path: "/admin",
            name: "admin",
            component: Admin,
            meta: { account_type: ["admin"] },
        },
        {
            // Teacher Page
            path: "/teacher",
            name: "teacher",
            component: Teacher,
            meta: { account_type: ["teacher"] },
        },
        {
            // Student Page
            path: "/student",
            name: "student",
            component: Student,
            meta: { account_type: ["student"] },
        },
    ],
});

// Check if account_type can access route
function canAccess(credentials, route) {
    // Check if user is logged in and route has meta and meta has account_type
    if (credentials.isLoggedIn && route.meta && route.meta.account_type) {
        return route.meta.account_type.includes(credentials.account_type);
    }
    return true;
}

// Router Guard
router.beforeEach(async (to, from) => {
    // Get Credentials Store
    const credentials = useCredentialsStore();

    // Redirect to login page if not logged in and trying to access page with account type
    if (!credentials.isLoggedIn && to.meta && to.meta.account_type) {
        return { name: "login", replace: true };
    }
    // Redirect to home page if logged in and trying to access login or signup page
    else if (credentials.isLoggedIn && (to.name === "login" || to.name === "signup")) {
        return { name: "index", replace: true };
    }
    // Redirect to index page if logged in and trying to access a restricted page with an invalid account type
    else if (!canAccess(credentials, to)) {
        return { name: "index", replace: true };
    }
    // Otherwise, proceed
    else {
        return true;
    }
});

// Export Router
export default router;
