import {React, useState} from "react";
import './notifications.css'

const initialNotifications = [
  {
    id: 1,
    type: 'delay',
    title: 'Book Return Delay',
    message: 'User Ahmad Mustafa delayed the return of "The Alchemist" by 3 days.',
    date: '2025-08-05',
    read: false,
  },
  {
    id: 2,
    type: 'system',
    title: 'System Maintenance Alert',
    message: 'The system will undergo maintenance on Friday at 12:00 AM.',
    date: '2025-08-04',
    read: false,
  },
  {
    id: 3,
    type: 'stock',
    title: 'Out of Stock',
    message: '"One Hundred Years of Solitude" is no longer available in the library.',
    date: '2025-08-03',
    read: true,
  },
];

const Notifications = () => {


const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteAll = () => {
    setNotifications([]);
  };


    return(
        <>
              <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>

      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={markAllAsRead}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Mark All as Read
        </button>
        <button
          onClick={deleteAll}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete All
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">No notifications at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-4 border rounded shadow flex justify-between items-start ${
                n.read ? 'bg-white' : 'bg-yellow-50'
              }`}
            >
              <div className="flex-1">
                <h4 className="font-semibold">{n.title}</h4>
                <p className="text-sm text-gray-700">{n.message}</p>
                <small className="text-gray-400">{n.date}</small>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
        </>

    )
}

export default Notifications;