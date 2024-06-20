# HamsterKombat AutoClicker

This project is an AutoClicker for [HamsterKombat.io](https://hamsterkombat.io) that automatically claims coins every 10 minutes. It uses Puppeteer to automate the process of sending click requests to the server.

## Features

- Automatically sends click requests to claim coins every 10 minutes.
- Uses Puppeteer to automate browser interactions.
- Configurable through environment variables.

## Prerequisites

- Node.js (LTS version recommended)
- npm (Node package manager)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/hamsterkombat-autoclicker.git
   cd hamsterkombat-autoclicker
   ```

2. Install the dependencies:

   ```sh
   npm install puppeteer dotenv
   ```

3. Create a .env file in the root of the project directory and add your token:

    ```sh
    TOKEN=your_bearer_token_here
    ```

## Usage

Run the script using Node.js:

```sh
node index.js
```

The script will open a browser, navigate to HamsterKombat.io, and start sending click requests every 10 minutes.

## CI/CD

This project uses GitHub Actions for CI/CD. The workflow is defined in .github/workflows/ci.yml.

### GitHub Actions Secrets

To set up the CI/CD pipeline, you need to add your token as a secret in your GitHub repository:

1. Go to your GitHub repository.
2. Navigate to Settings > Secrets and variables > Actions.
3. Click New repository secret.
4. Add a new secret with the name TOKEN and your token as the value.

### Workflow File

The CI/CD pipeline is defined in .github/workflows/ci.yml:

```yaml
name: Puppeteer Test

on: [push]

jobs:
  puppeteer:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 'lts/*'

    - name: Set up environment variables
      run: echo "TOKEN=${{ secrets.TOKEN }}" >> .env

    - name: Install dependencies
      run: npm install

    - name: Run Puppeteer script
      run: node index.js

```
