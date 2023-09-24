from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import torch


from transformers import pipeline

app = Flask(__name__)
CORS(app)


@app.route("/upload", methods=["POST"])
def upload_audio():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio = request.files["audio"]
    audio_data = audio.read()
    with open("temp_audio.wav", "wb") as temp_file:
        temp_file.write(audio_data)

    # Read the audio file using soundfile
    # audio_np, sample_rate = librosa.load(io.BytesIO(audio_data), sr=None)
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    transcribe = pipeline(
        task="automatic-speech-recognition",
        model="vasista22/whisper-kannada-tiny",
        chunk_length_s=30,
        device=device,
    )
    transcription = transcribe("temp_audio.wav")["text"]
    print(transcription)

    return jsonify({"transcription": transcription})


if __name__ == "__main__":
    app.run(debug=True)
