from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key="YOUR_OPENAI_API_KEY")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": user_message}
            ]
        )
        bot_reply = response.choices[0].message.content
    except Exception as e:
        bot_reply = f"Error: {str(e)}"

    return jsonify({"response": bot_reply})

if __name__ == "__main__":
    app.run(debug=True)
