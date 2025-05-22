    const form = document.getElementById('bookingForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const date = document.getElementById('date').value;
      const device = document.getElementById('device').value;

      const booking = { name, date, device };

      const res = await fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });

      if (res.ok) {
        console.log("✅ Booking added");
      } else {
        console.error("❌ Failed to add booking");
      }

      // Optional: show updated list
      fetch('http://localhost:3000/api/bookings')
        .then(res => res.json())
        .then(data => console.log("📦 Updated Bookings:", data));
    });