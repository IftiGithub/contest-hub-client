import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../providers/AuthContext";
import { updateProfile } from "firebase/auth";
import toast from "react-hot-toast";
import { saveUser } from "../api/user_api";
import { Navigate, useNavigate } from "react-router";

const Registration = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser, googleSignIn } = useContext(AuthContext);
    const Navigate = useNavigate()

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
                        //console.log("User updated:", user);
                        saveUser(user)
                        toast.success("Registration successful!");
                        setTimeout(() => {
                            Navigate('/')
                        }, 1000)
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
                saveUser(user)
                toast.success("Google Sign-up successful!");
                setTimeout(() => {
                    Navigate('/')
                }, 1000)
            })
            .catch(err => {
                console.error("Google Login Error:", err);
                toast.error(err.message);
            });
    };

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">

                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Register Now!</h1>
                </div>

                <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
                    <div className="card-body">

                        {/* GOOGLE SIGNUP BUTTON */}
                        <button
                            type="button"
                            onClick={handleGoogleSignup}
                            className="btn btn-outline btn-primary w-full mb-4"
                        >
                            Continue with Google
                        </button>

                        <div className="divider">OR</div>

                        {/* EMAIL FORM */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">

                            {/* NAME */}
                            <div className="form-control">
                                <label className="label">Name</label>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="input input-bordered"
                                    {...register("name", { required: "Name is required" })}
                                />
                                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                            </div>

                            {/* EMAIL */}
                            <div className="form-control">
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="input input-bordered"
                                    {...register("email", { required: "Email is required" })}
                                />
                                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                            </div>

                            {/* PASSWORD */}
                            <div className="form-control">
                                <label className="label">Password</label>
                                <input
                                    type="password"
                                    placeholder="Your Password"
                                    className="input input-bordered"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { value: 6, message: "Password must be at least 6 characters" }
                                    })}
                                />
                                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                            </div>

                            {/* PHOTO URL */}
                            <div className="form-control">
                                <label className="label">Photo URL</label>
                                <input
                                    type="text"
                                    placeholder="Your Photo URL"
                                    className="input input-bordered"
                                    {...register("photoURL", { required: "Photo URL is required" })}
                                />
                                {errors.photoURL && <span className="text-red-500 text-sm">{errors.photoURL.message}</span>}
                            </div>

                            {/* SUBMIT BUTTON */}
                            <button className="btn btn-neutral w-full mt-4" type="submit">
                                Register
                            </button>
                        </form>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Registration;
