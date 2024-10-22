import { Queue, Worker } from "bullmq";
import { exec } from "child_process";
import util from "util";
import { VM } from "vm2";
import fs from "fs";
import Redis from "ioredis";

const execPromise = util.promisify(exec);

// Redis connection
const connection = new Redis();

//  queues for Python, JavaScript, and C++
const pythonQueue = new Queue("pythonQueue", { connection });
const jsQueue = new Queue("jsQueue", { connection });
const cppQueue = new Queue("cppQueue", { connection });

// ProblemServices class
export class ProblemServices {
  // Enqueue Python job
  static async enqueuePythonJob(code: string) {
    await pythonQueue.add("runPythonCode", { code });
  }

  // Enqueue JavaScript job
  static async enqueueJSJob(code: string) {
    await jsQueue.add("runJavaScriptCode", { code });
  }

  // Enqueue C++ job
  static async enqueueCppJob(code: string) {
    await cppQueue.add("runCppCode", { code });
  }
}

// Worker to process Python jobs
new Worker(
  "pythonQueue",
  async (job) => {
    const { code } = job.data;
    const command = `python3 -c "${code}"`;
    try {
      const { stderr, stdout } = await execPromise(command);
      if (stderr) throw new Error("Python execution error: " + stderr);
      return stdout;
    } catch (error:any) {
      throw new Error("Python execution error: " + error.message);
    }
  },
  { connection }
);

// Worker to process JavaScript jobs
new Worker(
  "jsQueue",
  async (job) => {
    const { code } = job.data;
    const vm = new VM({
      timeout: 4000,
      sandbox: {},
    });
    try {
      const result = vm.run(code);
      return result;
    } catch (error: any) {
      throw new Error("JavaScript execution error: " + error.message);
    }
  },
  { connection }
);

new Worker(
  "cppQueue",
  async (job) => {
    const { code } = job.data;
    const cppFile = "temp.cpp";
    const execFile = "temp";
    const execCommand = `g++ ${cppFile} -o ${execFile} && ./${execFile}`;
    try {
      fs.writeFileSync(cppFile, code);
      await execPromise(`ulimit -v 1024 && timeout 4 ${execCommand}`);
      const output = await execPromise(`./${execFile}`);
      return output.stdout;
    } catch (error: any) {
      throw new Error("C++ execution error: " + error.message);
    } finally {
      fs.unlinkSync(cppFile);
      await execPromise(`rm ${execFile}`);
    }
  },
  { connection }
);
