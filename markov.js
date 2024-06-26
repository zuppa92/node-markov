/** Textual markov chain generator */

class MarkovMachine {

  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter(c => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the cat": ["in"], "cat in": ["the"], "in the": ["hat"], "the hat": ["is", "hat"], "hat is": ["in"], "is in": ["the"], "hat in": ["the"], "in the": [null]} */

  makeChains() {
    let chains = new Map();

    for (let i = 0; i < this.words.length - 1; i++) {
      let bigram = `${this.words[i]} ${this.words[i + 1]}`;
      let nextWord = this.words[i + 2] || null;

      if (chains.has(bigram)) {
        chains.get(bigram).push(nextWord);
      } else {
        chains.set(bigram, [nextWord]);
      }
    }

    this.chains = chains;
  }

  /** static method to randomly select an element from an array */
  static choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /** generator function to yield words one by one */
  *makeTextGenerator(numWords = 100) {
    let keys = Array.from(this.chains.keys());
    let capitalizedKeys = keys.filter(k => k[0] === k[0].toUpperCase());

    // If no capitalized keys are found, use all keys
    if (capitalizedKeys.length === 0) {
      capitalizedKeys = keys;
    }

    let key = MarkovMachine.choice(capitalizedKeys);
    let out = key.split(" ");

    for (let word of out) {
      yield word;
    }

    while (out.length < numWords && key !== null) {
      let nextWords = this.chains.get(key);
      let nextWord = MarkovMachine.choice(nextWords);

      if (nextWord === null) break;

      out.push(nextWord);
      key = `${out[out.length - 2]} ${out[out.length - 1]}`;

      yield nextWord;

      if (nextWord.endsWith('.')) break;
    }
  }
}

module.exports = {
  MarkovMachine,
};
