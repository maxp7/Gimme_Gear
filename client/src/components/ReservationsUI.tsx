import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBarContainer from './SearchBarContainer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type Reservation = {
  reservationnumber: string; 
  matrikelnumber: number;
  startdate: string;
  enddate: string;
  status: string;
  deviceid: string;
  firstname: string;
  secondname: string;
  email: string;
};

export default function ReservationsUI() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [formData, setFormData] = useState<Omit<Reservation, 'reservationnumber' | 'status'>>({
    matrikelnumber: 0,
    startdate: '',
    enddate: '',
    deviceid: '',
    firstname: '',
    secondname: '',
    email: '',
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken'); 
  useEffect(() => {
    if (!token) {
     
      navigate('/');
      return;
    }
    // You may want to verify the token server-side here too, but for now just fetch:
    fetch(`${API_BASE_URL}/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => setReservations(data.reservations || []))
      .catch(err => {
        console.error('API fetch error:', err);
        // If unauthorized, redirect to login:
        if (err.message.includes('401') || err.message.includes('403')) {
          navigate('/login');
        }
      });
  }, [navigate]);;
;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'matrikelnumber' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    fetch(`${API_BASE_URL}/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData),
    })
      .then(res => res.json())
      .then(data => {
        if (data.reservation) {
          setReservations(prev => [...prev, data.reservation]);
          
        } else {
          console.error('Failed to add reservation:', data.error);
        }
        setFormData({
          matrikelnumber: 0,
          startdate: '',
          enddate: '',
          deviceid: '',
          firstname: '',
          secondname: '',
          email: '',
        });
        
      })
      .catch(err => console.error('POST error:', err));
  };

  const handleDelete = async (reservationnumber: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/${reservationnumber}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok) {
        console.error('Delete failed:', data.error);
        alert(`Failed to delete reservation: ${data.error}`);
        return;
      }

      setReservations(prev =>
        prev.filter(r => r.reservationnumber !== reservationnumber)
      );
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting reservation');
    }
  };

  return (
  <div>
    <SearchBarContainer />
    <h2>Reservations</h2>
    <ul>
      {reservations.map(r => (
        <li key={r.reservationnumber}>
          #{r.reservationnumber} – {r.firstname} {r.secondname} – Matrikel: {r.matrikelnumber} – Device ID: {r.deviceid} – {r.status} – {r.startdate} to {r.enddate}
          <button onClick={() => handleDelete(r.reservationnumber)}>Delete</button>
        </li>
      ))}
    </ul>

    <h3>Add New Reservation</h3>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstname"
        placeholder="First Name"
        value={formData.firstname}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="secondname"
        placeholder="Last Name"
        value={formData.secondname}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="matrikelnumber"
        placeholder="Matrikel Number"
        value={formData.matrikelnumber || ''}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="deviceid"
        placeholder="Device ID"
        value={formData.deviceid}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="startdate"
        value={formData.startdate}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="enddate"
        value={formData.enddate}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Reservation</button>
    </form>
  </div>
);

}
