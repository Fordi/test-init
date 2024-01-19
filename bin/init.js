#!/usr/bin/env node
import * as cp from "node:child_process";
import { promisify } from "node:util";
import { stat, readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";

const exec = promisify(cp.exec);

const exists = async (path) => {
  try {
    await stat(path);
    return true;
  } catch (e) {
    return false;
  }
};

const findRoot = async (path) => {
  if (path === "/") {
    throw new Error();
  }
  if (await exists(resolve(path, "package.json"))) {
    return path;
  }
  try {
    return await findRoot(dirname(path));
  } catch (e) {
    throw new Error(`"${path}" is not part of any project.`);
  }
};

const cwd = await findRoot(process.cwd());

let didSomething = false;

let pkg = JSON.parse(await readFile(resolve(cwd, "package.json"), "utf8"));
if (!("c8" in (pkg.devDependencies ?? {}))) {
  console.log("Installing c8");
  await exec("npm i -D c8", { cwd });
  pkg = JSON.parse(await readFile(resolve(cwd, "package.json"), "utf8"));
  didSomething = true;
}
if (!(await exists(resolve(cwd, ".c8rc")))) {
  console.log("Creating .c8rc (test reporter config) with basic defaults");
  await writeFile(
    resolve(cwd, ".c8rc"),
    JSON.stringify(
      {
        reporter: ["html"],
        all: true,
        reportDir: "./coverage",
        src: ".",
        include: ["*", "**/*"],
        exclude: ["coverage/**/*", "*.test/**/*", "**/*.test*"],
        checkCoverage: true,
        lines: 75,
        functions: 75,
        statements: 75,
        branches: 75,
      },
      null,
      2
    ),
    "utf8"
  );
  didSomething = true;
}

if (!("node:test" in (pkg.scripts ?? {}))) {
  console.log("Adding test runner script");
  pkg.scripts = pkg.scripts ?? {};
  pkg.scripts["node:test"] = "c8 -- node --test";
  await writeFile(
    resolve(cwd, "package.json"),
    JSON.stringify(pkg, null, 2),
    "utf8"
  );
  didSomething = true;
}

if (!didSomething) {
  console.log("Nothing to do.");
}
