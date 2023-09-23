from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import librosa
import torch

import numpy as np
from transformers import pipeline

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_audio():
    audio = request.files['audio']
    audio_data = audio.read()
    with open('temp_audio.wav', 'wb') as temp_file:
        temp_file.write(audio_data)

    # Read the audio file using soundfile
    audio_np, sample_rate = librosa.load(io.BytesIO(audio_data), sr=None)
    device = "cuda:0" if torch.cuda.is_available() else "cpu"
    transcribe = pipeline(task="automatic-speech-recognition", model="vasista22/whisper-kannada-tiny", chunk_length_s=30, device=device)
    transcription = transcribe(audio_np)["text"]
    print(transcription)




    
    
    return jsonify({'message': transcription})

if __name__ == '__main__':
    app.run(debug=True)
