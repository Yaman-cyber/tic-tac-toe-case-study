# tic-tac-toe app

mobile app for tic tac toe game

## Installation

Install dependencies:

```bash
yarn install
```

## Run Application

make sure toe fill the .env file the api url should be the ip of the device you use to run the express app

On Windows
Open Command Prompt and run:

```bash
ipconfig
```

Look for the IPv4 Address under your active network adapter.

On macOS
Open Terminal and run:

```bash
ipconfig getifaddr en0
```

fill the .env file like this

```
API_URL=http://<your-device-ip>:3000/api
```

make sure you have an android simulator running, then
run:

```bash
yarn start
```

after metro starts run:

```bash
yarn android
```

## otp info

otp is always `12345`
