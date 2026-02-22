# Plant Water Planner Core

A CDK-based infrastructure project for managing plant watering schedules. This project uses AWS CDK with TypeScript to provision cloud resources and includes local development support using LocalStack.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (version specified in `.nvmrc`)
- **Yarn** package manager
- **Docker** and **Docker Compose** (for LocalStack)
- **AWS CLI** (configured for your AWS account)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PlantWaterPlannerCore
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.template .env
   # Edit .env with your configuration
   ```

## 🏗️ Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `yarn build` | Compile TypeScript to JavaScript using esbuild |
| `yarn build:local` | Build in watch mode for local development |
| `yarn test` | Run Jest unit tests |
| `yarn lint` | Run ESLint to check code quality |
| `yarn lint:fix` | Auto-fix ESLint issues |
| `yarn format` | Format code using Prettier |

### Local Development

1. **Start LocalStack services**
   ```bash
   yarn localstack
   ```
   This command will:
   - Stop and remove any existing LocalStack containers
   - Start LocalStack and PostgreSQL using Docker Compose

2. **Run transpiler in watch mode for hot-reload and deployment**
   ```bash
   yarn build:local
   ```

3. **Bootstrap CDK for LocalStack** (first time only)
   ```bash
   yarn bootstrap:local
   ```

4. **Deploy to LocalStack**
   ```bash
   yarn deploy:local
   ```

### Testing

Run the test suite:
```bash
yarn test
```

Tests are configured with Jest and include:
- Unit tests for your CDK constructs
- Integration tests for Lambda functions
- Infrastructure tests

## 🚀 Deployment

### Local Deployment (LocalStack)

For local development and testing:

1. **Start LocalStack**
   ```bash
   yarn localstack
   ```

2. **Deploy infrastructure**
   ```bash
   yarn deploy:local
   ```

### AWS Deployment

For production deployment to AWS:

1. **Configure AWS credentials**
   ```bash
   aws configure
   ```

2. **Bootstrap CDK** (first time only)
   ```bash
   yarn cdk bootstrap
   ```

3. **Deploy to AWS**
   ```bash
   yarn cdk deploy
   ```

### Other CDK Commands

- **Synthesize CloudFormation template**
  ```bash
  yarn cdk synth
  ```

- **Compare deployed stack with current state**
  ```bash
  yarn cdk diff
  ```

- **Destroy the stack**
  ```bash
  yarn cdk destroy
  ```

## 🛠️ Project Structure

```
├── bin/                          # CDK app entry point
├── iac/                          # Infrastructure as Code
│   ├── plant_water_planner_core-stack.ts
│   └── plant_water_planner_core.ts
├── src/                          # Source code for Lambda functions
├── test/                         # Test files
├── docker/                       # Docker configuration
│   └── docker-compose.yml        # LocalStack setup
├── cdk.json                      # CDK configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 📝 Commit Standards

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification to ensure consistent, readable commit history and enable automated versioning and changelog generation.

### Why Conventional Commits?

- **Automated versioning**: Enables semantic versioning based on commit types
- **Changelog generation**: Automatically generate changelogs from commit messages
- **Better collaboration**: Clear communication about the nature of changes
- **Easier navigation**: Find specific changes quickly in git history
- **CI/CD integration**: Trigger different workflows based on commit types

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Structure Breakdown

- **Type**: Describes the kind of change (required)
- **Scope**: Area of the codebase affected (optional)
- **Description**: Brief summary of the change (required)
- **Body**: Detailed explanation of the change (optional)
- **Footer**: Breaking changes, issue references, etc. (optional)

### Commit Types

| Type | Description | When to Use |
|------|-------------|-------------|
| **feat** | A new feature | Adding new functionality for users |
| **fix** | A bug fix | Fixing a defect that affects users |
| **docs** | Documentation only changes | README, comments, documentation sites |
| **style** | Code style changes | Formatting, semicolons, whitespace (no logic changes) |
| **refactor** | Code changes that neither fix bugs nor add features | Improving code structure, performance without changing behavior |
| **perf** | Performance improvements | Changes that improve performance |
| **test** | Adding or updating tests | Unit tests, integration tests, test utilities |
| **build** | Build system or external dependencies | webpack, npm, yarn, package.json changes |
| **ci** | CI/CD configuration changes | GitHub Actions, CircleCI, deployment scripts |
| **chore** | Other changes | Tooling, maintenance tasks, dependency updates |
| **revert** | Reverting a previous commit | Undoing previous changes |

### Scope Guidelines

Scopes help identify which part of the codebase is affected:

- **iac**: Infrastructure as Code changes (CDK stacks, constructs)
- **lambda**: Lambda function implementations
- **api**: API Gateway, REST endpoints
- **db**: Database schemas, migrations
- **auth**: Authentication and authorization
- **config**: Configuration files, environment variables
- **deps**: Dependency updates

### Breaking Changes

Breaking changes should be indicated in the footer:

