document.addEventListener("DOMContentLoaded", () => {
  // Text Analyzer Application
  const TextAnalyzer = (() => {
    // DOM Elements
    const elements = {
      textarea: document.getElementById("text"),
      excludeSpacesCheckbox: document.getElementById("exclude-spaces"),
      characterLimitCheckbox: document.getElementById("character-limit"),
      characterLimitInput: document.getElementById("character-limit-value"),
      totalCharElem: document.querySelector(".card_one .stat-number"),
      wordCountElem: document.querySelector(".card_two .stat-number"),
      sentenceCountElem: document.querySelector(".card_three .stat-number"),
      letterDensityContainer: document.querySelector(".letter-density"),
      noDataMessage: document.querySelector(".letter-density .no-data-message"),
      seeMoreButton: document.querySelector(".see"),
      textInputContainer: document.querySelector(".text-input-container"),
      limitErrorElem: document.getElementById("limit-error"),
      readingTimeElem: document.getElementById("reading-time")
    };

    // Configuration Settings
    const config = {
      defaultCharLimit: 280,
      initialShowCount: 5,
      wordsPerMinute: 225 // Average adult reading speed
    };
    
    // Core Functions
    
    function init() {
      initializeEventListeners();
      updateAnalysis();
    }
    
    function initializeEventListeners() {
      elements.textarea.addEventListener("input", handleTextInput);
      
      elements.excludeSpacesCheckbox.addEventListener("change", () => {
        updateAnalysis();
        checkCharacterLimit();
      });

      elements.characterLimitCheckbox.addEventListener("change", () => {
        toggleCharacterLimitInput();
        checkCharacterLimit();
      });

      elements.characterLimitInput.addEventListener("input", checkCharacterLimit);
      elements.characterLimitInput.addEventListener("change", checkCharacterLimit);
    }
    
    function handleTextInput() {
      const text = elements.textarea.value;
      const excludeSpaces = elements.excludeSpacesCheckbox.checked;
      const limit = getCharacterLimit();
      
      if (elements.characterLimitCheckbox.checked) {
        enforceCharacterLimit(text, limit, excludeSpaces);
      }
      
      updateAnalysis();
      checkCharacterLimit();
    }
    
    // Character Count & Limit Functions
    
    function calculateCharCount(text, excludeSpaces) {
      return excludeSpaces ? text.replace(/\s/g, "").length : text.length;
    }
    
    function getCharacterLimit() {
      return elements.characterLimitCheckbox.checked 
        ? (parseInt(elements.characterLimitInput.value) || config.defaultCharLimit) 
        : Infinity;
    }
    
    function enforceCharacterLimit(text, limit, excludeSpaces) {
      const charCount = calculateCharCount(text, excludeSpaces);
      
      if (charCount > limit) {
        showLimitError(limit);
        excludeSpaces 
          ? truncateExcludingSpaces(text, limit)
          : elements.textarea.value = text.substring(0, limit);
      }
    }
    
    function truncateExcludingSpaces(text, limit) {
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
      
      if (truncatedText !== text) {
        elements.textarea.value = truncatedText;
      }
    }
    
    function toggleCharacterLimitInput() {
      if (elements.characterLimitCheckbox.checked) {
        elements.characterLimitInput.style.display = "inline-block";
      } else {
        elements.characterLimitInput.style.display = "none";
        hideLimitError();
      }
    }
    
    function checkCharacterLimit() {
      if (!elements.characterLimitCheckbox.checked) {
        hideLimitError();
        return;
      }
      
      const text = elements.textarea.value;
      const limit = getCharacterLimit();
      const excludeSpaces = elements.excludeSpacesCheckbox.checked;
      const charCount = calculateCharCount(text, excludeSpaces);
      
      updateErrorMessage(limit);
      
      charCount >= limit ? showLimitError(limit) : hideLimitError();
    }
    
    // Error Handling Functions
    
    function updateErrorMessage(limit) {
      elements.limitErrorElem.innerHTML = `<span class="warning-icon"><img src="./images/info-circle.svg" alt=""></span> Limit reached! Your text exceeds the ${limit} characters.`;
    }
    
    function showLimitError(limit) {
      updateErrorMessage(limit);
      elements.limitErrorElem.style.display = "flex";
      elements.textarea.style.outline = "2px solid red";
    }
    
    function hideLimitError() {
      elements.limitErrorElem.style.display = "none";
      elements.textarea.style.outline = "";
    }
    
    // Text Analysis Functions
    
    function updateAnalysis() {
      const text = elements.textarea.value;
      const excludeSpaces = elements.excludeSpacesCheckbox.checked;
      
      const charCount = calculateCharCount(text, excludeSpaces);
      elements.totalCharElem.textContent = formatNumber(charCount);
      
      const words = countWords(text);
      elements.wordCountElem.textContent = formatNumber(words.length);
      
      const sentences = countSentences(text);
      elements.sentenceCountElem.textContent = formatNumber(sentences.length);
      
      updateReadingTime(words.length);
      updateLetterDensity(text);
    }
    
    function countWords(text) {
      return text.trim().split(/\s+/).filter(Boolean);
    }
    
    function countSentences(text) {
      return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    }
    
    function formatNumber(num) {
      return num.toString().padStart(2, "0");
    }
    
    // Reading Time Functions
    
    function updateReadingTime(wordCount) {
      const minutes = wordCount / config.wordsPerMinute;
      
      let readingTimeText;
      if (wordCount === 0) {
        readingTimeText = "<1 min";
      } else if (minutes < 1) {
        readingTimeText = "<1 min";
      } else if (minutes < 1.5) {
        readingTimeText = "1 min";
      } else {
        readingTimeText = `${Math.round(minutes)} mins`;
      }
      
      elements.readingTimeElem.textContent = `Approx. reading time: ${readingTimeText}`;
    }
    
    // Letter Density Functions
    
    function updateLetterDensity(text) {
      const letters = text.toLowerCase().replace(/[^a-z]/g, "").split("");
      const totalLetters = letters.length;
      
      clearLetterDensityContent();
      
      if (totalLetters === 0) {
        showNoDataMessage();
        return;
      }
      
      hideNoDataMessage();
      displayLetterFrequency(letters, totalLetters);
    }
    
    function clearLetterDensityContent() {
      elements.letterDensityContainer.querySelectorAll(".progress-wrapper, .remaining-letters")
        .forEach(el => el.remove());
    }
    
    function showNoDataMessage() {
      elements.noDataMessage.style.display = "block";
      elements.seeMoreButton.style.display = "none";
    }
    
    function hideNoDataMessage() {
      elements.noDataMessage.style.display = "none";
    }
    
    function displayLetterFrequency(letters, totalLetters) {
      const frequencyMap = generateFrequencyMap(letters);
      const sortedLetters = Object.entries(frequencyMap).sort((a, b) => b[1] - a[1]);
      
      const initialLetters = sortedLetters.slice(0, config.initialShowCount);
      const remainingLetters = sortedLetters.slice(config.initialShowCount);
      
      const initialHTML = generateDensityHTML(initialLetters, totalLetters);
      elements.letterDensityContainer.insertAdjacentHTML("beforeend", initialHTML);
      
      setupSeeMoreFunctionality(remainingLetters, totalLetters);
    }
    
    function generateFrequencyMap(letters) {
      return letters.reduce((acc, letter) => {
        acc[letter] = (acc[letter] || 0) + 1;
        return acc;
      }, {});
    }
    
    function generateDensityHTML(letters, totalLetters) {
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
    
    function setupSeeMoreFunctionality(remainingLetters, totalLetters) {
      if (remainingLetters.length > 0) {
        const remainingHTML = `<div class="remaining-letters" style="display: none;">${generateDensityHTML(remainingLetters, totalLetters)}</div>`;
        elements.letterDensityContainer.insertAdjacentHTML("beforeend", remainingHTML);
        
        configureSeeMoreButton();
      } else {
        elements.seeMoreButton.style.display = "none";
      }
    }
    
    function configureSeeMoreButton() {
      elements.seeMoreButton.style.display = "flex";
      const seeMoreText = elements.seeMoreButton.querySelector("p");
      const seeMoreArrow = elements.seeMoreButton.querySelector("span");
      seeMoreText.textContent = "See more";
      seeMoreArrow.innerHTML = "&gt;";
      
      // Clone to remove existing listeners
      const newButton = elements.seeMoreButton.cloneNode(true);
      elements.seeMoreButton.parentNode.replaceChild(newButton, elements.seeMoreButton);
      elements.seeMoreButton = newButton;
      
      // Add toggle functionality
      newButton.addEventListener("click", toggleRemainingLetters);
    }
    
    function toggleRemainingLetters() {
      const remainingContainer = elements.letterDensityContainer.querySelector(".remaining-letters");
      const seeMoreText = elements.seeMoreButton.querySelector("p");
      const seeMoreArrow = elements.seeMoreButton.querySelector("span");
      
      const isExpanded = remainingContainer.style.display !== "none";
      
      remainingContainer.style.display = isExpanded ? "none" : "block";
      seeMoreText.textContent = isExpanded ? "See more" : "See less";
      seeMoreArrow.innerHTML = isExpanded ? "&gt;" : "&lt;";
    }
    
    // Public API
    return {
      init
    };
  })();

  // Initialize the application
  TextAnalyzer.init();
});
  