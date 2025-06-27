export default {
  description: 'Search up the meaning of a word',
  args: {
    min: 0,
    max: 0,
  },
  execute: async ({content}) => {
    const words = content.split(' ');
    if(words.length > 1) return 'Enter only one word.';
    const word = words[0];

    let output = `Definition(s) of ${word}:\n`;
    try {
      const dictionaryRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if(!dictionaryRes.ok) {
        const errorData = await dictionaryRes.json();
        return errorData.title;
      }
      const dictionaryData = await dictionaryRes.json();
      const meaningArr = dictionaryData[0].meanings;

      for(const meaning of meaningArr) {
        output +=  `\t(${meaning.partOfSpeech}) ${meaning.definitions[0].definition}\n`;
      }
    } catch(error) {
      return `Error occurred: ${error.message}`;
    }

    return output;
  }
}