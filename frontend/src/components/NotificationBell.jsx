import { useEffect, useState } from "react";
import api from "../services/api";
import socket from "../services/socket";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    const res = await api.get("/notifications");
    setNotifications(res.data);
  };

  useEffect(() => {
    (async () => {
      await fetchNotifications();
    })();

    socket.on("new_notification", fetchNotifications);

    return () => {
      socket.off("new_notification");
    };
  }, []);

  const markAsRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const viewNotification = (n) => {
    markAsRead(n._id);

    if (n.relatedId) {
      navigate(`/tasks/${n.relatedId}`);
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg z-50">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No new notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className="p-3 border-b text-sm hover:bg-gray-50"
              >
                <p className="font-medium">{n.title}</p>
                <p className="text-gray-600">{n.message}</p>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => viewNotification(n)}
                    className="text-blue-600 text-xs"
                  >
                    View
                  </button>
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="text-gray-500 text-xs"
                  >
                    Mark as read
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
