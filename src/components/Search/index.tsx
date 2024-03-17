import { FC, JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../hooks";
import { Form, Input } from "../../components";
import { FEED_PATH, PROFILE_PAGE } from "../../router";

import searchIcon from "./assets/search.svg";
import { InputType } from "../../types/enum";

interface SearchProps {
  value?: string
}

const Search: FC<SearchProps> = ({ value }: SearchProps): JSX.Element => {
  const navigate = useNavigate();
  const [ searchValue, setSearchValue ] = useState<string|undefined>();
  
  const { clearPosts } = useAppContext();
  
  const handleSubmit = () => {
    clearPosts();
    if (searchValue && searchValue.length > 0) {
      navigate(PROFILE_PAGE.replace(":address", searchValue));
    } else {
      navigate(FEED_PATH);
    }
  }
  
  return (
    <Form className="w-full shadow-sm flex flex-row px-6 rounded-2xl border-[2px] border-gray bg-search"
          onSubmit={handleSubmit}>
      <Input className="w-full py-5 outline-0 outline-none bg-transparent font-normal text-stone-600"
             type={InputType.text}
             onChange={setSearchValue}
             value={value}
             placeholder="Search..."
      />
      <img src={searchIcon} alt="search" className="max-w-[20px]" />
    </Form>
  )
}

export default Search;