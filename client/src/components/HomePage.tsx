import AdminLogin from "./AdminLogin";
import Cart from "./Cart";
import Categorie from "./Categorie";
import SearchBarContainer from "./SearchBarContainer";
export default function HomePage() {


  return (
    <>
    <AdminLogin />
    <Cart />
  <SearchBarContainer/>
      <div className="flex items-center justify-center min-h-screen">
  <div className="w-[700px] grid grid-cols-2 grid-rows-2 gap-4">
    <Categorie
      imgSrc="/laptop.svg"
      altText="Laptops"
      categoryName="Laptops"
    />
     <Categorie
      imgSrc="/vr.svg"
      altText="VR Headsets"
      categoryName="VR Headsets"
    />
     <Categorie
      imgSrc="/equipment.svg"
      altText="Equipment"
      categoryName="Equipment"
    />
     <Categorie
      imgSrc="/audio.svg"
      altText="Audio & Lighting"
      categoryName="Audio & Lighting"
    />
  </div>
</div>
    </>
  );
}
