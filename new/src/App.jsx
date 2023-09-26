import { useState, useRef } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import "./App.css";

const App = () => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [txt, setTxt] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [transcribeButtonVisible, setTranscribeButtonVisible] = useState(true);

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
        setTranscribeButtonVisible(false); // Hide Transcribe button
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

  const handleSaveText = () => {
    if (!txt) {
      console.error("No text to save.");
      return;
    }

    const element = document.createElement("a");
    const file = new Blob([txt], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "transcription.txt";
    document.body.appendChild(element);
    element.click();
    setTranscribeButtonVisible(true);
    setTxt(" ");
  };

  const handleRetranscribe = () => {
    setTxt(""); // Clear the previous transcription
    setTranscribeButtonVisible(true); // Show Transcribe button
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const audioBlobFromFile = new Blob([file], { type: "audio/*" });
      setAudioBlob(audioBlobFromFile);
    }
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
      <div className="upload-container">
        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleFileInputChange}
        />
        <button
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
        >
          Upload Audio File
        </button>
      </div>
      {transcribeButtonVisible && !loading && (
        <button onClick={handleAudioUpload}>Transcribe</button>
      )}
      {loading && <div className="loader">Transcribing...</div>}
      {txt && <div className="transcription">{txt}</div>}
      {txt && (
        <>
          <button onClick={handleSaveText} className="save-button">
            Save
          </button>
          {!transcribeButtonVisible && (
            <button
              onClick={handleRetranscribe}
              className="retranscribe-button"
            >
              Retranscribe
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default App;
