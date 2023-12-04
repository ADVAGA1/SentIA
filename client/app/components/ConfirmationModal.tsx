"use client";

export default function AudioCard(props: { title: string, text: string, execute: () => void }) {

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <div className="mb-4 text-2xl">
                {props.title}
            </div>
            <div className="mb-4">
                {props.text}
            </div>
            <button className="bg-blue-600 hover:bg-blue-900 text-white font-bold py-2 px-4 border border-blue-700 rounded" onClick={props.execute}>
                Confirm
            </button>
        </div>
    )
}