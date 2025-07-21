import { useEffect, useState, useRef } from "react";
import ReservationForm from "./ReservationForm";
import { FiDelete } from "react-icons/fi";


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
  setToastMessage: (msg: string | null) => void;
};

export default function Cart({ isCartVisible, setIsCartVisible, setToastMessage }: CartProps) {

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
  window.dispatchEvent(new Event("cartUpdated"));
};

const deleteFromCart = (deviceid: string) => {
  const updatedCart = cart.filter(item => item.deviceid !== deviceid);
  localStorage.setItem("deviceCart", JSON.stringify(updatedCart));
  setCart(updatedCart);
  window.dispatchEvent(new Event("cartUpdated"));
};


  const handleFormSuccess = () => {
    clearCart();
    setShowForm(false);
    setIsCartVisible(false);
    setToastMessage("Buchung erfolgreich!\nMail checken (auch Spam)!");
  };


  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div
      ref={loginRef}
      className={`
        absolute top-[3rem] right-0 w-[320px]text-black max-h-[80vh] bg-white rounded-lg shadow-lg p-4
        transition-all duration-300 ease-out z-50
        flex flex-col
        ${isCartVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
      `}
    >
      <h2 className="text-2xl font-semibold text-black mb-3 pb-2">Warenkorb</h2>

      {!showForm && (
        <>
          <ul className="flex flex-col gap-3 flex-grow">
            {cart.length === 0 && <li className="text-gray-500">Warenkorb ist leer.</li>}

            {cart.map(({ deviceid, devicename, startDate, endDate, owner, location }) => {
              console.log('Cart item:', { deviceid, devicename, owner, location });
              const imagePath = `/images/devices/${devicename.toLowerCase().replace(/\s+/g, "-")}.svg`;

              return (
                <li key={deviceid} className="flex items-center justify-between gap-3">
                  <img
                    src={imagePath}
                    alt={devicename}
                    className="w-14 h-14 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex flex-col flex-grow">
                    <span className="font-semibold text-black text-md">{devicename}</span>
                    {startDate && endDate && (

                      <span className="text-sm text-gray-600">
                        <span className="text-sm text-gray-600">
                          <strong>Besitzer: </strong>{owner} {location && <>
                            <strong>Ort:</strong>  {location}</>}<br />
                        </span>
                        <strong>Von:{" "}</strong>
                        <time dateTime={startDate}>
                          {new Date(startDate).toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" })}
                        </time>{" "}
                        <strong className="ml-1">Bis: {" "}</strong>
                        <time dateTime={endDate}>
                          {new Date(endDate).toLocaleDateString(undefined, { day: "2-digit", month: "2-digit", year: "numeric" })}
                        </time>
                      </span>
                    )}

                  </div>
                  <button
                    onClick={() => deleteFromCart(deviceid)}
                    className="text-black hover:scale-110 hover:cursor-pointer text-xl font-semibold px-2 py-1"
                    aria-label={`Delete ${devicename} from cart`}
                  >
                    <FiDelete />
                  </button>
                </li>
              );
            })}
          </ul>

          {cart.length > 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-3 bg-black text-white hover:bg-[grey-900] hover:cursor-pointer py-2 rounded-md font-semibold transition-colors"
            >
              Buchen
            </button>
          )}
        </>
      )}

      {showForm && (
        <ReservationForm cart={cart} onSubmitSuccess={handleFormSuccess} onCancel={handleCancel} />
      )}

    </div>
  );
}
