import { useEffect, useState } from "react";
import {
  useCreateAgent,
  useUpdateAgent,
} from "../../services/agents/agents.hooks";

const AgentEditModal = ({ onClose, mode = "create", agent = null }) => {
  const initialCreate = { name: "", email: "", password: "", agent_type: "mcf", role: "agent" };
  const initialEdit = { name: "", email: "", password: "", agent_type: "mcf", role: "agent" };

  const [form, setForm] = useState(mode === "create" ? initialCreate : initialEdit);

  const { mutate: createAgent, isLoading: creating } = useCreateAgent();
  const { mutate: updateAgent, isLoading: updating } = useUpdateAgent();

  useEffect(() => {
    if (mode === "edit" && agent) {
      setForm({
        name: agent.name || "",
        email: agent.email || "",
        password: "",
        agent_type: agent.agent_type || "mcf",
        role: agent.role || "agent",
      });
    } else if (mode === "create") {
      setForm(initialCreate);
    }
  }, [mode, agent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "create") {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "agent",
        agent_type: form.agent_type,
      };
      createAgent(payload, {
        onSuccess: () => onClose(true),
        onError: (err) => console.error("Create agent error:", err),
      });
    } else {
      if (!agent) return;
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        agent_type: form.agent_type,
      };
      updateAgent(
        { agentId: agent.id, payload },
        {
          onSuccess: () => onClose(true),
          onError: (err) => console.error("Update agent error:", err),
        },
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 xl:w-[28vw] lg:w-[42vw] md:w-[52vw] w-[72vw] h-auto p-8 rounded-2xl bg-white">
        <h3 className="text-lg font-semibold mb-4">
          {mode === "create" ? "Create Agent" : "Edit Agent"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required={mode === "create"}
              placeholder={mode === "edit" ? "Leave blank to keep current" : ""}
              className="w-full border px-3 py-2 rounded-md"
            />
          </div>

          {/* Agent Type — only for create */}
          {/* {mode === "create" && ( */}
            <div>
              <label className="block text-sm text-gray-600 mb-1">Agent Type</label>
              <select
                name="agent_type"
                value={form.agent_type}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="mcf">MCF</option>
                <option value="fda">FDA</option>
                <option value="fwmc">FWMC</option>
                <option value="pha">PHA</option>
                <option value="wasa">WASA</option>
                <option value="bisc">BISC</option>
                <option value="support">Support</option>
              </select>
            </div>
          {/* )} */}

          {/* Role — only for edit
          {mode === "edit" && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Role</label>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
          )} */}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || updating}
              className="px-4 py-2 rounded-md bg-[#336699] text-white disabled:opacity-60 cursor-pointer"
            >
              {mode === "create"
                ? creating ? "Creating..." : "Create"
                : updating ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgentEditModal;