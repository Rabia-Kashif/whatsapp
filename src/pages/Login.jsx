import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminLogin, useAgentLogin } from "../services/auth/auth.hooks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
const schema = z.object({
  email: z.email({ message: "Please enter valid email address" }).toLowerCase(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [loginType, setLoginType] = useState("agent");
  const { mutate: agentLogin, isPending: isAgentPending } = useAgentLogin();
  const { mutate: adminLogin, isPending: isAdminPending } = useAdminLogin();
  const setClientId = useAppStore((state) => state.setClientId);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data, event) => {
    if (event) event.preventDefault();

    setFormError("");
    const mutationFn = loginType === "agent" ? agentLogin : adminLogin;

    if (!mutationFn) return;

    mutationFn(data, {
      onSuccess: () => {
        toast.success(
          `${loginType === "agent" ? "Agent" : "Admin"} Logged in successfully!`,
          {
            autoClose: 3000,
            onClose: () => {
              if (loginType === "agent") {
                setClientId(null);
                navigate("/chat-dashboard");
              } else if (loginType === "admin") {
                navigate("/admin-dashboard");
              }
            },
          },
        );
      },
      onError: (error) => {
        const message =
          error?.response?.data?.detail || error?.message || "Something went wrong. Please try again.";
        setFormError(message);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[90%] md:w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="flex justify-center text-xl font-semibold mb-4">
          Sign in
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register("email", {
              onChange: () => setFormError(""),
            })}
            className={`mt-1 block w-full rounded-md border px-3 py-2 bg-white focus:outline-none ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter email"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}

          <label className="block text-sm font-medium text-gray-700 mt-4">
            Password
          </label>
          <input
            {...register("password", {
              onChange: () => setFormError(""),
            })}
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
          {/* User Type Option */}
          <div className="py-4">
            <label className="block text-[18px] font-medium text-theme-black mb-2">
              Login as
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="admin"
                  checked={loginType === "admin"}
                  onChange={(e) => setLoginType(e.target.value)}
                  className="h-4 w-4 text-[#336699] focus:ring-[#336699]"
                />
                <span>Admin</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="agent"
                  checked={loginType === "agent"}
                  onChange={(e) => setLoginType(e.target.value)}
                  className="h-4 w-4 text-[#336699] focus:ring-[#336699]"
                />
                <span>Agent</span>
              </label>
            </div>
          </div>
          {formError && (
            <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 mb-3 rounded-md text-sm">
              {formError}
            </div>
          )}
          <button
            type="submit"
            disabled={!isValid || isAgentPending || isAdminPending}
            className={`w-full py-3 text-white text-base font-medium rounded-md flex items-center justify-center transition-colors hover:opacity-90`}
            style={{
              backgroundColor: isValid ? "#336699" : "#ADC2D6",
              cursor: isValid ? "pointer" : "not-allowed",
            }}
          >
            {isAgentPending || isAdminPending ? (
              <ClipLoader color="#fff" size={20} />
            ) : (
              `Login as ${loginType === "admin" ? "Admin" : "Agent"}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
