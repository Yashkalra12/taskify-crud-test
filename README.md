# Taskify - Task Management Dashboard

A modern, full-featured Task Management Dashboard built with React.js, Redux Toolkit, and Tailwind CSS.

## Features

- ✅ **Task Management**: Create, edit, delete, and toggle task status
- 🔍 **Search & Filter**: Search tasks by title and filter by status (All/Pending/Completed)
- 🎨 **Light/Dark Theme**: Toggle between light and dark themes with persistence
- 📱 **Responsive Design**: Mobile-first, responsive UI
- 🧪 **Comprehensive Testing**: Full test coverage with Jest and React Testing Library
- 🚀 **CI/CD**: Automated testing and deployment with GitHub Actions and Vercel

## Tech Stack

- **Frontend**: React 19, Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Yashkalra12/taskify-crud-test.git
cd taskify-crud-test
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   ├── TaskInput.jsx   # Task input form
│   ├── TaskList.jsx    # Task list with edit/delete
│   ├── TaskFilter.jsx  # Filter buttons
│   ├── TaskSearch.jsx  # Search input
│   └── ThemeToggle.jsx # Theme switcher
├── store/              # Redux store
│   ├── store.js        # Store configuration
│   └── taskSlice.js    # Task slice with async thunks
├── services/           # API services
│   └── mockApi.js      # Mock API service
├── context/           # React context
│   └── ThemeContext.jsx # Theme context provider
└── App.jsx             # Main app component
```

## Testing

The project includes comprehensive tests:

- Unit tests for Redux slices and selectors
- Component tests with user interactions
- Integration tests for the full application
- Mock API service tests

Run tests with:
```bash
npm test
```

View coverage:
```bash
npm run test:coverage
```

## Deployment

### Vercel Deployment

The project is configured for automatic deployment to Vercel via GitHub Actions.

#### Setup Instructions:

1. **Connect to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Vercel will auto-detect Vite settings

2. **Configure GitHub Secrets:**
   Add these secrets to your GitHub repository settings:
   - `VERCEL_TOKEN`: Your Vercel API token (get from [Vercel Settings](https://vercel.com/account/tokens))
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

   To get the IDs:
   ```bash
   vercel link
   # This will create a .vercel/project.json file with the IDs
   ```

3. **Automatic Deployment:**
   - Every push to `main` branch triggers automatic deployment
   - Pull requests trigger test runs
   - Build and test status is shown on GitHub

#### Manual Deployment:

```bash
npm install -g vercel
vercel
```

## GitHub Actions Workflows

The project includes two GitHub Actions workflows:

1. **CI Workflow** (`.github/workflows/ci.yml`):
   - Runs on every push and pull request
   - Executes linting and tests
   - Checks test coverage threshold (70%)

2. **Deploy Workflow** (`.github/workflows/deploy.yml`):
   - Runs tests on multiple Node.js versions
   - Builds the project
   - Deploys to Vercel (only on main branch)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

Yash Kalra

---

Built with ❤️ using React, Redux Toolkit, and Tailwind CSS
