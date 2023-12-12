import RoundedLabel from "./RoundedLabel";

export default function SentimentValueOverall({ value }: { value: number }) {
    let percentageColor = "";
    if (value > 0.3) {
        percentageColor = "bg-green-200";
    } else if (value < 0) {
        percentageColor = "bg-red-400";
    } else {
        percentageColor = "bg-gray-400";
    }

    return (
        <RoundedLabel label={value.toFixed(3)} color={percentageColor} />
    )
}