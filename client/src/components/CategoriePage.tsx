import { useParams } from "react-router-dom";

export default function CategoryPage() {
  const { name } = useParams();


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{name}</h1>
    </div>
  );
}
