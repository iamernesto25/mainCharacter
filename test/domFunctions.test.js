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
      </div>
      <div class="see" style="display: none;">
        <p>See more</p>
        <span aria-hidden="true">&gt;</span>
      </div>
      <div class="error-message" id="limit-error" style="display: none;">
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
jest.mock('../js/pureFunctions.js', () => ({
  __esModule: true,
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
  config: {
    initialShowCount: 5,
    wordsPerMinute: 200,
  },
}));

describe('Dynamic DOM Updates on Typing Simulation', () => {

  test('should update counters and reading time when text is entered', () => {
    // Arrange
    pf.calculateCharCount.mockReturnValue(11);
    pf.countWords.mockReturnValue(['Hello', 'world']);
    pf.countSentences.mockReturnValue(['Hello world.']);
    pf.calculateReadingTime.mockReturnValue('<1 min');

    // Act
    elements.textarea.value = 'Hello world.';
    handleTextInput();

    // Assert
    expect(elements.totalCharElem.textContent).toBe('11');
    expect(elements.wordCountElem.textContent).toBe('02');
    expect(elements.sentenceCountElem.textContent).toBe('01');
    expect(elements.readingTimeElem.textContent).toContain('<1 min');
    expect(pf.calculateCharCount).toHaveBeenCalledWith('Hello world.', false);
    expect(pf.countWords).toHaveBeenCalledWith('Hello world.');
    expect(pf.countSentences).toHaveBeenCalledWith('Hello world.');
    expect(pf.calculateReadingTime).toHaveBeenCalledWith(2);
  });

  test('should show warning message when approaching character limit', () => {
    // Arrange
    elements.characterLimitCheckbox.checked = true;
    elements.characterLimitInput.value = '100';
    pf.calculateCharCount.mockReturnValue(95);
    pf.shouldShowLimitWarning.mockReturnValue(true);
    pf.shouldShowLimitError.mockReturnValue(false);
    pf.getMessageColor.mockReturnValue('orange');

    // Act
    elements.textarea.value = 'a '.repeat(47) + 'a';
    handleTextInput();

    // Assert
    expect(elements.limitErrorElem.style.display).toBe('flex');
    expect(elements.limitErrorElem.innerHTML).toContain('Approaching limit! 95/100 characters.');
    expect(elements.limitErrorElem.style.color).toBe('orange');
    expect(elements.textarea.style.outline).toBe('');
  });

  test('should hide error message when limit is disabled', () => {
    // Arrange
    elements.characterLimitCheckbox.checked = true;
    elements.characterLimitInput.value = '100';
    pf.calculateCharCount.mockReturnValue(101);
    pf.shouldShowLimitError.mockReturnValue(true);

    // Act (Initially show error)
    checkCharacterLimit();
    expect(elements.limitErrorElem.style.display).toBe('flex');

    // Act (Disable limit and recheck)
    elements.characterLimitCheckbox.checked = false;
    checkCharacterLimit();

    // Assert
    expect(elements.limitErrorElem.style.display).toBe('none');
  });

});

// Clean up after each test
afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});
