import { marked } from "marked";
import DOMPurify from 'dompurify';
import { convert } from "html-to-text";

export default {
  description: {
    format: '',
    desc: ''
  },
  args: {
    min: 0,
    max: 0,
  },
  subcommands: {
    explain: {
      description: {
        format: '[topic]',
        desc: 'Ask AI to explain a topic.'
      },
      args: {
        min: 0,
        max: 1,
        description: {
          '--src=[source]' : 'Add a source to get the information from (e.g. wikipedia)'
        }
      },
      execute: async ({flags, content}) => {
        if(!content) return `No prompt found.`;
        try {
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "model": "deepseek/deepseek-r1-0528-qwen3-8b:free",
              "messages": [
                {
                  "role": "user",
                  "content": `This is a prompt from a user. Please explain this concept in a concise but informative way: ${content}`,
                }
              ],
            })
          });

          const data = await res.json();

          return data.choices[0].message.content;
        } catch(error) {
          return `An error occurred: ${error.message}`;
        }
      } 
    },
    code: {
      description: {
        format: '--lang=[language] [prompt]',
        desc: 'Ask AI for a code snippet.'
      },
      args: {
        min: 1,
        max: 1,
      },
      execute: async ({flags, content}) => {
        if(!content) return `No prompt found.`;
        if(!flags.language) return `Enter a valid language argument.`
        try {
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "model": "deepseek/deepseek-r1-0528-qwen3-8b:free",
              "messages": [
                {
                  "role": "user",
                  "content": `I want a code snippet in the language of ${flags.language} on the prompt: ${content}. Make sure the code is concise and correct.`,
                }
              ],
            })
          });

          const data = await res.json();

          const result = data.choices[0].message.content;
          const html = DOMPurify.sanitize(marked(result));

          const text = convert(html, {
            wordwrap: false,
          })

          return text;
        } catch(error) {
          return `An error occurred: ${error.message}`;
        }
      }
    }
  },
}