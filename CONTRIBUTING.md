# 🤝 Contributing to Cribble

Thank you for your interest in contributing to Cribble! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

### Our Standards

**Positive Behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable Behavior:**
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Python v3.9+
- MongoDB
- Git
- Gemini API Key

### Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/Cribble.git
cd Cribble

# Add upstream remote
git remote add upstream https://github.com/Manaswin05/Cribble.git
```

## 💻 Development Setup

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install

# AI Service
cd ../ai-service
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp ai-service/.env.example ai-service/.env

# Add your Gemini API key to ai-service/.env
```

### 3. Start Development Servers

```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: AI Service
cd ai-service && uvicorn main:app --reload --port 8000

# Terminal 4: Frontend
npm run dev
```

## 🎯 How to Contribute

### Types of Contributions

1. **Bug Fixes** - Fix existing issues
2. **New Features** - Add new functionality
3. **Documentation** - Improve docs
4. **Tests** - Add or improve tests
5. **Performance** - Optimize code
6. **UI/UX** - Improve design

### Finding Issues

- Check [Issues](https://github.com/Manaswin05/Cribble/issues)
- Look for `good first issue` label
- Look for `help wanted` label

### Reporting Bugs

**Before submitting:**
- Check if the bug is already reported
- Test on the latest version
- Gather relevant information

**Bug Report Template:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

**Additional context**
Any other relevant information.
```

### Suggesting Features

**Feature Request Template:**

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features.

**Additional context**
Mockups, examples, or other context.
```

## 📝 Coding Standards

### JavaScript/TypeScript

```typescript
// Use TypeScript for type safety
interface Design {
  id: string;
  title: string;
  designData: DesignData;
}

// Use async/await
async function fetchDesigns(): Promise<Design[]> {
  const response = await fetch('/api/designs');
  return response.json();
}

// Use meaningful names
const userDesigns = await getDesignsByUser(userId);

// Add comments for complex logic
// Calculate optimal layout using golden ratio
const layoutRatio = 1.618;
```

### Python

```python
# Follow PEP 8
from typing import List, Dict, Optional

# Use type hints
def generate_design(prompt: str, style: str = "modern") -> Dict:
    """
    Generate design from prompt.
    
    Args:
        prompt: Design description
        style: Design style (default: "modern")
        
    Returns:
        Design data dictionary
    """
    pass

# Use descriptive names
user_designs = get_designs_by_user(user_id)
```

### React Components

```typescript
// Use functional components with hooks
import React, { useState, useEffect } from 'react';

interface Props {
  designId: string;
  onSave: (design: Design) => void;
}

export const DesignEditor: React.FC<Props> = ({ designId, onSave }) => {
  const [design, setDesign] = useState<Design | null>(null);
  
  useEffect(() => {
    loadDesign(designId);
  }, [designId]);
  
  return (
    <div className="design-editor">
      {/* Component JSX */}
    </div>
  );
};
```

### CSS/Tailwind

```tsx
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-800">Title</h2>
  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    Save
  </button>
</div>

// For complex styles, use CSS modules or styled-components
```

## 📦 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(ai): add color suggestion endpoint

Add new endpoint for AI-powered color palette suggestions.
Integrates with Gemini API to generate harmonious colors.

Closes #123
```

```bash
fix(backend): resolve MongoDB connection timeout

Increase connection timeout and add retry logic.
Fixes intermittent connection failures.

Fixes #456
```

```bash
docs(readme): update setup instructions

Add detailed steps for Windows setup.
Include troubleshooting section.
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update your fork**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, documented code
   - Follow coding standards
   - Add tests if applicable

4. **Test your changes**
   ```bash
   npm run lint
   npm run test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

### Submitting PR

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your feature branch
4. Fill out the PR template

**PR Template:**

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added unit tests
- [ ] Added integration tests

## Screenshots
If applicable, add screenshots.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] All tests pass
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, PR will be merged
4. Your contribution will be credited

## 🧪 Testing

### Running Tests

```bash
# Frontend tests
npm run test

# Backend tests
cd backend
npm run test

# AI service tests
cd ai-service
pytest
```

### Writing Tests

**Frontend (Vitest):**

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DesignEditor } from './DesignEditor';

describe('DesignEditor', () => {
  it('renders design title', () => {
    render(<DesignEditor designId="123" />);
    expect(screen.getByText('Design Title')).toBeInTheDocument();
  });
});
```

**Backend (Jest):**

```javascript
describe('Design API', () => {
  test('GET /api/designs returns designs', async () => {
    const response = await request(app).get('/api/designs');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

**AI Service (Pytest):**

```python
def test_generate_design():
    response = client.post("/api/ai/generate", json={
        "prompt": "test design",
        "style": "modern"
    })
    assert response.status_code == 200
    assert response.json()["success"] == True
```

## 📚 Documentation

### Writing Documentation

- Use clear, concise language
- Include code examples
- Add screenshots/diagrams
- Keep it up-to-date

### Documentation Structure

```markdown
# Title

Brief description.

## Section

Detailed explanation.

### Subsection

More details.

**Example:**
```code
example here
```

**Output:**
```
expected output
```
```

### API Documentation

```typescript
/**
 * Generate design from AI prompt
 * 
 * @param {GenerateDesignRequest} request - Generation parameters
 * @returns {Promise<GenerateDesignResponse>} Generated design
 * 
 * @example
 * const design = await generateDesignWithAI({
 *   prompt: "modern tech startup",
 *   style: "minimal",
 *   saveDesign: true
 * });
 */
export async function generateDesignWithAI(
  request: GenerateDesignRequest
): Promise<GenerateDesignResponse> {
  // Implementation
}
```

## 🎨 Design Contributions

### UI/UX Guidelines

- Follow existing design patterns
- Use Tailwind CSS utilities
- Maintain consistent spacing
- Ensure accessibility (WCAG 2.1)
- Test on multiple screen sizes

### Color Palette

```css
Primary: #6a37d4
Secondary: #ae8dff
Accent: #65e1ff
Text: #2f2e2e
Background: #f9f6f5
```

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Mentioned in documentation

## 📞 Getting Help

- **Questions**: Open a Discussion
- **Bugs**: Open an Issue
- **Chat**: Join our Discord (coming soon)

## 📄 License

By contributing, you agree that your contributions will be licensed under the Apache-2.0 License.

---

**Thank you for contributing to Cribble! 🎨✨**
