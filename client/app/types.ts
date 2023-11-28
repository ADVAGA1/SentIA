export type Audio = {
    id: number
    label: string
    client_id: number
    state: "Pending" | "Finished"
    audio_file: string
    result: string
};
