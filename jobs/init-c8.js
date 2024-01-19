import { resolve } from "path";
import { exec, exists, readJson, writeJson } from "@fordi-org/scripting";
const ownProject = new URL("..", import.meta.url).pathname;

export default [
  {
    name: "Installing c8",
    if: async () =>
      !("c8" in ((await readJson("package.json")).devDependencies ?? {})),
    do: async () => await exec("npm i -D c8"),
    undo: async () => await exec("npm r -D c8"),
  },
  {
    name: "Creating .c8rc (test reporter config) with basic defaults",
    if: async () => !(await exists(".c8rc")),
    willChange: () => [".c8rc"],
    do: async () =>
      await writeJson(
        ".c8rc",
        await readJson(resolve(ownProject, "defaultC8Config.json"))
      ),
  },
  {
    name: "Adding test runner script",
    if: async () =>
      !("node:test" in ((await readJson("package.json")).scripts ?? {})),
    willChange: () => ["package.json"],
    do: async () => {
      const pkg = await readJson("package.json");
      pkg.scripts = Object.assign(pkg.scripts ?? {}, {
        "node:test": "c8 -- node --test",
      });
      await writeJson("package.json", pkg);
    },
  },
];
