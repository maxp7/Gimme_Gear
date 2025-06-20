import React, { useEffect, useState } from "react";
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
type CartItem = {
  deviceid: string;
  devicename: string;
  startDate?: string;
  endDate?: string;
};

type ReservationFormData = {
  firstname: string; // 👈 lowercase!
  secondname: string;
  matrikelnumber: string;
  email: string;
};

type Reservation = {
  matrikelnumber: number;
  startdate: string;
  enddate: string;
  deviceid: string;
  devicename: string; // 👈 add this
  firstname: string;
  secondname: string;
  email: string;
};



export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ReservationFormData>({
    firstname: "",
    secondname: "",
    matrikelnumber: "",
    email: "",
  });

  const loadCart = () => {
    const savedCart: CartItem[] = JSON.parse(localStorage.getItem("deviceCart") || "[]");
    setCart(savedCart);
  };

  useEffect(() => {
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const clearCart = () => {
    localStorage.removeItem("deviceCart");
    setCart([]);
  };

  const deleteFromCart = (deviceid: string) => {
    const updatedCart = cart.filter(item => item.deviceid !== deviceid);
    localStorage.setItem("deviceCart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const users = {
    firstname: formData.firstname,
    secondname: formData.secondname,
    matrikelnumber: formData.matrikelnumber,
    email: formData.email,
  };

  // First: Add user to /users
  fetch(`${API_BASE_URL}/addUsers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(users),
  })
    .then(res => res.json())
    .then(data => {
      console.log("User saved:", data);
    })
    .catch(err => console.error("User POST error:", err));

  for (const item of cart) {
    const reservation: Reservation = {
      matrikelnumber: Number(formData.matrikelnumber),
      startdate: item.startDate || '',
      enddate: item.endDate || '',
      deviceid: item.deviceid,
      devicename: item.devicename,
      firstname: formData.firstname,
      secondname: formData.secondname,
      email: formData.email,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation),
      });
      const data = await res.json();

      if (!res.ok) {
        console.error(`Failed for ${item.deviceid}:`, data.error);
      }
    } catch (err) {
      console.error(`Network error for ${item.deviceid}:`, err);
    }
  }

  console.log("All reservations submitted.");

  // After submit - clear cart and hide form
  clearCart();
  setShowForm(false);
  setFormData({
  firstname: '',
  secondname: '',
  matrikelnumber: '',
  email: '',
});

};


  if (cart.length === 0 && !showForm) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="p-4 border rounded shadow max-w-md">
      <h2 className="text-xl font-bold mb-2">Your Cart</h2>
      {cart.length > 0 && (
        <>
          <ul className="mb-4 list-disc list-inside">
            {cart.map(({ deviceid, devicename, startDate, endDate }) => (
              <li key={deviceid} className="mb-2 flex justify-between items-center">
                <div>
                  <strong>{devicename}</strong> (ID: {deviceid}) <br />
                  {startDate && endDate && (
                    <span>
                      Reservation from <em>{startDate}</em> to <em>{endDate}</em>
                    </span>
                  )}
                </div>
                <button
                  onClick={() => deleteFromCart(deviceid)}
                  className="ml-4 px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Make Reservation
            </button>
          )}
        </>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Reservation Details</h3>

          <div>
            <label className="block mb-1" htmlFor="firstname">First Name*</label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              required
              value={formData.firstname}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block mb-1" htmlFor="secondname">Second Name*</label>
            <input
              id="secondname"
              name="secondname"
              type="text"
              required
              value={formData.secondname}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block mb-1" htmlFor="matrikelnumber">Matrikel Number*</label>
            <input
              id="matrikelnumber"
              name="matrikelnumber"
              type="text"
              required
              value={formData.matrikelnumber}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block mb-1" htmlFor="email">Email*</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>

          <div>
            <h4 className="font-semibold mb-1">Devices to reserve:</h4>
            <ul className="list-disc list-inside max-h-40 overflow-auto border p-2 rounded bg-white">
              {cart.map(({ deviceid, devicename, startDate, endDate }) => (
                <li key={deviceid}>
                  <strong>{devicename}</strong> (ID: {deviceid}){" "}
                  {startDate && endDate && (
                    <em>
                      from {startDate} to {endDate}
                    </em>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit Reservation
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
