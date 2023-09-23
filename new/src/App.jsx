import React, { useState } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";

const App = () => {
  const [audioBlob, setAudioBlob] = useState(null);

  const handleAudioUpload = () => {
    if (!audioBlob) {
      console.error("No audio to upload.");
      return;
    }

    const audioData = new FormData();
    audioData.append("audio", audioBlob);

    fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: audioData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Audio uploaded successfully:", data);
      })
      .catch((error) => {
        console.error("Error uploading audio:", error);
      });
  };

  const addAudioElement = (blob) => {
    console.log("Recording complete. Blob:", blob);
    setAudioBlob(blob);
  };

  return (
    <>
      <h1>Audio Recorder</h1>
      <AudioRecorder
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        downloadOnSavePress={false}
        downloadFileExtension="webm"
      />
      {audioBlob && <audio controls src={URL.createObjectURL(audioBlob)} />}
      <button onClick={handleAudioUpload}>Upload Audio</button>
    </>
  );
};

export default App;
