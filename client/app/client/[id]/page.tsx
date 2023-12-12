"use client";

import SentimentValueOverall from "@/app/components/SentimentValueOverall";
import { Audio, AudioResult } from "@/app/types";
import { Chart } from "chart.js";
import { useEffect, useState } from "react";

export default function AudioDetail({ params }: { params: { id: number } }) {
    const [averageSentiment, setAverageSentiment] = useState(0.0);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const res = await fetch(`http://127.0.0.1:5000/api/client/${params.id}`, { cache: 'no-store' });
        const audios: Audio[] = await res.json();

        audios.sort(function (a: Audio, b: Audio) {
            return (+a.date) - (+b.date);
        });

        let names: string[] = []
        let results: AudioResult[] = []
        for (let audio of audios) {
            if (audio.state == "Pending") {
                continue;
            }

            console.log(audio.result)
            const result: AudioResult = await JSON.parse(audio.result);
            results.push(result);
            names.push(audio.label)
        }

        let data: number[] = []
        for (const result of results) {
            data.push(result.general_sentiment[3]);
        }

        const avg = data.reduce((a, b) => a + b) / data.length;
        setAverageSentiment(avg)

        var ctx = document.getElementById('clientIdChart')!.getContext('2d');
        var clientIdChart = new Chart(ctx, {
            type: 'line',
            options: { layout: { padding: 10 } },
            data: {
                labels: names,
                datasets: [{
                    label: "Sentiment",
                    data: data,
                    borderColor: "#3e95cd",
                    backgroundColor: "#7bb6dd",
                    fill: false,
                }]
            },
        });
    }

    return (
        <div className="px-6">
            <p className="pb-4 text-2xl font-semibold">History results of client {params.id}</p>
            <div className="flex flex-row space-x-4 items-center">
                <p className="text-lg font-semibold">Average client sentiment:</p>
                <SentimentValueOverall value={averageSentiment} />
            </div>
            <div className="w-[1100px] h-screen flex mx-auto mt-8">
                <div className='border border-gray-400 pt-0 rounded-xl w-full h-fit shadow-xl'>
                    <canvas id='clientIdChart'></canvas>
                </div>
            </div>
        </div>
    )
}