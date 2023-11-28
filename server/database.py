import sqlite3
import os
import json

STATE_PENDING = "Pending"
STATE_FINISHED = "Finished"


def database_func(func):
    def wrapper(*args, **kwargs):
        con = sqlite3.connect("database.db")
        cur = con.cursor()

        res = func(con, cur, *args, **kwargs)

        cur.close()
        con.close()

        return res

    return wrapper


@database_func
def setup(con, cur):
    cur.execute("""
    CREATE TABLE IF NOT EXISTS Audio (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        client_id INTEGER NOT NULL,
        state TEXT NOT NULL,
        audio_file TEXT NOT NULL,
        result TEXT NOT NULL
    );
    """)
    con.commit()


def convert(line):
    return {
        "id": line[0],
        "client_id": line[1],
        "state": line[2],
        "audio_file": line[3],
        "result": line[4]
    }


@database_func
def get_audios(con, cur):
    res = cur.execute("SELECT * FROM Audio;")
    audios = res.fetchall()
    print(audios)

    return [convert(audio) for audio in audios]


@database_func
def get_audio(con, cur, id: int):
    res = cur.execute(f"SELECT * FROM Audio where id={id};")
    line = res.fetchone()

    return convert(line)


@database_func
def insert_audio(con, cur, audio_file: str, client_id: int):
    data = (client_id, STATE_PENDING, audio_file, "")

    print(data)

    cur.execute(
        "INSERT INTO Audio (client_id, state, audio_file, result) VALUES (?, ?, ?, ?);", data)
    con.commit()

    last_id = cur.lastrowid
    return last_id


@database_func
def change_state_of(con, cur, id: int, result: str):
    cur.execute(
        f"UPDATE Audio SET state=?, result=? WHERE id={id}", (STATE_FINISHED, result))
    con.commit()


if __name__ == "__main__":
    id = insert_audio("ejemplo2.wav")
    print(get_audio(id))
