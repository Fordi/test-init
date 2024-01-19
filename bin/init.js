#!/usr/bin/env node
import { inLocalPrefix, runJobs } from "@fordi-org/scripting";
import jobs from "../jobs/init-c8.js";

try {
  await inLocalPrefix(() => runJobs(jobs));
} catch (e) {
  console.error(e.message);
  process.exit(e.errorLevel ?? -1);
}
