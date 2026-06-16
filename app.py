from flask import Flask, jsonify, request
import json
import os

app = Flask(__name__)
DATA_FILE = "highscores.json"

def load_scores():
    if not os.path.exists(DATA_FILE):
        return {"dev_name": "Senior Staff 10x Dev", "high_score": 12}
    with open(DATA_FILE, "r") as f:
        return json.load(f)

@app.route('/api/score', methods=['GET', 'POST'])
def manage_scores():
    current_data = load_scores()
    
    if request.method == 'POST':
        payload = request.get_json() or {}
        new_score = payload.get("score", 0)
        alias = payload.get("alias", "Anonymous Code Monkey")
        
        if new_score > current_data["high_score"]:
            current_data = {"dev_name": alias, "high_score": new_score}
            with open(DATA_FILE, "w") as f:
                json.dump(current_data, f)
            return jsonify({"status": "NEW_RECORD", "data": current_data})
            
        return jsonify({"status": "DEFEAT", "msg": "You did not beat corporate records."})

    return jsonify(current_data)

if __name__ == '__main__':
    print("Burnout Score Aggregator operational on port 5000...")
    app.run(port=5000, debug=True)
