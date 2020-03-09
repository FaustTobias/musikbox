<h1 align="center">musikbox</h1>

<p align="center">
  Play songs via text to speech. In german. 
</p>

<br>

<p align="center">
  <a href="https://www.npmjs.com/package/musikbox">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/musikbox">
  </a>
  <a href="https://packagephobia.now.sh/result?p=musikbox">
    <img alt="Install Size" src="https://badgen.net/packagephobia/install/musikbox">
  </a>
</p>

<br>

## Introduction

This application plays a song using text to speech. The lyrics are fetched from https://www.songtexte.com/ and the voice is generated using either ``` say ``` (macOS) or ``` System.Speech.Synthesis.SpeechSynthesizer ``` (Windows). If a german version of the lyrics exists, it is used instead, because german lyrics are obviously superior (i guess).


## Usage

```
npx musikbox "sound of silence"
```


## Development

Clone this repository

```
git clone https://github.com/FaustTobias/musikbox
cd musikbox
```

Install all dependencies using your favorite package manager.

```
$ npm i
$ yarn
$ pnpm
```

Start without compiling

```
$ npm run start
$ yarn start
$ pnpm run start
```

Create production builds

```
$ npm run build
$ yarn build
$ pnpm run build
```

All build artifacts will be put into the lib folder.


## License

MIT


## Maintainer

[Tobias Faust](https://github.com/FaustTobias)
