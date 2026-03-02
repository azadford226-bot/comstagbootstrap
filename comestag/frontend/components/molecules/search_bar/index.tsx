import Button from "@/components/atoms/button";
import React from "react";

function SearchBar() {
  return (
    <>
      <div className="relative max-w-[589px] mx-auto mb-12 md:mb-[92px]">
        <div className="bg-[rgba(217,217,217,0.07)] rounded-[18px] h-[55px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center justify-between px-4 gap-2 md:gap-4">
          <div className="w-[18px] h-[18px] shrink-0">
            <svg
              className="w-full h-full text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="search organizations, posts or categories"
            className="bg-transparent text-white text-sm md:text-[14px] font-light placeholder-white flex-1 outline-none placeholder:text-center min-w-0"
          />
          <div className="shrink-0">
            <Button type="secondary">Search</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchBar;
