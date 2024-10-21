from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, date

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

attendance_data = {}

@app.route('/mark_attendance', methods=['POST'])
def mark_attendance():
    data = request.json
    name = data.get('name')
    if name:
        today = date.today().isoformat()
        if name in attendance_data and attendance_data[name].split()[0] == today:
            return jsonify({"status": "info", "message": f"Attendance already marked for {name} today"}), 200
        now = datetime.now()
        attendance_data[name] = now.strftime('%Y-%m-%d %H:%M:%S')
        return jsonify({"status": "success", "message": f"Attendance marked for {name}"}), 200
    return jsonify({"status": "error", "message": "No name provided"}), 400

@app.route('/get_attendance', methods=['GET'])
def get_attendance():
    return jsonify(attendance_data)

if __name__ == '__main__':
    app.run(debug=True, port=8000, host='0.0.0.0')