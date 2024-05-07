import { useNavigate } from "react-router-dom";
import { useSession } from "../../../contexts/session-context";

export const ProductCreatePage = () => {
  const navigate = useNavigate();
  const { session } = useSession();

  const createProduct = async () => {
    const nameInput = document.getElementById("name") as HTMLInputElement;
    const priceInput = document.getElementById("price") as HTMLInputElement;
    const stockInput = document.getElementById("stock") as HTMLInputElement;
    const categoryInput = document.querySelector(
      'input[name="category"]:checked'
    ) as HTMLInputElement;
    const descriptionInput = document.getElementById(
      "description"
    ) as HTMLInputElement;
    const imageInput = document.getElementById("image") as HTMLInputElement;

    const name: string = nameInput.value;
    const price: number = +priceInput.value;
    const stock: number = +stockInput.value;
    const category: string = categoryInput?.value || "";
    if (category === "") {
      alert("카테고리를 선택하세요.");
    }
    const description: string = descriptionInput.value;
    const image: string = imageInput.value;

    if (session.user) {
      const { token } = session.user;
      try {
        const res = await fetch("http://localhost:8080/product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "AUTH-TOKEN": token,
          },
          body: JSON.stringify({
            name,
            price,
            stock,
            category,
            description,
            image,
          }),
        });

        if (!res.ok) {
          console.error("HTTP error:", res.status, res.statusText);
          return;
        }

        alert("생성되었습니다.");
        navigate("/admin/product");
      } catch (err) {
        alert("생성 실패");
        console.error(err);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4">상품 생성</h3>

      <div className="mb-4">
        <div className="mb-2">
          <label className="block font-semibold mb-1" htmlFor="name">
            상품명
          </label>
          <input
            type="text"
            id="name"
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block font-semibold mb-1" htmlFor="price">
            가격
          </label>
          <input
            type="number"
            id="price"
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block font-semibold mb-1" htmlFor="stock">
            재고
          </label>
          <input
            type="number"
            id="stock"
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block font-semibold mb-1" htmlFor="category">
            카테고리
          </label>
          <div className="mb-2">
            {[
              "TOPS",
              "BOTTOMS",
              "DRESSES",
              "OUTERWEAR",
              "SHOES",
              "ACCESSORIES",
            ].map((categoryType) => (
              <div key={categoryType} className="mb-1">
                <input
                  type="radio"
                  id={categoryType}
                  name="category"
                  value={categoryType}
                  className="mr-2"
                  required
                />
                <label htmlFor={categoryType} className="font-medium">
                  {categoryType}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <label className="block font-semibold mb-1" htmlFor="description">
            설명
          </label>
          <input
            type="text"
            id="description"
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="mb-2">
          <label className="block font-semibold mb-1" htmlFor="image">
            이미지
          </label>
          <input
            type="text"
            id="image"
            className="border p-2 rounded w-full"
            required
          />
        </div>
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
        onClick={createProduct}
      >
        생성하기
      </button>
    </div>
  );
};
