import path from "path";
import fs from "fs";
// import text from "./task.txt";
//access arguments
const args = process.argv;
// filePath = path.join(__dirname, "task.txt");

//take current directory from the file
const curretDirectory = args[1].slice(0, -6);

if (fs.existsSync("./task.txt") === false) {
  let createStream = fs.createWriteStream("task.txt");
  createStream.end();
}

if (fs.existsSync("./completed.txt") === false) {
  let createStream = fs.createWriteStream("completed.txt");
  createStream.end();
}
const file = "task.txt";
const newFile = "completed.txt";
function usage() {
  const usageText = `
Usage:-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`;

  console.log(usageText);
}

function addTask() {
  const task = args[4];
  if (task) {
    const priority = args[3];
    fs.readFile(file, "utf8", function (err, data) {
      if (err) throw err;
      const tasks = data.split("\n");
      let maxTaskNumber = 0;
      tasks.forEach((item) => {
        const taskNumber = parseInt(item.split(".")[0]);
        if (taskNumber > maxTaskNumber) {
          maxTaskNumber = taskNumber;
        }
      });
      const newTaskNumber = maxTaskNumber + 1;
      const taskline = `${newTaskNumber}. ${task} [${priority}]\n`;
      console.log(taskline);

      fs.appendFile("task.txt", taskline, function (error) {
        if (error) {
          throw error;
        }
        console.log(`Added task: "${task}" with priority ${priority}`);
      });
    });
  } else console.log("provide priority and name ");
}

function listTask() {
  fs.readFile("./task.txt", "utf-8", function (error, data) {
    if (error) throw error;
    const task = data.split("\n");
    // console.log(task);
    task.sort((a, b) => {
      const priorityA = a.split("[")[1].split("]")[0];
      const priorityB = b.split("[")[1].split("]")[0];
      // console.log(priorityA - priorityB);
      //   return priorityB < priorityA ? -1 : priorityB > priorityA ? 1 : 0;
      return priorityA - priorityB;
    });
    console.log(task.join("\n"));
  });
}

function deleteTask() {
  const taskNumber = args[3];
  if (taskNumber) {
    fs.readFile(file, "utf-8", function (error, data) {
      if (error) {
        throw error;
      }
      const task = data.split("\n");
      let newTask = [];
      task.forEach((item) => {
        const itemNumber = parseInt(item.split(".")[0]);
        if (itemNumber != taskNumber) {
          newTask.push(item);
        }
      });
      // console.log(newTask);
      for (let i = 0; i < newTask.length - 2; i++) {
        newTask[i] = `${i + 1}.${newTask[i].split(".")[1]}`;
      }
      const newData = newTask.join("\n");
      console.log(newTask.length);
      if (taskNumber > newTask.length - 1) {
        console.log("task number does not exist");
      } else {
        fs.writeFile(file, newData, "utf-8", function (error) {
          if (error) throw error;
          console.log(`Task ${taskNumber} deleted!`);
        });
      }
    });
  } else console.log("provide task number");
}

function doneTask() {
  const taskNumber = args[3];
  if (taskNumber) {
    fs.readFile(file, "utf-8", function (error, data) {
      if (error) {
        throw error;
      }
      const task = data.split("\n");
      let newTask = [];
      let doneTask = [];
      let length = 0;
      task.forEach((item) => {
        length++;
        const itemNumber = parseInt(item.split(".")[0]);
        if (itemNumber == taskNumber) {
          doneTask.push(item.split("[")[0] + "\n");
        } else newTask.push(item);
      });

      // console.log(doneTask);
      // console.log(length);
      for (let i = 0; i < newTask.length - 2; i++) {
        newTask[i] = `${i + 1}.${newTask[i].split(".")[1]}`;
      }
      const newData = newTask.join("\n");
      const doneData = doneTask.join("\n");
      if (taskNumber < length) {
        fs.writeFile(file, newData, "utf-8", function (error) {
          if (error) throw error;
        });
        fs.appendFile("./completed.txt", doneData, (error) => {
          if (error) throw error;
          console.log("Marked item as done.");
        });
      } else console.log("task number does not exist");
    });
  } else console.log("please enter number to be marked as done");
}

function report() {
  let taskCount = 0;
  let doneCount = 0;

  fs.readFile("./task.txt", "utf-8", function (error, data) {
    if (error) throw error;
    const task = data.split("\n");
    task.forEach((item) => {
      taskCount++;
    });

    console.log(`Pending : ${taskCount - 1}\n`);
    console.log(task.join("\n"));
  });

  fs.readFile("./completed.txt", "utf-8", function (error, data) {
    if (error) throw error;
    const task = data.split("[");
    task.forEach((item) => {
      doneCount++;
    });

    console.log(`Completed : ${doneCount}\n`);
    console.log(task.join("\n"));
  });
}

switch (args[2]) {
  case "add": {
    addTask();
    break;
  }
  case "ls": {
    listTask();
    break;
  }
  case "del": {
    deleteTask();
    break;
  }
  case "done": {
    doneTask();
    break;
  }
  case "help": {
    usage();
    break;
  }
  case "report": {
    report();
    break;
  }
  default: {
    usage();
  }
}
