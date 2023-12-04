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
        label TEXT NOT NULL,
        client_id INTEGER NOT NULL,
        state TEXT NOT NULL,
        audio_file TEXT NOT NULL,
        result TEXT NOT NULL
    );
    """)
    con.commit()

@database_func
def remove(con, cur, id: int):
    cur.execute(f"""
    DELETE FROM Audio WHERE id = {id};
    """)
    con.commit()

def convert(line):
    return {
        "id": line[0],
        "label": line[1],
        "client_id": line[2],
        "state": line[3],
        "audio_file": line[4],
        "result": line[5]
    }


@database_func
def get_audios(con, cur):
    res = cur.execute("SELECT * FROM Audio;")
    audios = res.fetchall()

    return [convert(audio) for audio in audios]


@database_func
def get_audio(con, cur, id: int):
    res = cur.execute(f"SELECT * FROM Audio where id={id};")
    line = res.fetchone()

    return convert(line)


@database_func
def insert_audio(con, cur, audio_file: str, label: str, client_id: int):
    data = (label, client_id, STATE_PENDING, audio_file, "")

    print(data)

    cur.execute(
        "INSERT INTO Audio (label, client_id, state, audio_file, result) VALUES (?, ?, ?, ?, ?);", data)
    con.commit()

    last_id = cur.lastrowid
    return last_id


@database_func
def change_state_of(con, cur, id: int, result: str):
    cur.execute(
        f"UPDATE Audio SET state=?, result=? WHERE id={id}", (STATE_FINISHED, result))
    con.commit()


if __name__ == "__main__":
    setup()
    id = insert_audio("ejemplo2.wav","maricon",33)
    print(get_audios())
    remove(id)
    print("removed")
    print(get_audios())
