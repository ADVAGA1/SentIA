export default function RoundedLabel({ label, color }: { label: string, color: string }) {
    return (
        <div className={"rounded-2xl border-sm pt-2 pb-2 px-3 w-fit" + " " + color}>
            {label}
        </div>
    )
}