import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";

import { db } from "./firebase/firebase";

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "users")
      );

      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      setUsers(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeProStatus = async (userId, currentStatus) => {
    try {
      await updateDoc(
        doc(db, "users", userId),
        {
          isPro: !currentStatus
        }
      );

      await loadUsers();
    } catch (error) {
      alert("Permission denied or update failed.");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="center">
        Loading users...
      </div>
    );
  }

  return (
    <div className="adminPage">

      <div className="adminHeader">

        <div className="logo">
          U
        </div>

        <div>
          <h2>Admin Panel</h2>
          <p>URL Monitor</p>
        </div>

      </div>

      <div className="adminStats">

        <div>
          <strong>
            {users.length}
          </strong>

          <span>
            Total Users
          </span>
        </div>

        <div>
          <strong>
            {
              users.filter(
                (user) => user.isPro === true
              ).length
            }
          </strong>

          <span>
            Pro Users
          </span>
        </div>

      </div>

      <div className="userList">

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (

          users.map((user) => (

            <div
              className="userCard"
              key={user.id}
            >

              <div>

                <strong>
                  {user.name || "User"}
                </strong>

                <p>
                  {user.email}
                </p>

                <small>
                  {user.isPro
                    ? "⭐ PRO"
                    : "FREE"}
                </small>

              </div>

              <button
                className={
                  user.isPro
                    ? "removePro"
                    : "makePro"
                }
                onClick={() =>
                  changeProStatus(
                    user.id,
                    user.isPro === true
                  )
                }
              >
                {user.isPro
                  ? "Remove Pro"
                  : "Make Pro"}
              </button>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default AdminPanel;
