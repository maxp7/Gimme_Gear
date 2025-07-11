import Categorie from "./Categorie";
import NavBar from "./NavBar/NavBar";
export default function HomePage() {


  return (
    <>
  <NavBar/>
      <image>
        <img className="w-[100%]" src="/images/banner.svg" alt="Italian Trulli"></img>
      </image>
      <div className="flex items-center justify-center min-h-screen">
  <div className="w-[100%] pb-4 mx-12 mt-4 grid grid-cols-4 grid-rows-4 gap-12">

    <Categorie
      imgSrc="/laptop.svg"
      altText="Laptops"
      categoryName="Laptops"
    />
     <Categorie
      imgSrc="/vr.svg"
      altText="VR-Headsets"
      categoryName="VR-Headsets"
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
