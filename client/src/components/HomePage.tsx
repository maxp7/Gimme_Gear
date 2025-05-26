import Categorie from "./Categorie";
export default function HomePage() {


  return (
    <>
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
    </>
  );
}
