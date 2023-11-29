"use client";

import { Audio } from "@/app/types";
import AudioCard from "./AudioCard";
import AudioCreate from "@/app/components/UploadAudioComponent";
import { useEffect, useState } from "react";
import { Modal, ModalContent, NextUIProvider, useDisclosure, CircularProgress } from "@nextui-org/react";

export default function Dashboard() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [audioList, setAudioList] = useState<Audio[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const res = await fetch("http://127.0.0.1:5000/api/audio", { cache: 'no-store' });
        const audioList: Audio[] = await res.json();

        setAudioList(audioList);
        setLoaded(true);
    }

    return (
        <NextUIProvider>
            <div className="mx-6 mt-6 h-screen ">
                <div>
                    {
                        loaded ? (<>
                            <div className="px-6 pb-4 flex flex-row justify-between">
                                <p className="text-2xl font-semibold">Your saved audios</p>
                                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl" onClick={onOpen}>
                                    Upload
                                </button>
                            </div>
                            <div>
                                {audioList.map(element => {
                                    return <AudioCard key={element.id} audio={element} />;
                                })}
                                {audioList.length == 0 &&
                                    <p className="pl-6">There are no audios. Uploaded audios will be shown here.</p>}
                            </div>
                        </>)
                            : (<div className="flex justify-center items-center"><CircularProgress size="md" aria-label="Loading.." /></div>)

                    }
                </div>

                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        <AudioCreate />
                    </ModalContent>
                </Modal>
            </div>
        </NextUIProvider>
    )
};