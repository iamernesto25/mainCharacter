// DOM Elements and UI Interactions

import * as pf from '../js/pureFunctions.js';

// Elements Collection
export const elements = {
  textarea: document.getElementById("text"),
  excludeSpacesCheckbox: document.getElementById("exclude-spaces"),
  characterLimitCheckbox: document.getElementById("character-limit"),
  characterLimitInput: document.getElementById("character-limit-value"),
  totalCharElem: document.querySelector(".card_one .stat-number"),
  totalCharLabelElem: document.getElementById("total-char-label"),
  wordCountElem: document.querySelector(".card_two .stat-number"),
  sentenceCountElem: document.querySelector(".card_three .stat-number"),
  letterDensityContainer: document.querySelector(".letter-density"),
  noDataMessage: document.querySelector(".letter-density .no-data-message"),
  seeMoreButton: document.querySelector(".see"),
  textInputContainer: document.querySelector(".text-input-container"),
  limitErrorElem: document.getElementById("limit-error"),
  readingTimeElem: document.getElementById("reading-time"),
  themeToggleButton: document.querySelector(".theme-switcher button"),
  themeToggleIcon: document.querySelector(".theme-switcher button img"),
  logo: document.querySelector(".logo-container img"),
  body: document.body
};

// Error Handling Functions
export function updateErrorMessage(limit, charCount, isApproaching = false) {
  if (!elements.limitErrorElem) return;
  
  if (charCount < Math.floor(limit * 0.9)) {
    elements.limitErrorElem.innerHTML = `<span class="warning-icon"><img src="./images/info-circle.svg" alt=""></span> Character count: ${charCount}/${limit}`;
    elements.limitErrorElem.style.color = pf.getMessageColor(charCount, limit);
  } else if (isApproaching) {
    elements.limitErrorElem.innerHTML = `<span class="warning-icon"><img src="./images/info-circle.svg" alt=""></span> Approaching limit! ${charCount}/${limit} characters.`;
    elements.limitErrorElem.style.color = pf.getMessageColor(charCount, limit);
  } else {
    elements.limitErrorElem.innerHTML = `<span class="warning-icon"><img src="./images/info-circle.svg" alt=""></span> Limit reached! ${charCount}/${limit} characters.`;
    elements.limitErrorElem.style.color = pf.getMessageColor(charCount, limit);
  }
}

export function showLimitError(limit, charCount, isApproaching = false) {
  updateErrorMessage(limit, charCount, isApproaching);
  if (!elements.limitErrorElem) return;
  
  elements.limitErrorElem.style.display = "flex";
  if (charCount >= limit) {
    elements.textarea.style.outline = "2px solid #fe8158";
    elements.textarea.style.boxShadow = "1px 1px 10px 1px #fe8158";
  } else {
    elements.textarea.style.outline = "";
    elements.textarea.style.boxShadow = "none";
  }
}

export function hideLimitError() {
  if (!elements.limitErrorElem) return;
  elements.limitErrorElem.style.display = "none";
  elements.textarea.style.outline = "";
  elements.textarea.style.boxShadow = "none";
}

// Letter Density UI Functions
export function clearLetterDensityContent() {
  if (!elements.letterDensityContainer) return;
  elements.letterDensityContainer.querySelectorAll(".progress-wrapper, .remaining-letters")
    .forEach(el => el.remove());
}

export function showNoDataMessage() {
  if (!elements.noDataMessage) return;
  elements.noDataMessage.style.display = "block";
  elements.seeMoreButton.style.display = "none";
}

export function hideNoDataMessage() {
  if (!elements.noDataMessage) return;
  elements.noDataMessage.style.display = "none";
}

