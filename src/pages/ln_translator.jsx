import React, { useState } from "react";
import axios from "axios";
import "../assets/style/ln_translator.css";

const App = () => {
  const languages = {
    English: "en",
    Spanish: "es",
    French: "fr",
    German: "de",
    Italian: "it",
    Russian: "ru",
    Japanese: "ja",
    Korean: "ko",
    Chinese: "zh",
    Arabic: "ar",
    Bengali: "bn",
    Hindi: "hi",
    Portuguese: "pt",
  };

  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("bn");
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    if (!text.trim()) {
      setError("Please enter text to translate.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://translate.googleapis.com/translate_a/single",
        null,
        {
          params: {
            client: "gtx",
            sl: sourceLang,
            tl: targetLang,
            dt: "t",
            q: text,
          },
        }
      );

      setTranslatedText(response.data[0][0][0]); // ✅ Proper translation fixed
    } catch (err) {
      setError("Error occurred while translating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <p className="title_lan">Language Translator</p>

      <div className="language-selection">
        <div>
          <label>From:</label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
          >
            {Object.entries(languages).map(([name, code]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>To:</label>
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
          >
            {Object.entries(languages).map(([name, code]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <textarea
        className="text-input"
        placeholder="Enter text to translate..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={handleTranslate} disabled={loading}>
        {loading ? "Translating..." : "Translate"}
      </button>

      {error && <p className="error">{error}</p>}

      {translatedText && (
        <div className="result">
          <h3>Translated Text:</h3>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default App;
