import React, { useState, useEffect, useRef } from "react";
import "../assets/style/voice.css";

const VoiceToText = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const recognition = useRef(null);
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.lang = language;

      recognition.current.onresult = (event) => {
        const currentTranscript = event.results[0][0].transcript;
        setTranscript(currentTranscript);
        setIsListening(false);
      };

      recognition.current.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setTranscript("আপনার ব্রাউজার স্পিচ রিকগনিশন সমর্থন করে না।");
    }

    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices();
  }, [language]);

  const handleStart = () => {
    if (recognition.current) {
      recognition.current.lang = language;
      setIsListening(true);
      recognition.current.start();
    }
  };

  const handleSpeak = () => {
    if (transcript) {
      const speechSynthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(transcript);
      utterance.lang = language;

      let selectedVoice = voices.find((voice) => voice.lang.startsWith(language));

      // ✅ Fix: If Arabic voice is missing, use fallback
      if (!selectedVoice) {
        if (language === "ar-SA") {
          selectedVoice = voices.find((voice) => voice.lang.includes("ar")) 
                        || voices.find((voice) => voice.lang.includes("en-GB")) 
                        || voices.find((voice) => voice.lang.includes("en-US")) 
                        || voices[0]; // Fallback to English if Arabic is unavailable
        }
        if (language === "bn-BD") {
          selectedVoice = voices.find((voice) => voice.lang.includes("bn")) 
                        || voices.find((voice) => voice.lang.includes("hi")) 
                        || voices[0]; // Fallback to Hindi or Default
        }
      }

      utterance.voice = selectedVoice || voices[0];
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="voice_center_all">
      <div className="voice-to-text-container">
        <p className="title_voice">Voice to Text Converter</p>
        <select
          className="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isListening}
        >
          <option value="en-US">English (US)</option>
          <option value="bn-BD">বাংলা (Bangla)</option>
          <option value="hi-IN">हिन्दी (Hindi)</option>
          <option value="es-ES">Español (Spanish)</option>
          <option value="fr-FR">Français (French)</option>
          <option value="ar-SA">العربية (Arabic)</option>
          <option value="zh-CN">中文 (Chinese)</option>
          <option value="de-DE">Deutsch (German)</option>
        </select>
        <button onClick={handleStart} disabled={isListening} className="voice-to-text-button">
          {isListening ? "🎙️ Listening..." : "🎤 Start Speaking"}
        </button>
        {language !== "bn-BD" && !isListening && transcript && (
          <button onClick={handleSpeak} className={`text-to-voice-button ${isSpeaking ? 'speaking' : ''}`}>
            {isSpeaking ? "🗣️ Speaking..." : "🔊 Convert to Voice"}
          </button>
        )}
        <p className="voice-output-text">{transcript}</p>
      </div>
    </div>
  );
};

export default VoiceToText;
