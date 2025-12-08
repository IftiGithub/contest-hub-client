import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../providers/AuthContext";

const Login = () => {
    const { login, googleSignIn } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const result = await login(data.email, data.password);
            console.log("Logged in user:", result.user);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleGoogle = async () => {
        try {
            const result = await googleSignIn();
            console.log("Google Signed-in:", result.user);
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">

                {/* Heading */}
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6 max-w-md">
                        Access your account to join contests and manage your dashboard.
                    </p>
                </div>

                {/* Login Card */}
                <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
                    <div className="card-body">

                        <form onSubmit={handleSubmit(onSubmit)}>

                            {/* Email */}
                            <label className="label">Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                className="input input-bordered w-full"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email"
                                    }
                                })}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}

                            {/* Password */}
                            <label className="label mt-2">Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                className="input input-bordered w-full"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    }
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}

                            <button className="btn btn-neutral mt-4 w-full" type="submit">
                                Login
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="divider">OR</div>

                        {/* Google Login */}
                        <button
                            className="btn btn-outline w-full"
                            onClick={handleGoogle}
                        >
                            Continue with Google
                        </button>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
