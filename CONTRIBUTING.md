# Contributing to Podcastfy SaaS

Thank you for considering contributing to Podcastfy SaaS! We welcome contributions from the community.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git
- Wrangler CLI (for Cloudflare Pages)

### Development Setup
```bash
# Clone the repository
git clone https://github.com/criadacasa/podcastfy-saas.git
cd podcastfy-saas

# Install dependencies
npm install

# Build the project
npm run build

# Start development server
pm2 start ecosystem.config.cjs

# Or use npm script
npm run dev:sandbox
```

## 📋 How to Contribute

### Reporting Bugs
1. Check if the bug has already been reported in [Issues](https://github.com/criadacasa/podcastfy-saas/issues)
2. If not, create a new issue using the Bug Report template
3. Include as much detail as possible

### Suggesting Features
1. Check existing [Feature Requests](https://github.com/criadacasa/podcastfy-saas/issues?q=is%3Aissue+label%3Aenhancement)
2. Create a new issue using the Feature Request template
3. Explain the use case and expected behavior

### Submitting Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm run build
   npm run test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   
   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**
   - Use the PR template
   - Link related issues
   - Provide clear description of changes

## 🎨 Code Style Guidelines

### TypeScript/JavaScript
- Use TypeScript for type safety
- Use meaningful variable and function names
- Follow existing code patterns
- Add JSDoc comments for public APIs

### CSS
- Use Tailwind CSS utility classes
- Keep custom CSS minimal
- Follow BEM naming for custom classes

### File Organization
```
src/
├── index.tsx          # Main application
├── renderer.tsx       # JSX renderer
├── routes/            # API routes (future)
└── types/             # TypeScript types (future)

public/static/
├── app.js            # Frontend JavaScript
└── style.css         # Custom styles
```

## 🧪 Testing
- Test all new features thoroughly
- Test on different browsers
- Check mobile responsiveness
- Verify API endpoints work correctly

## 📝 Documentation
- Update README.md for significant changes
- Add inline comments for complex logic
- Update API documentation if applicable

## 🤝 Code Review Process
1. All PRs require review before merging
2. Address review comments promptly
3. Keep PRs focused and reasonably sized
4. Ensure CI checks pass

## 🎯 Priority Areas
We especially welcome contributions in these areas:
- Backend integration with Podcastfy Python
- Database setup (Cloudflare D1)
- User authentication
- File upload and storage (R2)
- Testing infrastructure
- Documentation improvements

## ❓ Questions?
- Open a [Discussion](https://github.com/criadacasa/podcastfy-saas/discussions)
- Ask in issues with the `question` label

## 📜 License
By contributing, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing! 🎉
