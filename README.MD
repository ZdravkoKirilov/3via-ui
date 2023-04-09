# A sample React app for building Quiz configurations.

<br />

<img src="https://i.imgur.com/63lrcDr.png" alt="Project screenshot" />

---

<br />

[Live site](https://zdravkokirilov.github.io/3via-ui/)


## Technologies

- bootstrapped with Vite
- uses React 18 with typescript
- uses react-query, react-hook-form, mui

## Functionality

- Questions: add / edit / delete / reorder
- Answers: add / delete / reorder
- there is artificial delay + radom fail probability in order to showcase the UI feedback
- doesn't make actual API calls, the data is kept in memory which means that restarting the app cleans everything up
- there are a few preseeded questions for testing convenience

## Goals

- accompanies a [technical article](https://dev.to/zdravkokirilov/the-hook-of-all-trades-or-how-i-simplify-big-react-components-bod) showing a way to structure heavy CRUD operations on the FE with the help of custom hooks

## Running it locally:

- pull the repo
- make sure you have a recent version on NodeJS, e.g. - 16+
- run ```npm i``` insde the project folder
- once ready, run ```npm run dev```
- open the browser at http://localhost:5173/3via-ui/ or just check what the cmd says



