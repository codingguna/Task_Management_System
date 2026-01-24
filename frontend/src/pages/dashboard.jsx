import TaskCard from "../components/TaskCard";

export default function Dashboard({ tasks }) {
  return tasks.map(task => <TaskCard key={task._id} task={task} />);
}
