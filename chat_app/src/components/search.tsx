import React, { useState } from "react";
import { User } from "../../../type";
import { SearchIcon } from "lucide-react";

export default function Search() {
  const [products, setProducts] = useState<User[]>([]);
  const [searchVal, setSearchVal] = useState<string>("");
  function handleSearchClick() {
    // if (searchVal === "") { setProducts(productList); return; }
    // const filterBySearch = productList.filter((item) => {
    //     if (item.toLowerCase()
    //         .includes(searchVal.toLowerCase())) { return item; }
    // })
    // setProducts(filterBySearch);
  }
  return (
    <>
      <div className="flex p-3 justify-center gap-3 bg-slate-700">
        <input
          type="text"
          className="border-2 border-black px-2 py-1 border-solid w-[85%]  "
          placeholder="Search any your friends..."
        />
        <button className="bg-blue-600 text-white p-2 rounded">
          <SearchIcon />
        </button>
      </div>
    </>
  );
}
