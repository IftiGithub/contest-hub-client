import React from "react";
import { useForm } from "react-hook-form";

const Registration = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("User Data:", data);
    // TODO: send `data` to your registration logic
    // Example: createUser(data.email, data.password, data.name, data.photoURL)
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">

        {/* LEFT TEXT */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register Now!</h1>
        </div>

        {/* FORM CARD */}
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <div className="card-body">

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
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name.message}</span>
                )}
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
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email.message}</span>
                )}
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
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">{errors.password.message}</span>
                )}
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
                {errors.photoURL && (
                  <span className="text-red-500 text-sm">{errors.photoURL.message}</span>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button className="btn btn-neutral w-full mt-4">Register</button>
            </form>

            <p className="text-center mt-2 text-sm">
              Already have an account?
              <a href="/login" className="link link-hover ml-1">Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
