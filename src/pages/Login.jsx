import React, { useState } from "react";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      for (const err of result.error.errors) {
        const key = err.path[0] || "form";
        fieldErrors[key] = err.message;
      }
      setErrors(fieldErrors);
      setSuccess("");
      return;
    }

    // form is valid - do login action here
    setErrors({});
    setSuccess("Login successful (demo)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="flex justify-center text-xl font-semibold mb-4">Sign in</h2>

        <form onSubmit={handleSubmit} noValidate>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border px-3 py-2 bg-white focus:outline-none ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter username"
          />
          {errors.username && (
            <div className="text-sm text-red-600 mt-1">{errors.username}</div>
          )}

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border px-3 py-2 bg-white focus:outline-none ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter password"
          />
          {errors.password && (
            <div className="text-sm text-red-600 mt-1">{errors.password}</div>
          )}

          <button
            type="submit"
            className="mt-6 w-full bg-cyan-700 text-white py-2 rounded-md"
          >
            Sign in
          </button>
        </form>

        {success && (
          <div className="mt-4 text-sm text-cyan-700">{success}</div>
        )}
      </div>
    </div>
  );
};

export default Login;
