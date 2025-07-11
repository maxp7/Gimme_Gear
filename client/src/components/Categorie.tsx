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
      <img src={imgSrc} alt={altText} className="w-[700px] bg-[#068347]/70 rounded-[20px] cursor-pointer" onClick={() => navigate(`/${categoryName}`)} />
      <h2 className="relative bottom-10 text-center text-2xl mt-[0px] text-[#d6d6d6]">{categoryName}</h2>
    </div>
  );
}
