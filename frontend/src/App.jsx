import { useEffect , useState} from "react";
import api from "./services/api";

function App() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    api.get("/tasks")
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error(err));
  }, []);

  return (
     <div>
      <h2>Tasks</h2>
      {tasks.map(task => (
        <p key={task._id}>{task.title}</p>
      ))}
    </div>
  );
}

export default App;
