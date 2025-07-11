import { useEffect, useState, useRef } from "react";
import ReservationForm from "./ReservationForm";

type CartItem = {
  deviceid: string;
  devicename: string;
  owner: string;
  location?: string;
  startDate?: string;
  endDate?: string;
};

type CartProps = {
  isCartVisible: boolean;
  setIsCartVisible: (visible: boolean) => void;
};

export default function Cart({ isCartVisible, setIsCartVisible }: CartProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showForm, setShowForm] = useState(false);

  const loginRef = useRef<HTMLDivElement>(null);

  const loadCart = () => {
    const savedCart: CartItem[] = JSON.parse(localStorage.getItem("deviceCart") || "[]");
    setCart(savedCart);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (loginRef.current && !loginRef.current.contains(event.target as Node)) {
        setIsCartVisible(false);
      }
    };

    if (isCartVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCartVisible, setIsCartVisible]);

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

  const handleFormSuccess = () => {
    clearCart();
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
  };


  return (
    <div
      ref={loginRef}
      className={`
    absolute flex flex-col p-4 top-[8rem] left-1/2 transform -translate-x-1/2 
    w-[60%] h-[40rem] bg-gray-600/90 p-2 shadow rounded-[20px] 
    transition-all duration-300 ease-out z-50
    ${isCartVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}
  `}
    >
      <h2 className="text-3xl font-bold m-4">Cart</h2>

      {!showForm && (
        <div className="flex flex-col flex-grow">
          <ul className="m-4 list-disc list-inside max-h-100% overflow-auto">
            {cart.map(({ deviceid, devicename, startDate, endDate, owner, location }) => {

              const imagePath = `/images/${devicename.toLowerCase().replace(/\s+/g, "")}.jpg`;
              return (
                <li key={deviceid} className="mb-2 flex justify-between">
                  <div className="flex space-x-4">
                    <img
                      src={imagePath}
                      alt={devicename}
                      className="w-26 h-26 object-cover rounded"
                    />
                    <div className="flex flex-col">
                      <strong className="text-xl">{devicename}</strong><br />
                      {startDate && endDate && (
                        <span>
                          <strong>From:</strong>{" "}
                          <em>{new Date(startDate).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}</em> <br />
                          <strong>To:</strong>{" "}
                          <em>{new Date(endDate).toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" })}</em>

                        </span>
                      )} <br />
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    Owner: {owner} <br />
                    {location && <>Location: {location}</>}
                  </div>
                  <button
                    onClick={() => deleteFromCart(deviceid)}
                    className="ml-4 px-2 h-[32px] py-1 bg-[red]/40 rounded hover:bg-[red]/80 text-sm"
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>

          {cart.length > 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-auto mb-4 px-3 py-1 bg-[#068347]/70 text-white rounded-[10px] hover:bg-[#068347]"
            >
              Make Reservation
            </button>
          )}
        </div>
      )}

      {showForm && (
        <ReservationForm cart={cart} onSubmitSuccess={handleFormSuccess} onCancel={handleCancel} />
      )}
    </div>

  );
}
