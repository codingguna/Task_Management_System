const statusStyles = {
  pending: "bg-gray-100 text-gray-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  completed_request: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const TaskCard = ({ task, onApprove, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-5">
      <div className="flex justify-between">
        <h3 className="font-semibold text-slate-800">{task.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            statusStyles[task.status]
          }`}
        >
          {task.status.replace("_", " ")}
        </span>
      </div>

      <p className="text-sm text-slate-500 mt-2">
        Assigned to: <b>{task.assignedTo?.name}</b>
      </p>

      <div className="flex gap-2 mt-4">
        {task.status === "completed_request" && (
          <button
            onClick={() => onApprove(task._id)}
            className="flex-1 bg-green-500 text-white py-2 rounded-lg"
          >
            Approve
          </button>
        )}
        <button
          onClick={() => onDelete(task._id)}
          className="flex-1 bg-red-500 text-white py-2 rounded-lg"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
