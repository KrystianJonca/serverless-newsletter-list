# Serverless Newsletter List HTTP Api on AWS

Application that uses serverless functions to manage your newsletter list. Add or delete users to it, send new emails to them and also upload image files.
Tech Stack: Serverless, Node.js, AWS Lambda, AWS S3, AWS SES, DynamoDB.

## Prerequisites

- Node.js 18+
- pnpm package manager
- AWS CLI configured with appropriate permissions
- Serverless Framework

## Installation

Install dependencies using pnpm:

```bash
pnpm install
```

## Usage

### Development Scripts

- `pnpm deploy` - Deploy to default stage
- `pnpm deploy:dev` - Deploy to development stage
- `pnpm deploy:prod` - Deploy to production stage
- `pnpm offline` - Start local development server
- `pnpm remove` - Remove deployed stack

### Deployment

```bash
pnpm deploy
```

### Local Development

For local development, you can use the serverless-offline plugin:

```bash
pnpm add -D serverless-offline
```

Then start the local server:

```bash
pnpm offline
```
