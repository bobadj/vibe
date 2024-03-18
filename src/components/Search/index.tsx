import { FC, JSX } from "react";
import { Input } from "../../components";

import searchIcon from "./assets/search.svg";
import { InputType } from "../../types/enum";

interface SearchProps {
  value?: string,
  onChange?: (value: string) => void
}

const Search: FC<SearchProps> = ({ value, onChange }: SearchProps): JSX.Element => {
  const handleChange = (value: string) => {
    if (onChange) onChange(value);
  }
  
  return (
    <div className="w-full shadow-sm flex flex-row px-6 rounded-2xl border-[2px] border-gray bg-search">
      <Input className="w-full py-5 outline-0 outline-none bg-transparent font-normal text-stone-600"
             type={InputType.text}
             value={value}
             onChange={handleChange}
             placeholder="Search..."
      />
      <img src={searchIcon} alt="search" className="max-w-[20px]" />
    </div>
  )
}

export default Search;