export function toggleRemainingLetters() {
  const remainingContainer = elements.letterDensityContainer.querySelector(".remaining-letters");
  if (!remainingContainer) return;
  
  const seeMoreText = elements.seeMoreButton.querySelector("p");
  const seeMoreArrow = elements.seeMoreButton.querySelector("span");
  
  const isExpanded = remainingContainer.style.display !== "none";
  
  if (isExpanded) {
    // Start collapse animation
    remainingContainer.classList.remove('show-stagger');
    remainingContainer.classList.add('hide-stagger');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      remainingContainer.style.display = "none";
      remainingContainer.classList.remove('hide-stagger');
      seeMoreText.textContent = "See more";
      elements.seeMoreButton.classList.remove('expanded');
    }, 1100);
  } else {
    remainingContainer.style.display = "block";
    // Reset any existing animation classes
    remainingContainer.classList.remove('hide-stagger');
    // Start expand animation
    setTimeout(() => {
      remainingContainer.classList.add('show-stagger');
      seeMoreText.textContent = "See less";
      elements.seeMoreButton.classList.add('expanded');
    }, 50); 
  }
}

export function setupSeeMoreFunctionality(remainingLetters, totalLetters) {
  if (!elements.letterDensityContainer || !elements.seeMoreButton) return;
  
  if (remainingLetters.length > 0) {
    const remainingHTML = `<div class="remaining-letters" style="display: none;">${pf.generateDensityHTML(remainingLetters, totalLetters)}</div>`;
    elements.letterDensityContainer.insertAdjacentHTML("beforeend", remainingHTML);
    
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
  } else {
    elements.seeMoreButton.style.display = "none";
  }
}

export function displayLetterFrequency(text) {
  if (!elements.letterDensityContainer) return;

  const { totalCharacters, sortedCharacters } = pf.calculateLetterFrequency(text);
  
  clearLetterDensityContent();
  
  if (totalCharacters === 0) {
    showNoDataMessage();
    return;
  }
  
  hideNoDataMessage();
  
  const initialCharacters = sortedCharacters.slice(0, pf.config.initialShowCount);
  const remainingCharacters = sortedCharacters.slice(pf.config.initialShowCount);
  
  const initialHTML = pf.generateDensityHTML(initialCharacters, totalCharacters);
  elements.letterDensityContainer.insertAdjacentHTML("beforeend", initialHTML);
  
  setupSeeMoreFunctionality(remainingCharacters, totalCharacters);
}

// Character Limit Functions
export function getCharacterLimit() {
  if (!elements.characterLimitCheckbox || !elements.characterLimitCheckbox.checked) {
    return Infinity;
  }
  const inputValue = elements.characterLimitInput ? elements.characterLimitInput.value : "";
  return inputValue ? parseInt(inputValue) : Infinity;
}

export function enforceCharacterLimit(text, limit, excludeSpaces) {
  if (!elements.textarea) return text;
  
  const charCount = pf.calculateCharCount(text, excludeSpaces);
  
  if (charCount > limit) {
    showLimitError(limit, charCount, false);
    return excludeSpaces 
      ? pf.truncateExcludingSpaces(text, limit)
      : text.substring(0, limit);
  }
  
  return text;
}

export function toggleCharacterLimitInput() {
  if (!elements.characterLimitInput || !elements.characterLimitCheckbox) return;
  
  if (elements.characterLimitCheckbox.checked) {
    elements.characterLimitInput.style.visibility = "visible";
  } else {
    elements.characterLimitInput.style.visibility = "hidden";
    hideLimitError();
  }
}

export function checkCharacterLimit() {
  if (!elements.characterLimitCheckbox || !elements.characterLimitCheckbox.checked) {
    hideLimitError();
    return;
  }
  
  const text = elements.textarea ? elements.textarea.value : "";
  const limit = getCharacterLimit();
  
  if (limit === Infinity) {
    if (elements.limitErrorElem) elements.limitErrorElem.style.display = "none";
    return;
  }

  const excludeSpaces = elements.excludeSpacesCheckbox ? elements.excludeSpacesCheckbox.checked : false;
  const charCount = pf.calculateCharCount(text, excludeSpaces);
  
  // Always show the message when character limit is enabled and has a value
  if (elements.limitErrorElem) elements.limitErrorElem.style.display = "flex";
  
  if (pf.shouldShowLimitError(charCount, limit)) {
    showLimitError(limit, charCount, false);
  } else if (pf.shouldShowLimitWarning(charCount, limit)) {
    showLimitError(limit, charCount, true);
  } else {
    showLimitError(limit, charCount, false);
  }
}

