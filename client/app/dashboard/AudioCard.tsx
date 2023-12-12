"use client";

import { Audio, AudioResult } from "@/app/types";
import SentimentValueOverall from "../components/SentimentValueOverall";

export default function AudioCard({ audio }: { audio: Audio }) {
    let score = [0,0,0];
    if (audio.state == "Finished") {
        const res: AudioResult = JSON.parse(audio.result);
        score = res.general_sentiment
    }

    return (
        <div className="rounded-xl border-2 p-2 mx-4 p-4 mb-4 bg-gray-200">
            {/* <div className="flex flex-row justify-between mx-4 items-center"> */}
            <div className="grid grid-cols-4 mx-4 items-center">
                <div className="font-bold flex flex-row justify-left">
                    {audio.label}
                </div>
                <div className="flex flex-row justify-center">
                    {audio.state == "Finished" && <SentimentValueOverall value={score[3]}/>}
                </div>
                <div className="flex flex-row justify-center">
                    {audio.state}
                </div>
                <div className="flex justify-end mr-2">
                    <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" href={"/audio/" + audio.id}>
                        Open
                    </a>
                </div>
            </div>
        </div>
    )
}