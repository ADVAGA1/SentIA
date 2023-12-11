export type Audio = {
    id: number
    label: string
    client_id: number
    state: "Pending" | "Finished"
    audio_file: string
    result: string,
    date: Date
};

export type AudioResult = {
    general_sentiment: number
    segments: Segment[]
};

export type Segment = {
    speaker: number
    text: string
    segment: [number, number],
    sentiment: {
        label: string
        score: number
    }
    emotion: {
        label: string
        score: number
    }
};
