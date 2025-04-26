// tests/domFunctions.test.js
import {
    elements,
    handleTextInput,
    checkCharacterLimit,
    config,
  } from '../js/domFunctions.js';
import * as pf from '../js/pureFunctions.js';

// Mock the DOM before each test
beforeEach(() => {
  document.body.innerHTML = `
    <header class="site-header">
      <div class="logo-container">
        <img src="./images/logo-light-theme.svg" alt="Character Counter Logo">
      </div>
      <nav class="theme-switcher">
        <button aria-label="Toggle dark mode">
          <img src="./images/icon-moon.svg" alt="Switch to dark mode">
        </button>
      </nav>
    </header>
    <main>
      <textarea id="text"></textarea>
      <div class="text-input-container"></div> 
      <input type="checkbox" id="exclude-spaces">
      <input type="checkbox" id="character-limit">
      <input type="number" id="character-limit-value">
      <div class="options-container">
        <div id="reading-time">Approx. reading time: &lt;1 min</div>
      </div>
      <div class="card_one">
        <p class="stat-number">00</p>
        <p class="stat-label" id="total-char-label">Total Characters</p>
      </div>
      <div class="card_two">
        <p class="stat-number">00</p>
        <p class="stat-label">Word Count</p>
      </div>
      <div class="card_three">
        <p class="stat-number">00</p>
        <p class="stat-label">Sentence Count</p>
      </div>
      <div class="letter-density">
        <div class="no-data-message" style="display: block;"></div>
        <!-- .remaining-letters is added dynamically, so start without it -->
      </div>
      <div class="see" style="display: none;">
        <p>See more</p>
        <span aria-hidden="true">&gt;</span>
      </div>
      <div class="error-message" id="limit-error" style="display: none;">
         <!-- Content set by innerHTML -->
      </div>
    </main>
  `;

  // Reinitialize elements after setting up DOM
  Object.assign(elements, {
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
  });
});

// Mock pure functions
jest.mock('../js/pureFunctions.js', () => {
  const actual = jest.requireActual('../js/pureFunctions.js'); // <-- Fix

  return {
    __esModule: true,
    ...actual, // <-- Keep the real config or any real functions
    formatNumber: jest.fn().mockImplementation(num => num.toString().padStart(2, "0")),
    calculateCharCount: jest.fn().mockReturnValue(5),
    countWords: jest.fn().mockReturnValue(['hello', 'world']),
    countSentences: jest.fn().mockReturnValue(['Hello world.']),
    calculateReadingTime: jest.fn().mockReturnValue('1 min'),
    calculateLetterFrequency: jest.fn().mockReturnValue({
      totalCharacters: 10,
      sortedCharacters: [['e', 3], ['h', 2], ['l', 3], ['o', 2]]
    }),
    generateDensityHTML: jest.fn().mockImplementation((letters, total) => 
      letters.map(([l, c]) => `<div class="progress-wrapper">${l}: ${c}</div>`).join('')
    ),
    shouldShowLimitWarning: jest.fn().mockReturnValue(false),
    shouldShowLimitError: jest.fn().mockReturnValue(false),
    getMessageColor: jest.fn().mockReturnValue('red'),
    truncateExcludingSpaces: jest.fn().mockImplementation(text => text.substring(0, 10)),
  };
});


describe('Dynamic DOM Updates on Typing Simulation', () => {

  test('should update counters and reading time when text is entered', () => {
    // Arrange: Set specific return values for this scenario
    pf.calculateCharCount.mockReturnValue(11);
    pf.countWords.mockReturnValue(['Hello', 'world']); // Length = 2
    pf.countSentences.mockReturnValue(['Hello world.']); // Length = 1
    pf.calculateReadingTime.mockReturnValue('<1 min'); // For 2 words

    // Act: Simulate typing by setting value and calling handler
    elements.textarea.value = 'Hello world.';
    handleTextInput(); 

    // Assert: Check if DOM elements reflect the mocked calculations
    expect(elements.totalCharElem.textContent).toBe('11'); 
    expect(elements.wordCountElem.textContent).toBe('02'); 
    expect(elements.sentenceCountElem.textContent).toBe('01'); 
    expect(elements.readingTimeElem.textContent).toContain('<1 min'); 
    expect(pf.calculateCharCount).toHaveBeenCalledWith('Hello world.', false);
    expect(pf.countWords).toHaveBeenCalledWith('Hello world.');
    expect(pf.countSentences).toHaveBeenCalledWith('Hello world.');
    expect(pf.calculateReadingTime).toHaveBeenCalledWith(2); // Based on mocked word count length
  });

  test('should show warning message when approaching character limit', () => {
    // Arrange: Enable limit and set value
    elements.characterLimitCheckbox.checked = true;
    elements.characterLimitInput.value = '100';
    // Arrange: Mock pure functions for the WARNING state
    pf.calculateCharCount.mockReturnValue(95); 
    pf.shouldShowLimitWarning.mockReturnValue(true);
    pf.shouldShowLimitError.mockReturnValue(false);
    pf.getMessageColor.mockReturnValue('orange');

    // Act: Simulate typing text that triggers the warning
    elements.textarea.value = 'a '.repeat(47) + 'a'; 
    handleTextInput(); 

    // Assert: Check if the error message element displays the warning
    expect(elements.limitErrorElem.style.display).toBe('flex');
    expect(elements.limitErrorElem.innerHTML).toContain('Approaching limit! 95/100 characters.'); 
    expect(elements.limitErrorElem.style.color).toBe('orange');
    // Ensure textarea outline isn't red (error state)
    expect(elements.textarea.style.outline).toBe(''); 
  });

  

   test('should hide error message when limit is disabled', () => {
      // Arrange: Start with limit enabled and error showing
      elements.characterLimitCheckbox.checked = true;
      elements.characterLimitInput.value = '100';
      pf.calculateCharCount.mockReturnValue(101);
      pf.shouldShowLimitError.mockReturnValue(true);
      checkCharacterLimit(); // Show the error initially
      expect(elements.limitErrorElem.style.display).toBe('flex');

      // Act: Disable the character limit checkbox and re-run check
      elements.characterLimitCheckbox.checked = false;
      checkCharacterLimit(); // Should now hide the error
    // Assert: Check if the error message element is hidden
      expect(elements.limitErrorElem.style.display).toBe('none');
    });
});

afterEach(() => {
  document.body.innerHTML = ''; // Clean up DOM
  jest.clearAllMocks();
});
// stat