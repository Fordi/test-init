# Native Test Init

This command will set up Node's native test runner, with coverage support, under the package script `node:test`.

There is no installation necessary.  To use it:

```bash
npx '@fordi-org/test-init'
```

```plaintext
Installing c8
Creating .c8rc (test reporter config) with basic defaults
Adding test runner script
```

This is equivalent to:

1. Running `npm i -D c8`
2. Creating `.c8rc` with the content:
    ```json
    {
      "reporter": [
        "html"
      ],
      "all": true,
      "reportDir": "./coverage",
      "src": ".",
      "include": [
        "*",
        "**/*"
      ],
      "exclude": [
        "coverage/**/*",
        "*.test/**/*",
        "**/*.test*"
      ],
      "checkCoverage": true,
      "lines": 75,
      "functions": 75,
      "statements": 75,
      "branches": 75
    }
    ```
3. Adding the script `"node:test": "c8 -- node --test"`
