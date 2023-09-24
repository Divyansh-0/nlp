import wave 
import numpy as np

audio_file = wave.open('temp_audio.wav', 'rb')
print("DOne")

sample_width = audio_file.getsampwidth()
frame_rate = audio_file.getframerate()
frames = audio_file.readframes(-1)
print(frames)