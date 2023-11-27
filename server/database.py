import sqlite3
import os
import json

con = sqlite3.connect("database.db")
cur = con.cursor()

cur.execute("""
CREATE TABLE IF NOT EXISTS Audio (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    state TEXT NOT NULL,
    audio_file TEXT NOT NULL,
    result TEXT NOT NULL
);
""")


STATE_PENDING = "Pending"
STATE_FINISHED = "Finished"


def convert(line):
    return {
        "id": line[0],
        "state": line[1],
        "audio_file": line[2],
        "result": line[3]
    }


def get_audios():
    res = cur.execute("SELECT * FROM Audio;")
    audios = res.fetchall()

    return [convert(audio) for audio in audios]


def get_audio(id: int):
    res = cur.execute(f"SELECT * FROM Audio where id={id};")
    line = res.fetchone()

    return convert(line)


def insert_audio(audio_file: str):
    data = (STATE_PENDING, audio_file, "")

    cur.execute(
        "INSERT INTO Audio (state, audio_file, result) VALUES (?, ?, ?);", data)
    con.commit()

    last_id = cur.lastrowid
    return last_id


def change_state_of(id: int, result: str):
    cur.execute(
        f"UPDATE Audio SET state=?, result=? WHERE id={id}", (STATE_FINISHED, result))
    con.commit()


if __name__ == "__main__":
    id = insert_audio("ejemplo2.wav")
    print(get_audio(id))
