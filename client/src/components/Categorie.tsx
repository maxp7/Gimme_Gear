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
      <img src={imgSrc} alt={altText} className="w-[345px] cursor-pointer" onClick={() => navigate(`/${categoryName}`)} />
      <h2 className="text-center mt-[0px] text-[#555555]">{categoryName}</h2>
    </div>
  );
}
