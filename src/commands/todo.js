
export default {
  subcommands: {
    add: {
      description: 'Add a task to your Todo list.',
      execute: ({flags, content}) => {
        let todoList = JSON.parse(localStorage.getItem('todoList')) || [];

        if(flags.due && !validateDueDate(flags.due)) {
          return `Invalid --due value. Use: today, yesterday, tomorrow, or YYYY-MM-DD.`;
        }
        const task = content;
        let due = flags.due ? flags.due : new Date().toISOString().split('T')[0];

        if(due === 'today') due = new Date().toISOString().split('T')[0];
        else if(due === 'yesterday') {
          let d = new Date();
          d.setDate(d.getDate() - 1);
          due = d.toISOString().split('T')[0];
        } else if (due === 'tomorrow') {
          let d = new Date();
          d.setDate(d.getDate() + 1);
          due = d.toISOString().split('T')[0];
        }

        todoList.push({
          task,
          due,
        });

        localStorage.setItem('todoList', JSON.stringify(todoList));
        return `Added task: '${task}'`;
      },
      args: {
        min: 0,
        max: 1,
      }
    },
    list: {
      description: 'Show your Todo list',
      execute: () => {
        const todoList = JSON.parse(localStorage.getItem('todoList')) || [];
        let output = todoList.length ? 'My Todos:\n\tID  Task                   Due Date\n\t------------------------------------------\n' : 'Your Todo List is empty!';
        let index = 1;
        for(const todo of todoList) {
          output += `\t${String(index++ + '.').padEnd(3)} ${String(todo.task).padEnd(22)} ${todo.due}\n`;
        }
        return output;
      }
    },
    clear: {
      description: 'Clear all todos',
      execute: () => {
        localStorage.removeItem('todoList');
        return 'Todo list cleared successfully.';
      }
    },
    done: {
      description: 'Mark a task as complete.',
      args: {
        min: 1,
        max: 1,
      },
      execute: ({args}) => {
        const index = Number(Object.keys(args)[0]) - 1;
        const todoList = JSON.parse(localStorage.getItem('todoList')) || [];

        if(!todoList.length) return `Todo List is empty.`;
        if(index+1 > todoList.length) return `Invalid index. Task does not exist.`;

        todoList.splice(index, 1);
        localStorage.setItem('todoList', JSON.stringify(todoList));

        return `Task no. ${index+1} has been removed.`;
      }
    }
  }
}


function validateDueDate(due) {
  const allowed = ['today', 'tomorrow', 'yesterday'];

  if(allowed.includes(due)) return true;

  const date = new Date(due);
  return !isNaN(date.getTime());
}