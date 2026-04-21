import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../providers/AuthContext";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { getUserByEmail, saveUser } from "../api/user_api";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
    const { login, googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [showDemoDropdown, setShowDemoDropdown] = useState(false);

    // 👇 where user wanted to go before login
    const from = location.state?.from?.pathname || "/";

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const result = await login(data.email, data.password);
            console.log("Logged in user:", result.user);

            toast.success("Login successful!");

            // ✅ Redirect after login
            navigate(from, { replace: true });

        } catch (error) {
            toast.error(error.message);
        }
    };

    const saveUserMutation = useMutation({
        mutationFn: saveUser,
        onSuccess: () => {
            toast.success("User saved to DB successfully!");
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });

    const handleGoogle = async () => {
        try {
            const result = await googleSignIn();
            const user = result.user;

            toast.success("Google login successful!");

            const dbUser = await getUserByEmail(user.email);

            if (!dbUser?.email) {
                saveUserMutation.mutate(user);
            }

            // ✅ Redirect after Google login
            navigate(from, { replace: true });

        } catch (error) {
            toast.error(error.message);
        }
    };

    // Demo login credentials
    const demoAccounts = [
        {
            role: "Admin",
            email: "kablu@mia.com",
            password: "kablu2094944",
            icon: "👑",
            color: "from-purple-500 to-pink-500"
        },
        {
            role: "Creator",
            email: "hablu@mia.com",
            password: "hablu2094944",
            icon: "🎨",
            color: "from-blue-500 to-cyan-500"
        },
        {
            role: "User",
            email: "bablu@mia.com",
            password: "bablu2094944",
            icon: "👤",
            color: "from-green-500 to-emerald-500"
        }
    ];

    const handleDemoLogin = async (email, password) => {
        try {
            const result = await login(email, password);
            console.log("Demo login user:", result.user);
            toast.success(`Logged in as ${email.split('@')[0]}!`);
            navigate(from, { replace: true });
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fillDemoCredentials = (email, password) => {
        setValue("email", email);
        setValue("password", password);
        toast.success("Credentials filled! Click Sign In to continue.");
        setShowDemoDropdown(false);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
            >
                {/* Card Container */}
                <div className="card-gamified">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-3xl">🎮</span>
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                            Welcome Back!
                        </h1>
                        <p className="text-[var(--text-secondary)] text-sm">
                            Sign in to continue your competitive journey
                        </p>
                    </motion.div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Email Input */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="input-gamified w-full"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email"
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                    ⚠️ {errors.email.message}
                                </p>
                            )}
                        </motion.div>

                        {/* Password Input */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="input-gamified w-full"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                    ⚠️ {errors.password.message}
                                </p>
                            )}
                        </motion.div>

                        {/* Login Button */}
                        <motion.button
                            type="submit"
                            className="btn-gamified w-full mt-6"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span>🚀 Sign In</span>
                        </motion.button>
                    </form>

                    {/* Demo Login Section */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--border-light)]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                try demo account
                            </span>
                        </div>
                    </div>

                    {/* Demo Accounts Dropdown - SCROLLABLE VERSION */}
                    <div className="relative mb-6">
                        <motion.button
                            type="button"
                            onClick={() => setShowDemoDropdown(!showDemoDropdown)}
                            className="w-full py-3 px-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <span>🎭</span> Demo Login
                            <span className="ml-2">{showDemoDropdown ? '▲' : '▼'}</span>
                        </motion.button>

                        <AnimatePresence>
                            {showDemoDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute bottom-full left-0 right-0 mb-2 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg shadow-xl z-50"
                                    style={{ 
                                        maxHeight: "360px", 
                                        overflowY: "auto",
                                        overflowX: "hidden"
                                    }}
                                >
                                    {demoAccounts.map((account, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="p-3 hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer border-b border-[var(--border-light)] last:border-b-0"
                                            onClick={() => fillDemoCredentials(account.email, account.password)}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{account.icon}</span>
                                                    <span className="font-semibold text-[var(--text-primary)]">{account.role}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDemoLogin(account.email, account.password);
                                                    }}
                                                    className="text-xs px-3 py-1 bg-[var(--accent-primary)] text-white rounded-full hover:bg-[var(--accent-secondary)] transition-colors"
                                                >
                                                    Quick Login
                                                </button>
                                            </div>
                                            <div className="text-xs text-[var(--text-secondary)] space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span>📧</span>
                                                    <span>{account.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span>🔑</span>
                                                    <span>{account.password}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--border-light)]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                or continue with
                            </span>
                        </div>
                    </div>

                    {/* Google Login Button */}
                    <motion.button
                        type="button"
                        className="w-full py-3 px-4 border-2 border-[var(--border-medium)] rounded-lg hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)] transition-all duration-200 flex items-center justify-center gap-2 font-medium text-[var(--text-primary)]"
                        onClick={handleGoogle}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>🔐</span> Google
                    </motion.button>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center text-sm">
                        <span className="text-[var(--text-secondary)]">New to Contest Hub? </span>
                        <a href="/register" className="font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors">
                            Create account
                        </a>
                    </div>
                </div>

                {/* Bottom Decoration */}
                <motion.div
                    className="mt-8 text-center"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <p className="text-[var(--text-secondary)] text-sm">
                        ✨ Join thousands of competitive programmers
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;