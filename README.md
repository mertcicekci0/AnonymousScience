# AnonymousScience

AnonymousScience revolutionizes the scientific peer review process by providing cryptographic guarantees of double-blind anonymity while simultaneously verifying academic credentials and expertise.

## Features

- Cryptographic proof of academic credentials without identity disclosure
- Verification of domain expertise through publication history proofs
- Anonymous yet consistent identity for review continuity
- Transparent yet private review metrics
- Modern and intuitive user interface

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Blockchain**: Noir, zkEmail, zkJWT
- **Authentication**: RainbowKit, wagmi
- **State Management**: React Query

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/anonymousscience.git
   cd anonymousscience
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  ├── app/              # Next.js app router pages
  ├── components/       # React components
  │   ├── layout/      # Layout components
  │   ├── ui/          # UI components
  │   ├── auth/        # Authentication components
  │   ├── paper/       # Paper-related components
  │   └── review/      # Review-related components
  ├── hooks/           # Custom React hooks
  ├── lib/             # Utility functions
  ├── styles/          # Global styles
  ├── types/           # TypeScript type definitions
  └── utils/           # Helper functions
```

## Development Roadmap

### Week 1: Foundation & Core Components
- Set up development environment
- Implement basic UI components
- Create authentication flow
- Set up Noir integration

### Week 2: Core Features Implementation
- Implement paper submission system
- Create review interface
- Develop expertise verification
- Add anonymous communication features

### Week 3: Advanced Features & Integration
- Implement collaborative review features
- Add review quality metrics
- Develop journal editor dashboard
- Optimize performance

### Week 4: Refinement & Presentation
- Polish UI/UX
- Conduct testing
- Prepare documentation
- Create demo materials

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Noir](https://noir-lang.org/) for zero-knowledge proof capabilities
- [RainbowKit](https://www.rainbowkit.com/) for wallet connection
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
