import { useNavigate } from "react-router-dom";

type CategorieProps = {
  imgSrc: string;
  altText?: string;
  categoryName: string;
};

export default function Categorie({ imgSrc, altText = "Categorie", categoryName }: CategorieProps) {
  const navigate = useNavigate();

  return (
    
    <div>
      <img src={imgSrc} alt={altText} className="w-[700px] py-6 cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-110" onClick={() => navigate(`/${categoryName}`)} />
      <h2 className="relative bottom-10 text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[black] text-shadow-sm">{categoryName}</h2>
    </div>
  );
}
