// components/DataBase.tsx
import { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type User = {
  matrikelnumber: number;
  firstname: string;
  secondname: string;
  startdate: string;
  enddate: string;
  deviceid: number;
  email: string;
};

type Device = {
  deviceid: string;
  devicename: string;
  devicedescription: string;
  status: string;
  comments: string;
};

type Reservation = {
  reservationnumber: number;
  status: string;
  matrilelnumber: number;
  deviceid: number;
  startdate: string;
  enddate: string;
  quantitybooked: number;
};

export default function DataBase() {
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/hello`)
      .then(res => res.json())
      .then(data => {
        console.log('API data:', data);
        setUsers(data.users || []);
        setDevices(data.devices || []);
        setReservations(data.reservations || []);
      })
      .catch(err => console.error('API fetch error:', err));
  }, []);

  return (
    <>
      <h1>Vite + React</h1>
      <button onClick={() => setCount(count + 1)}>count is {count}</button>

      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.matrikelnumber}>
            {user.firstname} {user.secondname} – {user.email}
          </li>
        ))}
      </ul>

      <h2>Devices</h2>
      <ul>
        {devices.map(device => (
          <li key={device.deviceid}>
            {device.devicename} – {device.status}
          </li>
        ))}
      </ul>

      <h2>Reservations</h2>
      <ul>
        {reservations.map(res => (
          <li key={res.reservationnumber}>
            Reservation #{res.reservationnumber} – {res.status}
          </li>
        ))}
      </ul>
    </>
  );
}
