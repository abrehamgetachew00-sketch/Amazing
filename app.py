from flask import Flask, jsonify, request
import sqlite3

app = Flask(__name__)
DB_NAME = "leaderboard.db"

def init_db():
    with sqlite3.connect(DB_NAME) as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS leaderboard (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player_name TEXT NOT NULL,
                score INTEGER NOT NULL
            )
        """)

@app.route('/api/leaderboard', methods=['POST'])
def save_score():
    data = request.get_json() or {}
    name = data.get("player_name", "NokiaGamer")
    final_score = data.get("score", 0)

    with sqlite3.connect(DB_NAME) as conn:
        conn.execute("INSERT INTO leaderboard (player_name, score) VALUES (?, ?)", (name, final_score))
        cursor = conn.execute("SELECT player_name, score FROM leaderboard ORDER BY score DESC LIMIT 5")
        top_scores = [{"name": row[0], "score": row[1]} for row in cursor.fetchall()]

    return jsonify({"status": "SUCCESS", "top_records": top_scores})

if __name__ == '__main__':
    init_db()
    print("Snake High-Score Pipeline listening on port 5000...")
    app.run(port=5000, debug=True)
