import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../services/auth/auth.hooks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const { mutate: login, isLoading } = useLogin();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    login(data, {
      onSuccess: () => {
        toast.success("Login Successfully!", {
          onClose: () => {
            navigate("/dashboard");
          },
        });
      },
      onError: (error) => {
        toast.error(error || "Login failed. Please try again.");
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
        <h2 className="flex justify-center text-xl font-semibold mb-4">
          Sign in
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            {...register("username")}
            className={`mt-1 block w-full rounded-md border px-3 py-2 bg-white focus:outline-none ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter username"
          />
          {errors.username && (
            <p className="text-sm text-red-600 mt-1">
              {errors.username.message}
            </p>
          )}

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            className={`mt-1 block w-full rounded-md border px-3 py-2 bg-white focus:outline-none ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter password"
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full bg-primary text-white py-2 rounded-md disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
