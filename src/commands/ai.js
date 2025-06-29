
export default {
  description: 'ask AI',
  args: {
    min: 0,
    max: 1,
  },
  execute: async ({content}) => {
    if(!content) return `Please enter a prompt.`;

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
              "content": content,
            }
          ]
        })
      });

      const data = await res.json();

      return data.choices[0].message.content;
    } catch (error) {
      return `Error occurred: ${error.message}`;
    }
  }
}