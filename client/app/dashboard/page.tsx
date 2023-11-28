type Audio = {
    id: number,
    client_id: number,
    state: "Pending" | "Finished",
    audio_file: string,
    result: string
};

export default async function Dashboard() {
    const res = await fetch("http://127.0.0.1:5000/api/audio", { cache: 'no-store' });
    const audioList: Audio[] = await res.json();

    return (
        <div>
            {audioList.map(element => {
                return <p key={element.id}>{element.audio_file} - {element.state}</p>;
            })}
        </div>
    )
};