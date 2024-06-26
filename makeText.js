const fs = require("fs");
const process = require("process");
const axios = require("axios");
const { MarkovMachine } = require("./markov");
const { convert } = require('html-to-text');

/** Generate text from input text */
function generateText(text) {
  let mm = new MarkovMachine(text);
  const generator = mm.makeTextGenerator();
  
  function printNextWord() {
    const next = generator.next();
    if (!next.done) {
      process.stdout.write(next.value + " ");
      setTimeout(printNextWord, 500); // Adjust the delay as needed
    } else {
      console.log();
    }
  }
  
  printNextWord();
}

/** Read file and generate text */
function makeText(path) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading file: ${path}: ${err}`);
      process.exit(1);
    } else {
      generateText(data);
    }
  });
}

/** Fetch URL and generate text */
async function makeURLText(url) {
  try {
    let resp = await axios.get(url);
    let text = convert(resp.data, {
      wordwrap: false,
      ignoreImage: true,
      noLinkBrackets: true,
    });
    generateText(text);
  } catch (err) {
    console.error(`Error fetching URL: ${url}: ${err}`);
    process.exit(1);
  }
}

/** Main function to handle command-line arguments and initiate text generation */
async function main() {
  let inputs = process.argv.slice(2);
  if (inputs.length === 0) {
    console.error("Usage: node makeText.js <method> <path> [<method> <path> ...]");
    console.error("Methods: 'file' or 'url'");
    process.exit(1);
  }

  let text = '';

  for (let i = 0; i < inputs.length; i += 2) {
    let method = inputs[i];
    let path = inputs[i + 1];

    if (!method || !path) {
      console.error("Usage: node makeText.js <method> <path> [<method> <path> ...]");
      console.error("Methods: 'file' or 'url'");
      process.exit(1);
    }

    if (method === "file") {
      try {
        const data = fs.readFileSync(path, "utf8");
        text += data + ' ';
      } catch (err) {
        console.error(`Error reading file: ${path}: ${err}`);
        process.exit(1);
      }
    } else if (method === "url") {
      try {
        const resp = await axios.get(path);
        const plainText = convert(resp.data, {
          wordwrap: false,
          ignoreImage: true,
          noLinkBrackets: true,
        });
        text += plainText + ' ';
      } catch (err) {
        console.error(`Error fetching URL: ${path}: ${err}`);
        process.exit(1);
      }
    } else {
      console.error(`Unknown method: ${method}`);
      console.error("Methods: 'file' or 'url'");
      process.exit(1);
    }
  }

  generateText(text);
}

main();
