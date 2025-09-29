# Contributing to Placement Pulse

Thank you for your interest in contributing to Placement Pulse! We welcome contributions from the community and are grateful for your help in making this platform better for MBA students.

## 🤝 How to Contribute

### 1. Fork the Repository
- Click the "Fork" button on the top right of this repository
- Clone your forked repository to your local machine

### 2. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Your Changes
- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly

### 4. Commit Your Changes
```bash
git add .
git commit -m "Add: Brief description of your changes"
```

### 5. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request
- Go to your forked repository on GitHub
- Click "New Pull Request"
- Fill out the PR template
- Submit the pull request

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows the project's style guidelines
- [ ] Self-review of your code has been performed
- [ ] Code has been commented, particularly in hard-to-understand areas
- [ ] Corresponding changes to documentation have been made
- [ ] Changes generate no new warnings
- [ ] New and existing unit tests pass locally
- [ ] Any dependent changes have been merged and published

### PR Description Template
```markdown
## Description
Brief description of the changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
Describe the tests you ran to verify your changes.

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## 🎯 Areas Where We Need Help

### Frontend Development
- UI/UX improvements
- Mobile responsiveness
- Performance optimization
- Accessibility improvements

### Backend Development
- API optimization
- Database queries
- Security enhancements
- Error handling

### Content & Documentation
- Technical documentation
- User guides
- Code comments
- README improvements

### Testing
- Unit tests
- Integration tests
- End-to-end tests
- Performance testing

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

### Setup Steps
1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` file (see README.md)
4. Run development server: `npm run dev`

### Code Style Guidelines
- Use TypeScript for type safety
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Use consistent indentation (2 spaces)

### File Structure
```
placement-pulse/
├── app/                 # Next.js app directory
├── components/         # Reusable components
├── lib/               # Utility functions
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── public/            # Static assets
└── scripts/           # Build and setup scripts
```

## 🐛 Reporting Bugs

### Before Creating an Issue
1. Check if the issue already exists
2. Try to reproduce the issue
3. Check the latest version

### Bug Report Template
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows, macOS, Linux]
- Browser: [e.g. Chrome, Firefox, Safari]
- Version: [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

## 💡 Suggesting Features

### Feature Request Template
```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## 📞 Getting Help

- **Discord**: Join our community server
- **Email**: support@placementpulse.com
- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For general questions and ideas

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📜 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

### Our Standards
- Be respectful and inclusive
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community

## 📝 License

By contributing to Placement Pulse, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Placement Pulse! 🎉
