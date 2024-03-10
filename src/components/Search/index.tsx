import {ChangeEvent, JSX, useMemo} from "react";
import {debounce} from "../../utils";
import searchIcon from "./search.svg";

interface SearchProps {
  placeholder?: string,
  onSearch?: (value: string) => void
}

export default function Search({ placeholder = 'Search...', onSearch }: SearchProps): JSX.Element {
  const handleSearch = useMemo(() => debounce((ev: ChangeEvent) => {
    const target: HTMLInputElement = ev.target as HTMLInputElement;
    if (onSearch) onSearch(target.value)
  }), [onSearch]);
  
  return (
    <div className="w-full shadow-sm flex flex-row px-6 rounded-2xl border-[2px] border-gray bg-search">
      <input className="w-full py-5 outline-0 bg-transparent font-normal text-stone-600"
             onChange={handleSearch}
             type="text"
             placeholder={placeholder} />
      <img src={searchIcon} alt="search" />
    </div>
  )
}