"use client";

import { CircularProgress, Modal, NextUIProvider, useDisclosure } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import { Audio } from "@/app/types";
import AudioCard from "@/app/dashboard/AudioCard";

export default function Header() {
    const [audioList, setAudioList] = useState<Audio[]>([]);
    const [loaded, setLoaded] = useState(true);
    const [searchInput, setSearchInput] = useState("");
    const [lastSearchTerm, setLastSearchTerm] = useState("");

    const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    }

    const handleSearchClick = () => {
        if (searchInput.trim().length == 0)
            return;

        const search = searchInput.trim();
        searchTerm(search);
    }

    const searchTerm = async (term: string) => {
        setLoaded(false);

        const res = await fetch(`http://127.0.0.1:5000/api/search/${term}`, { cache: 'no-store' });
        const audioList: Audio[] = await res.json();
        setAudioList(audioList);

        setLoaded(true);
        setLastSearchTerm(term);
    }

    return (
        <NextUIProvider>
            <div className="mx-6 mt-6 h-screen ">
                <div className="px-6 pb-4 flex flex-row justify-center">
                    <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="searchTerm" type="text" placeholder="Search by label or client id" onChange={handleSearchInput} />
                    <button className="bg-green-700 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded ml-4" onClick={handleSearchClick}>
                        Search
                    </button>
                </div>
                <div>
                    {
                        loaded ? (<>
                            <div className="px-6 pb-4 flex flex-row justify-between">
                                <p className="text-2xl font-semibold">Results of search: {lastSearchTerm}</p>
                            </div>
                            <div>
                                {audioList.map(element => {
                                    return <AudioCard key={element.id} audio={element} />;
                                })}
                                {audioList.length == 0 &&
                                    <p className="pl-6">There are no results for the given search term.</p>}
                            </div>
                        </>)
                            : (<div className="flex justify-center items-center"><CircularProgress size="md" aria-label="Loading.." /></div>)

                    }
                </div>
            </div>
        </NextUIProvider>
    )
}