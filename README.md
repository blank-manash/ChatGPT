# GPT-3.5 Chat Bot

### Introduction

This repo is fork from [here](https://github.com/jas3333/GPT-Helper/).
Credits to the author. I made some personal changes which I like to be default.

This app is an interface to the GPT3 API. It isn't Chatgpt nor does it use the Chatgpt api.
I made it as a second option due to the amount of errors and issues Chatgpt was having.

In order to use it, you will need an Openai account and an API key.

## To Do:
1. Create a Database to save conversations

### To install:

git clone the repo:

```
git clone https://github.com/blank-manash/ChatGPT
cd ChatGPT/client
npm install
```

### To run:

You will need to setup a .env file in the client directory. Make sure the file is named `.env` and nothing else.
`something.env` will not work.

```
REACT_APP_OPENAI_KEY=yourkey
```

Then just `npm start` inside the client directory. It should automatically load the page inside of a browser.
