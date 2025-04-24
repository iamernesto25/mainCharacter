# Character Counter

A real-time text analyzer application that provides detailed character and word analysis with customizable options.

## Features

- Real-time text analysis
- Character counting with space exclusion option
- Word counting
- Sentence counting
- Letter density analysis
- Reading time estimation
- Dark/Light theme toggle
- Responsive design
- Comprehensive test coverage

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES Modules)
- Jest for testing
- GitHub Actions for CI/CD
- Google Fonts (DM Sans)

## Project Structure

```
character-counter/
├── index.html
├── css/
│   └── styles.css
├── images/
│   ├── logo-light-theme.svg
│   ├── icon-moon.svg
│   ├── pattern-character-count.svg
│   ├── pattern-word-count.svg
│   └── pattern-sentence-count.svg
├── js/
│   ├── main.js
│   ├── pureFunctions.js
│   └── domFunctions.js
├── test/
│   ├── characterCounter.test.js
│   └── domFunctions.test.js
└── assets/
    └── images/
        └── favicon-32x32.png
```

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/iamernesto14/CharacterCounter.git
cd CharacterCounter
```

2. Install dependencies:
```bash
npm install
```

3. Run tests:
```bash
npm test
```

4. Start development:
- Open `index.html` in your web browser
- Make changes and run tests to ensure functionality

## Testing

The project uses Jest for testing with the following setup:
- Unit tests for core functionality
- DOM manipulation tests
- Continuous Integration via GitHub Actions

To run tests:
```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
- Character counting functionality
- Word counting logic
- Sentence detection
- DOM updates and user interactions
- Edge cases and error handling

## Features in Detail

### Text Analysis
- Real-time character counting
- Word counting with smart handling of punctuation and spaces
- Sentence counting with support for multiple punctuation types
- Intelligent reading time estimation

### Customization Options
- Exclude spaces from character count
- Set character limit with warning and error states
- Dark/Light theme toggle for better readability

### Letter Density Analysis
- Shows top 5 most used letters
- Visual progress bars for letter frequency
- Percentage and count display
- "See more" option for additional letters

## Browser Support

The application is tested and works on modern web browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Accessibility

The application includes:
- ARIA labels for screen readers
- Semantic HTML structure
- Keyboard navigation support
- High contrast color schemes
- Screen reader-friendly error messages

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Continuous Integration

The project uses GitHub Actions for CI/CD:
- Automated testing on push and pull requests
- Test coverage reports
- Dependency caching for faster builds

## License

This project is open source and available under the MIT License.

## Credits

- Frontend Mentor for the design inspiration
- Google Fonts for the DM Sans font family
- Jest and GitHub Actions for testing infrastructure