// Theme Functions
export function setTheme(isDark) {
  if (!elements.body) return;
  
  elements.body.classList.toggle('dark-theme', isDark);
  if (elements.themeToggleIcon) {
    elements.themeToggleIcon.src = isDark ? './images/icon-sun.svg' : './images/icon-moon.svg';
    elements.themeToggleIcon.alt = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }
  
  if (elements.logo) {
    elements.logo.src = isDark ? './images/logo-dark-theme.svg' : './images/logo-light-theme.svg';
  }
  
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

export function toggleTheme() {
  if (!elements.body) return;
  const isDark = elements.body.classList.contains('dark-theme');
  setTheme(!isDark);
}

export function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    setTheme(true);
  }
}

// Main Analysis Function
export function updateAnalysis() {
  if (!elements.textarea) return;
  
  const text = elements.textarea.value;
  const excludeSpaces = elements.excludeSpacesCheckbox ? elements.excludeSpacesCheckbox.checked : false;
  
  const charCount = pf.calculateCharCount(text, excludeSpaces);
  if (elements.totalCharElem) elements.totalCharElem.textContent = pf.formatNumber(charCount);
  
  const words = pf.countWords(text);
  if (elements.wordCountElem) elements.wordCountElem.textContent = pf.formatNumber(words.length);
  
  const sentences = pf.countSentences(text);
  if (elements.sentenceCountElem) elements.sentenceCountElem.textContent = pf.formatNumber(sentences.length);
  
  if (elements.readingTimeElem) {
    elements.readingTimeElem.textContent = `Approx. reading time: ${pf.calculateReadingTime(words.length)}`;
  }
  
  displayLetterFrequency(text);
}

// Event Handler Functions
export function handleTextInput() {
  if (!elements.textarea) return;
  
  const text = elements.textarea.value;
  const excludeSpaces = elements.excludeSpacesCheckbox ? elements.excludeSpacesCheckbox.checked : false;
  const limit = getCharacterLimit();
  
  if (elements.characterLimitCheckbox && elements.characterLimitCheckbox.checked) {
    const truncatedText = enforceCharacterLimit(text, limit, excludeSpaces);
    if (truncatedText !== text) {
      elements.textarea.value = truncatedText;
    }
  }
  
  updateAnalysis();
  checkCharacterLimit();
}

export function initializeEventListeners() {
  if (!elements.textarea) return;
  
  elements.textarea.addEventListener("input", handleTextInput);
  
  if (elements.excludeSpacesCheckbox) {
    elements.excludeSpacesCheckbox.addEventListener("change", () => {
      if (elements.totalCharLabelElem) {
        elements.totalCharLabelElem.textContent = elements.excludeSpacesCheckbox.checked ? 
          "Total Characters (no space)" : "Total Characters";
      }
      updateAnalysis();
      checkCharacterLimit();
    });
  }

  if (elements.characterLimitCheckbox) {
    elements.characterLimitCheckbox.addEventListener("change", () => {
      toggleCharacterLimitInput();
      checkCharacterLimit();
    });
  }

  if (elements.characterLimitInput) {
    elements.characterLimitInput.addEventListener("input", checkCharacterLimit);
    elements.characterLimitInput.addEventListener("change", checkCharacterLimit);
  }
  
  if (elements.themeToggleButton) {
    elements.themeToggleButton.addEventListener('click', toggleTheme);
  }
}

// Initialization Function
export function init() {
  try {
    initializeTheme();
    initializeEventListeners();
    updateAnalysis();
  } catch (error) {
    console.error("Initialization error:", error);
  }
}