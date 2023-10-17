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

    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    transcribe = pipeline(
        task="automatic-speech-recognition",
        model="vasista22/whisper-kannada-base",
        chunk_length_s=30,
        device=device,
    )
    transcribe.model.config.forced_decoder_ids = (
        transcribe.tokenizer.get_decoder_prompt_ids(language="kn", task="transcribe")
    )
    transcription = transcribe("temp_audio.wav")["text"]
    print(transcription)

    return jsonify({"transcription": transcription})


if __name__ == "__main__":
    app.run(debug=True)
