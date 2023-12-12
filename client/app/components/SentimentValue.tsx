import RoundedLabel from "./RoundedLabel";

export default function SentimentValue({ valuePositive, valueNeutral, valueNegative }: { valuePositive: number, valueNeutral: number, valueNegative: number}) {
    return (
        <>
        <RoundedLabel label={valuePositive.toFixed(3) + '%'} color={"bg-green-300"} />
        <RoundedLabel label={valueNeutral.toFixed(3) + '%'} color={"bg-gray-400"} />
        <RoundedLabel label={valueNegative.toFixed(3) + '%'} color={"bg-red-400"} />
        </>
    )
}
