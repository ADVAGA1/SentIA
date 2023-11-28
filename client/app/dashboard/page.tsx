import { Audio } from "@/app/types";
import AudioCard from "./AudioCard";

import AudioCreate from "@/app/audio/upload/page"

export default async function Dashboard() {
    const res = await fetch("http://127.0.0.1:5000/api/audio", { cache: 'no-store' });
    const audioList: Audio[] = await res.json();

    return (
        <div className="mx-6">
            <p className="pl-6 pb-4 text-2xl">Your saved audios</p>
            <div>
                {audioList.map(element => {
                    return <AudioCard key={element.id} audio={element} />;
                })}
            </div>
        </div>
    )
};