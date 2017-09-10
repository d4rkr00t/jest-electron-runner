# jest-electron-runner

Jest test runner that executes tests in Electron's BrowserWindow environment, which gives you access to all browser APIs
available there.

> EXPERIMENTAL. NOT READY FOR ANY SERIOUS USE !!!!

![jest electron runner](/assets/jest-electron-full.gif)

## How to use

```js
"jest": {
  "runner": "jest-electron-runner",
  // Environment is important, otherwise jest will use jsdom by default.
  "testEnvironment": "jest-environment-electron"
}
```
