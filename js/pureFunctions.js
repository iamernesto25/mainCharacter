// Pure Functions for Text Analysis
// These functions are isolated from the DOM and side effects for better testability

// Configuration Settings
export const config = {
  initialShowCount: 5,
  wordsPerMinute: 200 
};

// Utility Functions
export function formatNumber(num) {
  return num.toString().padStart(2, "0");
}

// Text Analysis Core Functions
export function calculateCharCount(text, excludeSpaces) {
  return excludeSpaces ? text.replace(/\s/g, "").length : text.length;
}

export function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean);
}

export function countSentences(text) {
  return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
}

// Reading Time Functions
export function calculateReadingTime(wordCount) {
  const minutes = wordCount / config.wordsPerMinute;
  
  let readingTimeText;
  if (wordCount === 0 || minutes < 1) {
    readingTimeText = "<1 min";
  } else if (minutes < 1.5) {
    readingTimeText = "1 min";
  } else {
    readingTimeText = `${Math.round(minutes)} mins`;
  }
  
  return readingTimeText;
}

// Letter Density Functions
export function generateFrequencyMap(letters) {
  return letters.reduce((acc, letter) => {
    acc[letter] = (acc[letter] || 0) + 1;
    return acc;
  }, {});
}

export function calculateLetterFrequency(text) {
  const characters = text.replace(/\s/g, "").split("");
  const totalCharacters = characters.length;
  
  if (totalCharacters === 0) {
    return { 
      totalCharacters: 0, 
      characterMap: {},
      sortedCharacters: [] 
    };
  }
  
  // Count each character individually
  const characterMap = characters.reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});
  
  // Convert to array and sort by frequency
  const sortedCharacters = Object.entries(characterMap)
    .sort((a, b) => b[1] - a[1])
    .map(([char, count]) => [char, count]);
  
  return { totalCharacters, characterMap, sortedCharacters };
}

export function generateDensityHTML(letters, totalLetters) {
  return letters.map(([letter, count]) => {
    const percentage = ((count / totalLetters) * 100).toFixed(2);
    return `
      <div class="progress-wrapper">
        <span class="progress-label">${letter.toUpperCase()}</span>
        <div class="progress-container">
          <div
            class="progress-bar"
            style="width: ${percentage}%"
            role="progressbar"
            aria-valuenow="${percentage}"
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
        <span class="progress-percentage">${count} (${percentage}%)</span>
      </div>
    `;
  }).join("");
}

// Character Limit Functions
export function truncateExcludingSpaces(text, limit) {
  let nonSpaceCount = 0;
  let truncatedText = "";
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (!/\s/.test(char)) {
      nonSpaceCount++;
      if (nonSpaceCount > limit) break;
    }
    truncatedText += char;
  }
  
  return truncatedText;
}

export function shouldShowLimitWarning(charCount, limit) {
  const warningThreshold = Math.floor(limit * 0.9);
  return charCount >= warningThreshold && charCount < limit;
}

export function shouldShowLimitError(charCount, limit) {
  return charCount >= limit;
}

export function getMessageColor(charCount, limit) {
  if (charCount >= limit) {
    return "red";
  } else if (shouldShowLimitWarning(charCount, limit)) {
    return "orange";
  }
  return "hsl(274, 90%, 80%)";
}