import React, { useState, useEffect } from "react";
import "../assets/style/text.css";

const TextToVoice = () => {
  const [textInput, setTextInput] = useState(""); 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]); 
  const [isError, setIsError] = useState(false); 
  const [message, setMessage] = useState(""); 
  const [language, setLanguage] = useState("en-US"); 

  const speechSynthesis = window.speechSynthesis; 

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      } else {
        setTimeout(() => {
          setVoices(speechSynthesis.getVoices());
        }, 100);
      }
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    const detectLanguage = (text) => {
      if (text.match(/[\u0900-\u097F]/)) return "hi-IN"; 
      if (text.match(/[\u0600-\u06FF]/)) return "ar-SA"; 
      if (text.match(/[\u4e00-\u9fff]/)) return "zh-CN"; 
      if (text.match(/[\u0980-\u09FF]/)) return "bn-BD"; 
      return "en-US"; 
    };

    setLanguage(detectLanguage(textInput));
  }, [textInput]);

  const handleSpeak = () => {
    if (textInput.trim() === "") {
      setIsError(true);
      setMessage("Please enter text to convert to voice.");
      return;
    }

    setIsSpeaking(true);
    setIsError(false);

    const utterance = new SpeechSynthesisUtterance(textInput);
    let selectedVoice = voices.find((voice) => voice.lang.includes(language));

    if (!selectedVoice) {
      if (language === "bn-BD") {
        selectedVoice = voices.find((voice) => voice.lang.includes("hi-IN")); // Use Hindi voice for Bengali
      } else if (language === "ar-SA") {
        selectedVoice = voices.find((voice) => voice.lang.includes("ar"));
        if (!selectedVoice) {
          selectedVoice = voices.find((voice) => voice.lang.includes("en-US")); // Fallback to English
        }
      }
    }

    utterance.voice = selectedVoice || voices[0];

    utterance.onend = () => {
      setIsSpeaking(false);
      setMessage("Speech finished.");
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsError(true);
      setMessage("Error occurred during speech synthesis.");
    };

    speechSynthesis.speak(utterance);
  };

  return (
    <div className="text-to-voice-container">
      <p className="title_text">Text to Voice Converter</p>
      <p className="auto_select_ln">Language will be auto-detected based on your input.</p>

      <textarea
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        placeholder="Enter text to convert to voice"
        className="text-input"
        disabled={isSpeaking}
      ></textarea>

      <button onClick={handleSpeak} disabled={isSpeaking} className="voice-button">
        {isSpeaking ? "🗣️ Speaking..." : "🔊 Convert to Voice"}
      </button>

      {isError && <p className="error-message">{message}</p>}
      {!isError && message && <p className="success-message">{message}</p>}
    </div>
  );
};

export default TextToVoice;
