import { Audio } from "@/app/types";

export default function AudioCard(props: { audio: Audio }) {
    const audio = props.audio;

    let score = 0.0;
    let percentageColor = "";
    if (audio.state == "Finished") {
        const jsonResult = JSON.parse(audio.result);
        score = parseFloat(jsonResult["general_sentiment"]);

        if (score > 0.5)
            percentageColor = "bg-green-200";
        else if (score < 0.5)
            percentageColor = "bg-red-400";
        else
            percentageColor = "bg-gray-400";
    }

    return (
        <div className="rounded-xl border-2 p-2 mx-4 p-4 mb-4 bg-gray-200">
            {/* <div className="flex flex-row justify-between mx-4 items-center"> */}
            <div className="grid grid-cols-4 mx-4 items-center">
                <div className="font-bold">
                    {audio.label}
                </div>
                <div className={"rounded-2xl border-sm pt-2 pb-2 px-3 w-fit" + " " + percentageColor}>
                    {audio.state == "Finished" && score.toFixed(3) + "%"}
                </div>
                <div>
                    {audio.state}
                </div>
                <div className="flex justify-end mr-2">
                    <button>GOTO</button>
                </div>
            </div>
        </div>
    )
}