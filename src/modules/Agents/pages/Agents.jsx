import { Pencil, Trash } from "lucide-react";
import {
  useDeleteAgent,
  useGetAgents,
} from "../../../services/agents/agents.hooks";
import { useState } from "react";
import Modal from "../../../components/Modals/Modal";
import DeleteAlertModal from "../../../components/Modals/DeleteAlertModal";
import AgentEditModal from "../../../components/Modals/AgentEditModal";
const Agents = () => {
  const { data, isLoading, isError, error } = useGetAgents();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openAgentModal, setOpenAgentModal] = useState(false);
  const [agentModalMode, setAgentModalMode] = useState("create");
  const { mutate: deleteAgent, isLoading: deletingRecord } = useDeleteAgent();
  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading agents...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error || "Failed to fetch agents"}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No agents found.</p>
      </div>
    );
  }

  const handleDelete = () => {
    if (!selectedRecord) return;
    deleteAgent(selectedRecord.id, {
      onSuccess: () => {
        setOpenDeleteModal(false);
        setSelectedRecord(null);
      },
      onError: (error) => {
        console.error("Failed to delete agent: ", error);
      },
    });
  };
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Agents List</h2>
          <div>
            <button
              className="px-3 py-2 bg-[#336699] text-white rounded-md text-sm cursor-pointer"
              onClick={() => {
                setAgentModalMode("create");
                setOpenAgentModal(true);
              }}
            >
              Add Agent
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Agent Type
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((agent) => (
              <tr
                key={agent.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-sm text-gray-700">{agent.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">
                  {agent.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {agent.email}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#336699]/10 text-[#336699]">
                    {agent.agent_type}
                  </span>
                </td>
                <td className="py-4 px-6  flex justify-start  gap-3">
                  <button
                    className="cursor-pointer text-gray-600 hover:text-gray-800"
                    onClick={() => {
                      setSelectedRecord(agent);
                      setAgentModalMode("edit");
                      setOpenAgentModal(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    className="cursor-pointer text-red-600 hover:text-red-800"
                    onClick={() => {
                      setSelectedRecord(agent);
                      setOpenDeleteModal(true);
                    }}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {openDeleteModal && (
        <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
          <DeleteAlertModal
            onClose={() => setOpenDeleteModal(false)}
            onDelete={() => handleDelete()}
            isLoading={deletingRecord}
          />
        </Modal>
      )}
      {openAgentModal && (
        <Modal open={openAgentModal} onClose={() => setOpenAgentModal(false)}>
          <AgentEditModal
            onClose={(refresh) => {
              setOpenAgentModal(false);
              setSelectedRecord(null);
              if (refresh) {
                // optionally handled by react-query invalidation
              }
            }}
            mode={agentModalMode}
            agent={selectedRecord}
          />
        </Modal>
      )}
    </div>
  );
};

export default Agents;