```
feat(api): update user authentication endpoint

BREAKING CHANGE: The /auth endpoint now requires a different payload structure.
Previous: { username, password }
New: { email, password, rememberMe }
```

Or with a `!` after the type/scope:

```
feat(api)!: update user authentication endpoint
```

### Examples

#### Simple Commits
```bash
feat(auth): add user authentication system
fix(api): resolve timeout issue in plant data retrieval
docs: update deployment instructions
chore(deps): update AWS CDK to v2.220.0
style: fix indentation in lambda functions
test(api): add integration tests for plant endpoints
refactor(iac): simplify DynamoDB table configuration
perf(lambda): optimize plant data processing algorithm
```

#### Commits with Body
```bash
feat(api): add plant watering schedule endpoints

Add GET, POST, PUT, DELETE endpoints for managing plant watering schedules.
Includes validation for schedule frequency and plant type compatibility.

Closes #123
```

#### Breaking Change Examples
```bash
feat(api)!: update plant model structure

BREAKING CHANGE: Plant model now requires 'species' field instead of 'type'.
Migration guide available in docs/migration.md

Before: { id, name, type, wateringFrequency }
After: { id, name, species, wateringSchedule }
```

```bash
fix(iac): remove deprecated S3 bucket configuration

BREAKING CHANGE: S3 bucket versioning is now enabled by default.
Existing deployments may need manual intervention.
```

### Commit Message Best Practices

#### Do ✅
- Use imperative mood: "add feature" not "added feature" or "adding feature"
- Keep the first line under 50 characters
- Capitalize the first letter of the description
- Don't end the description with a period
- Use the body to explain **what** and **why**, not **how**
- Reference issues and pull requests when relevant

#### Don't ❌
- Don't use vague descriptions: "fix stuff", "update code", "changes"
- Don't include file names unless necessary
- Don't use past tense: "fixed bug" should be "fix bug"
- Don't commit multiple unrelated changes together

### Configuration

This project uses the following tools to enforce conventional commits:

#### Commitlint Configuration
Located in `commitlint.config.js`:
```javascript
module.exports = { extends: ['@commitlint/config-conventional'] };
```

#### Husky Git Hooks
Pre-commit hooks automatically:
- Lint and format staged files
- Run relevant tests
- Validate commit message format

#### Lint-Staged Configuration
Located in `.lintstagedrc.json`:
```json
{
  "**/*.ts": ["yarn lint:fix", "yarn format"],
  "**/*.{json,md,mdx}": ["yarn format"]
}
```

### Automated Workflows

When you commit using conventional commits, the following happens automatically:

1. **Pre-commit**: Code is linted, formatted, and tested
2. **Commit validation**: Message format is checked by commitlint
3. **Version bumping**: Semantic versions can be generated from commit history
4. **Changelog generation**: Release notes can be auto-generated
5. **CI/CD triggers**: Different workflows based on commit types

### Common Scenarios

| Scenario | Commit Type | Example |
|----------|-------------|---------|
| New Lambda function | `feat(lambda)` | `feat(lambda): add plant care reminder function` |
| Bug in CDK stack | `fix(iac)` | `fix(iac): correct IAM permissions for DynamoDB` |
| Update README | `docs` | `docs: add API endpoint documentation` |
| Dependency update | `chore(deps)` | `chore(deps): bump aws-cdk to v2.220.0` |
| Code cleanup | `refactor` | `refactor: simplify error handling logic` |
| New test cases | `test` | `test(api): add unit tests for validation logic` |
| Performance improvement | `perf(lambda)` | `perf(lambda): optimize database query performance` |

### Pre-commit Hooks

This project uses Husky and lint-staged for automated code quality checks:

- **ESLint**: Code linting and auto-fixing
- **Prettier**: Code formatting
- **Commitlint**: Validates commit message format
- **Tests**: Runs relevant tests for staged files

## 🧰 Tools & Technologies

- **AWS CDK**: Infrastructure as Code framework
- **TypeScript**: Primary programming language
- **Jest**: Testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks management
- **LocalStack**: Local AWS cloud stack
- **Docker**: Containerization
- **esbuild**: Fast JavaScript bundler

## 🐛 Troubleshooting

### Common Issues

1. **LocalStack not starting**
   - Ensure Docker is running
   - Check if ports 4566 and 5432 are available
   - Verify LOCALSTACK_AUTH_TOKEN is set in your environment

2. **CDK deployment fails**
   - Check AWS credentials configuration
   - Ensure proper IAM permissions
   - Verify the CDK is bootstrapped in your region

3. **Build errors**
   - Run `yarn install` to ensure all dependencies are installed
   - Check TypeScript configuration in `tsconfig.json`

### Getting Help

- Check the [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- Review [LocalStack Documentation](https://docs.localstack.cloud/)
- Open an issue in the project repository

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make your changes following the coding standards
4. Commit using conventional commit format
5. Push to your branch: `git push origin feat/your-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
