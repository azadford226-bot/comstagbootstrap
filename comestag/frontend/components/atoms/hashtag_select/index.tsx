"use client";

import React, { useState, useEffect } from "react";
import { fetchDynamicData, Hashtag } from "@/lib/locations";

interface HashtagSelectProps {
  name?: string;
  value: number[];
  onChange: (selectedIds: number[]) => void;
  required?: boolean;
  label?: string;
  maxSelection?: number;
}

export default function HashtagSelect({
  name = "interests",
  value,
  onChange,
  required = false,
  label = "Interests",
  maxSelection = 20,
}: HashtagSelectProps) {
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadHashtags = async () => {
      setIsLoading(true);
      const data = await fetchDynamicData();
      setHashtags(data.hashtags);
      setIsLoading(false);
    };
    loadHashtags();
  }, []);

  const toggleHashtag = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      if (value.length < maxSelection) {
        onChange([...value, id]);
      }
    }
  };

  const filteredHashtags = hashtags.filter((hashtag) =>
    hashtag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[20px] font-semibold text-text-dark">
        {label} {required && <span>*</span>}
      </label>

      {isLoading ? (
        <div className="bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] text-text-dark">
          Loading interests...
        </div>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search interests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#e3e3e3] rounded-[10px] px-5 py-[15px] text-[15px] font-extralight text-text-dark placeholder:text-text-dark outline-none h-12"
          />

          <div className="bg-[#e3e3e3] rounded-[10px] p-3 max-h-[200px] overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {filteredHashtags.length === 0 ? (
                <p className="text-[15px] text-text-dark px-2 py-1">
                  No interests found
                </p>
              ) : (
                filteredHashtags.map((hashtag) => (
                  <button
                    key={hashtag.id}
                    type="button"
                    onClick={() => toggleHashtag(hashtag.id)}
                    className={`px-3 py-1.5 rounded-full text-[14px] transition-colors ${
                      value.includes(hashtag.id)
                        ? "bg-primary text-white"
                        : "bg-white text-text-dark hover:bg-gray-100"
                    }`}
                  >
                    #{hashtag.name}
                  </button>
                ))
              )}
            </div>
          </div>

          <p className="text-[14px] text-text-dark font-light">
            Selected: {value.length}/{maxSelection}
          </p>
        </>
      )}

      {/* Hidden input for form validation */}
      <input
        type="hidden"
        name={name}
        value={value.join(",")}
        required={required && value.length === 0}
      />
    </div>
  );
}
