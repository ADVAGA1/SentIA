import RoundedLabel from "./RoundedLabel";

export default function SentimentValue({ value, percentage }: { value: number, percentage: boolean}) {
    let percentageColor = "";
    if (value > 0.3) {
        percentageColor = "bg-green-200";
    } else if (value < 0.3) {
        percentageColor = "bg-red-400";
    } else {
        percentageColor = "bg-gray-400";
    }

    let percentageSimbol = "";
    if (percentage){
        value = 100 * value;
        percentageSimbol = "%";
    }

    return (
        <RoundedLabel label={value.toFixed(3) + percentageSimbol} color={percentageColor} />
    )
}