# Vibe

### Requirements
* [node.js](https://nodejs.org/en) >= 20
* [pnpm](https://pnpm.io/) >= 8

## Installation guide

* Clone repo:
```
git clone git@github.com:bobadj/vibe.git
```
* Install dependencies with ``pnpm``
```
cd vibe/
pnpm install
```
* Visit https://cors-anywhere.herokuapp.com and "Request temporary access.."
* start development server
```bash
pnpm run dev 
```
or
```bash
npm run dev
```

#### *note: it's not recommended to store `.env` with secrets, however, the content of `.env` is there just for a convenient startup. Keys stored there will be deleted shortly*
