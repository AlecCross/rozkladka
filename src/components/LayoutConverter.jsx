import React, { useState, useRef } from 'react';
import styles from '../styles/LayoutConverter.module.css'; // Імпорт стилів

const ukrainianToEnglishMap = {
  'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p', 'х': '[', 'ї': ']',
  'ф': 'a', 'і': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k', 'д': 'l', 'ж': ';', 'є': "'",
  'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm', 'б': ',', 'ю': '.', '.': '/',
  'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P', 'Х': '{', 'Ї': '}',
  'Ф': 'A', 'І': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K', 'Д': 'L', 'Ж': ':', 'Є': '"',
  'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'M', 'Б': '<', 'Ю': '>', ',': '?',
};

const englishToUkrainianMap = {};
for (const ukrainianChar in ukrainianToEnglishMap) {
  const englishChar = ukrainianToEnglishMap[ukrainianChar];
  englishToUkrainianMap[englishChar] = ukrainianChar;
}

function convertLayout(text, isUkrainianToEnglish) {
  let result = '';
  const map = isUkrainianToEnglish ? ukrainianToEnglishMap : englishToUkrainianMap;

  for (const char of text) {
    result += map[char] || char;
  }

  return result;
}

export default function LayoutConverter() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isUkrainianToEnglish, setIsUkrainianToEnglish] = useState(false);
  const outputTextAreaRef = useRef(null);

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setInputText(newText);
    setOutputText(convertLayout(newText, isUkrainianToEnglish));
  };

  const handleCopy = () => {
    if (outputTextAreaRef.current) {
      outputTextAreaRef.current.select();
      document.execCommand('copy');
    }
  };
  const handlePaste = async () => { // Додаємо функцію для вставки
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      setOutputText(convertLayout(text, isUkrainianToEnglish));
    } catch (err) {
      console.error('Failed to paste: ', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.languageSwitch}> {/* Додаємо контейнер для перемикання мов */}
        <label>
          <input
            type="checkbox"
            checked={isUkrainianToEnglish}
            onChange={() => setIsUkrainianToEnglish(!isUkrainianToEnglish)}
          />
          {isUkrainianToEnglish ? 'Англійська → Українська' : 'Українська → Англійська'} {/* Змінюємо назви мов */}
        </label>
      </div>
      <button onClick={handlePaste} className={styles.button}>Вставити</button> {/* Додаємо кнопку "Вставити" */}
      <textarea
        value={inputText}
        onChange={handleInputChange}
        placeholder="Додайте ваш текст у перше текстове поле"
        className={styles.textarea}
      />
      <div className={styles.buttons}>
        <button
          onClick={handleCopy}
          className={styles.button}
          disabled={!outputText}
        >
          Копіювати
        </button>
      </div>
      <textarea
        ref={outputTextAreaRef}
        value={outputText}
        readOnly
        placeholder="Результат"
        className={styles.textarea}
      />
    </div>
  );
}
