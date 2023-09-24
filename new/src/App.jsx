import { useState } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import "./App.css";

const App = () => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [txt, setTxt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAudioUpload = () => {
    if (!audioBlob) {
      console.error("No audio to upload.");
      return;
    }
    setLoading(true);
    const audioData = new FormData();
    audioData.append("audio", audioBlob);

    fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: audioData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Audio uploaded successfully:", data);
        setTxt(data["transcription"]);
      })
      .catch((error) => {
        console.error("Error uploading audio:", error);
      })
      .finally(() => {
        setLoading(false); // Hide loader
      });
  };

  const addAudioElement = (blob) => {
    console.log("Recording complete. Blob:", blob);
    setAudioBlob(blob);
  };

  return (
    <div className="container">
      <h1 className="heading">Kannada Audio Transcription Tool</h1>
      <div className="audio-container">
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
      </div>
      {!loading && <button onClick={handleAudioUpload}>Upload Audio</button>}
      {loading && <div className="loader">Transcribing...</div>}
      {txt && <div className="transcription">{txt}</div>}
    </div>
  );
};

export default App;
