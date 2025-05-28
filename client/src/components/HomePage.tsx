import Categorie from "./Categorie";
import SearchBarContainer from "./SearchBarContainer";
export default function HomePage() {


  return (
    <>
  <SearchBarContainer/>
      <div className="flex items-center justify-center min-h-screen">
  <div className="w-[700px] grid grid-cols-2 grid-rows-2 gap-4">
    <Categorie
      imgSrc="/laptop.jpg"
      altText="Laptops"
      categoryName="Laptops"
    />
    <Categorie
      imgSrc="/vr.jpg"
      altText="VR Headsets"
      categoryName="VR Headsets"
    />
  </div>
</div>
    </>
  );
}
