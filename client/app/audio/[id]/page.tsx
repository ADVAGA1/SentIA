"use client";

import RoundedLabel from "@/app/components/RoundedLabel";
import SentimentValue from "@/app/components/SentimentValue";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import { Audio, AudioResult, Segment } from "@/app/types";
import { CircularProgress, Modal, ModalContent, NextUIProvider, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";


function PendingAudioDetail() {
    return (
        <div className={"rounded-2xl border-sm pt-2 pb-2 px-3 w-full bg-orange-300 text-md"}>
            Audio is still being processed. When it's finished, the results will be shown here.
        </div>
    )
}

function AudioSegment({ segment }: { segment: Segment }) {
    let sentimentColor = "bg-gray-300";
    if (segment.sentiment.label == "positive") {
        sentimentColor = "bg-green-300";
    } else if (segment.sentiment.label == "negative") {
        sentimentColor = "bg-red-400";
    }

    let speakerColor = "";
    if (segment.speaker == 0) {
        speakerColor = "bg-orange-300";
    } else if (segment.speaker == 1) {
        speakerColor = "bg-purple-200";
    }

    let speakerPosition = segment.speaker == 0 ? "justify-left" : "justify-end";

    return (
        <div className={"flex flex-row " + speakerPosition}>
            <div className={"rounded-2xl border-sm pt-2 pb-2 px-3 w-fit mt-4 " + speakerColor}>
                <p className="text-md"><span className="font-semibold">Speaker:</span> {segment.speaker}</p>
                <p>{segment.text}</p>

                <br />

                <div className="flex flex-row space-x-2">
                    <RoundedLabel label={`${segment.emotion.label} - ${(segment.emotion.score * 100).toFixed(3)}%`} color={"bg-blue-200"} />
                    <RoundedLabel label={`${segment.sentiment.label} - ${segment.sentiment.score.toFixed(3)}%`} color={sentimentColor} />
                </div>
            </div>
        </div>
    )
}

function FinishedAudioDetail(props: { result: AudioResult }) {
    return (
        <>
            <div className="flex flex-row space-x-2 items-center">
                <p className="text-lg font-semibold">General audio sentiment: </p>
                <SentimentValue value={props.result.general_sentiment} />
            </div>
            {
                props.result.segments.map(segment => {
                    return <AudioSegment segment={segment} />;
                })
            }
        </>
    )
}

export default function AudioDetail({ params }: { params: { id: number } }) {
    const [audio, setAudio] = useState<Audio>();
    const [result, setResult] = useState<AudioResult>();

    const [loaded, setLoaded] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const res = await fetch(`http://127.0.0.1:5000/api/audio/${params.id}`, { cache: 'no-store' });
        const audio: Audio = await res.json();

        let result: AudioResult = { general_sentiment: 0.0, segments: [] };
        if (audio.state == "Finished") {
            result = JSON.parse(audio.result);
        }

        setAudio(audio);
        setResult(result);
        setLoaded(true);
    }

    const deleteAudio = async () => {
        if (!loaded) return;

        const formData = new FormData();
        formData.append('id', audio!.id.toString());

        try {
            await fetch('http://127.0.0.1:5000/api/audio/remove', {
                method: 'POST',
                body: formData,
            });

            window.location.replace("/dashboard");
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    return (
        <NextUIProvider>
            <div className="px-6">
                {loaded ?
                    <>
                        <div className="flex flex-row justify-between">
                            <p className="pb-4 text-2xl font-semibold">{audio!.label}</p>
                            {audio!.state == "Finished" &&
                                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-3xl" onClick={onOpen}>
                                    Delete
                                </button>
                            }
                        </div>
                        <p className="pb-4 text-lg text-gray-800">Client id: {audio!.client_id}</p>
                        {
                            audio!.state != "Finished"
                                ? <PendingAudioDetail />
                                : <FinishedAudioDetail result={result!} />
                        }
                    </>

                    : (<div className="flex justify-center items-center"><CircularProgress size="md" aria-label="Loading.." /></div>)
                }

                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        <ConfirmationModal execute={deleteAudio} title="Audio deletion" text="Are you sure you want to delete this audio?" />
                    </ModalContent>
                </Modal>
            </div>
        </NextUIProvider>
    )
}