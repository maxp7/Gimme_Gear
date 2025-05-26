import { useNavigate } from "react-router-dom";

type CategorieProps = {
  imgSrc: string;
  altText?: string;
  categoryName: string;
};

export default function Categorie({ imgSrc, altText = "Categorie", categoryName }: CategorieProps) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/${categoryName}`)} >
      <img src={imgSrc} alt={altText} className="w-[345px] cursor-pointer"/>
    </div>
  );
}
