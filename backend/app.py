from flask import Flask, request, jsonify
from aiagent import generate_advisory   # 👈 correct filename here

app = Flask(__name__)

@app.route("/generate-advisory", methods=["POST"])
def advisory():
    try:
        input_data = request.get_json(force=True)   # expects JSON body
        result = generate_advisory(input_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
