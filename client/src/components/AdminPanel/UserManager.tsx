import React, { useEffect, useState } from "react";
import UserDetailsModal from "./UserDetailsModal";

interface User {
  matrikelnumber: number;
  firstname: string;
  secondname: string;
  email: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const UsersManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [addingUser, setAddingUser] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/users/getUsers`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  const handleDelete = async (matrikelnumber: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const res = await fetch(
          `${API_BASE_URL}/users/deleteUser/${matrikelnumber}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) throw new Error("Failed to delete user");

        setUsers((prev) =>
          prev.filter((u) => u.matrikelnumber !== matrikelnumber)
        );
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Could not delete user");
      }
    }
  };

  const handleSave = async (user: User) => {
    if (addingUser) {
      try {
        const res = await fetch(`${API_BASE_URL}/users/addUser`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error("Failed to add user");
        setUsers((prev) => [...prev, user]);
      } catch (err) {
        console.error(err);
        alert("Failed to add user");
      } finally {
        setAddingUser(false);
        setEditingUser(null);
      }
    } else {
      try {
        const res = await fetch(
          `${API_BASE_URL}/users/updateUser/${user.matrikelnumber}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
          }
        );
        if (!res.ok) throw new Error("Failed to update user");

        setUsers((prev) =>
          prev.map((u) =>
            u.matrikelnumber === user.matrikelnumber ? user : u
          )
        );
        setEditingUser(null);
      } catch (err) {
        console.error(err);
        alert("Failed to update user");
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl text-black font-semibold mb-4">Benutzer</h2>

      <button
        onClick={() => {
          setAddingUser(true);
          setEditingUser({
            matrikelnumber: 0,
            firstname: "",
            secondname: "",
            email: "",
          });
        }}
        className="px-4 py-2 rounded bg-black text-white mb-4 hover:cursor-pointer hover:bg-black/70"
      >
        Benutzer hinzufügen
      </button>

      {/* Обёртка для горизонтального скролла */}
      <div className="overflow-x-auto">
        <table className="w-full text-black table-auto border-collapse border border-gray-300">
          <thead className="hidden md:table-header-group">
            <tr>
              <th className="border border-gray-300 p-2">Matrikelnummer</th>
              <th className="border border-gray-300 p-2">Vorname</th>
              <th className="border border-gray-300 p-2">Nachname</th>
              <th className="border border-gray-300 p-2">E-mail</th>
              <th className="border border-gray-300 p-2">Aktionen</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {users.map((user) => (
              <tr
                key={user.matrikelnumber}
                className="block md:table-row border border-gray-300 mb-4 md:mb-0 p-2 md:p-0 rounded md:rounded-none bg-white shadow md:shadow-none"
              >
                <td className="block md:table-cell md:border border-gray-300 p-2">
                  <span className="font-semibold md:hidden">Matrikelnummer: </span>
                  {user.matrikelnumber}
                </td>
                <td className="block md:table-cell md:border border-gray-300 p-2">
                  <span className="font-semibold md:hidden">Vorname: </span>
                  {user.firstname}
                </td>
                <td className="block md:table-cell md:border border-gray-300 p-2">
                  <span className="font-semibold md:hidden">Nachname: </span>
                  {user.secondname}
                </td>
                <td className="block md:table-cell md:border border-gray-300 p-2">
                  <span className="font-semibold md:hidden">E-mail: </span>
                  {user.email}
                </td>
                <td className="block md:table-cell md:border border-gray-300 p-2">
                  <div className="flex gap-2 justify-start md:justify-center">
                    <button
                      className="text-sm border p-2 rounded hover:bg-gray-100"
                      onClick={() => {
                        setEditingUser(user);
                        setAddingUser(false);
                      }}
                    >
                      Bearbeiten
                    </button>
                    <button
                      className="text-white text-sm bg-black p-2 rounded hover:bg-black/80"
                      onClick={() => handleDelete(user.matrikelnumber)}
                    >
                      Löschen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <UserDetailsModal
          user={editingUser}
          onSave={handleSave}
          onClose={() => {
            setEditingUser(null);
            setAddingUser(false);
          }}
        />
      )}
    </div>
  );
};

export default UsersManager;
