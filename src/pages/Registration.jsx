import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../providers/AuthContext";
import { updateProfile } from "firebase/auth";
import toast from "react-hot-toast";
import { saveUser } from "../api/user_api";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

const Registration = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, googleSignIn } = useContext(AuthContext);
    const navigate = useNavigate();

    // --- EMAIL/PASSWORD REGISTRATION ---
    const onSubmit = (data) => {
        const { email, password, name, photoURL } = data;

        createUser(email, password)
            .then(res => {
                const user = res.user;

                // Update profile
                updateProfile(user, {
                    displayName: name,
                    photoURL: photoURL
                })
                    .then(() => {
                        saveUser(user);
                        toast.success("Registration successful!");
                        setTimeout(() => {
                            navigate('/');
                        }, 1000);
                    })
                    .catch(err => {
                        console.error("Error updating profile:", err);
                        toast.error(err.message);
                    });
            })
            .catch(err => {
                console.error("Error creating user:", err);
                toast.error(err.message);
            });
    };

    // --- GOOGLE SIGNUP ---
    const handleGoogleSignup = () => {
        googleSignIn()
            .then(res => {
                const user = res.user;
                console.log("Google Sign-In User:", user);
                saveUser(user);
                toast.success("Google Sign-up successful!");
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            })
            .catch(err => {
                console.error("Google Login Error:", err);
                toast.error(err.message);
            });
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
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--accent-secondary)] to-[var(--accent-primary)] rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-3xl">🎯</span>
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                            Join Contest Hub!
                        </h1>
                        <p className="text-[var(--text-secondary)] text-sm">
                            Create an account to start your competitive journey
                        </p>
                    </motion.div>

                    {/* Google Signup Button */}
                    <motion.button
                        type="button"
                        className="w-full py-3 px-4 border-2 border-[var(--border-medium)] rounded-lg hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)] transition-all duration-200 flex items-center justify-center gap-2 font-medium text-[var(--text-primary)] mb-6"
                        onClick={handleGoogleSignup}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span>🔐</span> Sign up with Google
                    </motion.button>

                    {/* Divider */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-[var(--border-light)]"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                or register with email
                            </span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name Input */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="input-gamified w-full"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                    ⚠️ {errors.name.message}
                                </p>
                            )}
                        </motion.div>

                        {/* Email Input */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.45 }}
                        >
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="input-gamified w-full"
                                {...register("email", { required: "Email is required" })}
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
                            transition={{ delay: 0.5 }}
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
                                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                    ⚠️ {errors.password.message}
                                </p>
                            )}
                        </motion.div>

                        {/* Photo URL Input */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.55 }}
                        >
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Photo URL
                            </label>
                            <input
                                type="text"
                                placeholder="https://example.com/photo.jpg"
                                className="input-gamified w-full"
                                {...register("photoURL", { required: "Photo URL is required" })}
                            />
                            {errors.photoURL && (
                                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                                    ⚠️ {errors.photoURL.message}
                                </p>
                            )}
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            className="btn-gamified w-full mt-6"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <span>✨ Create Account</span>
                        </motion.button>
                    </form>

                    {/* Sign In Link */}
                    <div className="mt-6 text-center text-sm">
                        <span className="text-[var(--text-secondary)]">Already have an account? </span>
                        <a href="/login" className="font-semibold text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors">
                            Sign in
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
                        🏆 Join a community of elite programmers
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Registration;
