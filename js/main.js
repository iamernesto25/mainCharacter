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
      wordsPerMinute: 200 // Average adult reading speed
    };

    // Utility Functions
    function formatNumber(num) {
      return num.toString().padStart(2, "0");
    }

    // Error Handling Functions
    function updateErrorMessage(limit, charCount, isApproaching = false) {
      if (charCount < Math.floor(limit * 0.9)) {
        elements.limitErrorElem.innerHTML = `<span class="warning-icon"><img src="./images/info-circle.svg" alt=""></span> Character count: ${charCount}/${limit}`;
        elements.limitErrorElem.style.color = "hsl(274, 90%, 80%)";
      } else if (isApproaching) {
        elements.limitErrorElem.innerHTML = `<span class="warning-icon"><img src="./images/info-circle.svg" alt=""></span> Approaching limit! ${charCount}/${limit} characters.`;
        elements.limitErrorElem.style.color = "orange";
      } else {
        elements.limitErrorElem.innerHTML = `<span class="warning-icon"><img src="./images/info-circle.svg" alt=""></span> Limit reached! ${charCount}/${limit} characters.`;
        elements.limitErrorElem.style.color = "red";
      }
    }

    function showLimitError(limit, charCount, isApproaching = false) {
      updateErrorMessage(limit, charCount, isApproaching);
      elements.limitErrorElem.style.display = "flex";
      if (charCount >= limit) {
        elements.textarea.style.outline = "2px solid red";
      } else {
        elements.textarea.style.outline = "";
      }
    }

    function hideLimitError() {
      elements.limitErrorElem.style.display = "none";
      elements.textarea.style.outline = "";
    }

    // Text Analysis Core Functions
    function calculateCharCount(text, excludeSpaces) {
      return excludeSpaces ? text.replace(/\s/g, "").length : text.length;
    }

    function countWords(text) {
      return text.trim().split(/\s+/).filter(Boolean);
    }

    function countSentences(text) {
      return text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    }

    // Reading Time Functions
    function updateReadingTime(wordCount) {
      const minutes = wordCount / config.wordsPerMinute;
      
      let readingTimeText;
      if (wordCount === 0 || minutes < 1) {
        readingTimeText = "<1 min";
      } else if (minutes < 1.5) {
        readingTimeText = "1 min";
      } else {
        readingTimeText = `${Math.round(minutes)} mins`;
      }
      
      elements.readingTimeElem.textContent = `Approx. reading time: ${readingTimeText}`;
    }

    // Letter Density Functions
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

    function toggleRemainingLetters() {
      const remainingContainer = elements.letterDensityContainer.querySelector(".remaining-letters");
      const seeMoreText = elements.seeMoreButton.querySelector("p");
      const seeMoreArrow = elements.seeMoreButton.querySelector("span");
      
      const isExpanded = remainingContainer.style.display !== "none";
      
      remainingContainer.style.display = isExpanded ? "none" : "block";
      seeMoreText.textContent = isExpanded ? "See more" : "See less";
      seeMoreArrow.innerHTML = isExpanded ? "&gt;" : "&lt;";
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

    function setupSeeMoreFunctionality(remainingLetters, totalLetters) {
      if (remainingLetters.length > 0) {
        const remainingHTML = `<div class="remaining-letters" style="display: none;">${generateDensityHTML(remainingLetters, totalLetters)}</div>`;
        elements.letterDensityContainer.insertAdjacentHTML("beforeend", remainingHTML);
        
        configureSeeMoreButton();
      } else {
        elements.seeMoreButton.style.display = "none";
      }
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

    // Character Limit Functions
    function getCharacterLimit() {
      return elements.characterLimitCheckbox.checked 
        ? (parseInt(elements.characterLimitInput.value) || config.defaultCharLimit) 
        : Infinity;
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

    function enforceCharacterLimit(text, limit, excludeSpaces) {
      const charCount = calculateCharCount(text, excludeSpaces);
      
      if (charCount > limit) {
        showLimitError(limit, charCount, false);
        excludeSpaces 
          ? truncateExcludingSpaces(text, limit)
          : elements.textarea.value = text.substring(0, limit);
      }
    }

    function toggleCharacterLimitInput() {
      if (elements.characterLimitCheckbox.checked) {
        elements.characterLimitInput.style.visibility = "visible";
      } else {
        elements.characterLimitInput.style.visibility = "hidden";
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
      
      // Calculate the threshold for warning (90% of the limit)
      const warningThreshold = Math.floor(limit * 0.9);
      
      // Always show the message when character limit is enabled
      elements.limitErrorElem.style.display = "flex";
      
      if (charCount >= limit) {
        showLimitError(limit, charCount, false);
      } else if (charCount >= warningThreshold) {
        showLimitError(limit, charCount, true);
      } else {
        showLimitError(limit, charCount, false);
      }
    }

    // Main Analysis Function
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

    // Event Handler Functions
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

    // Initialization Function
    function init() {
      initializeEventListeners();
      updateAnalysis();
    }

    // Public API
    return {
      init
    };
  })();

  // Initialize the application
  TextAnalyzer.init();
});