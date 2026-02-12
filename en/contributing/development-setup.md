# Development Setup

How to set up the development environment for contributing to Connectum.

## Requirements

- Node.js >= 25.2.0
- pnpm >= 10

## Quick Start

### 1. Clone Repositories

```bash
# Create root directory
mkdir Connectum && cd Connectum

# Clone all 3 repositories
git clone https://github.com/Connectum-Framework/connectum.git
git clone https://github.com/Connectum-Framework/docs.git
git clone https://github.com/Connectum-Framework/examples.git
```

### 2. Install Dependencies

```bash
cd connectum
pnpm install
```

### 3. Verify Environment

```bash
# Check Node.js
node --version  # >= 25.2.0

# Check pnpm
pnpm --version  # >= 10

# Type checking
pnpm typecheck

# Run tests
pnpm test
```

### 4. Start Development

```bash
pnpm dev
```

## Further Resources

- [CLI Commands](./cli-commands) -- full command reference
- [Architecture Overview](/en/guide/advanced/architecture) -- framework architecture
