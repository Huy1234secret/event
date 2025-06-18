const readline = require('readline');

const botName = 'EchoBot';

function greet() {
  return `Hello, I am ${botName}!`;
}

function respond(message) {
  return `You said: ${message}`;
}

function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Enter a message (or 'quit' to exit): "
  });

  console.log(greet());
  rl.prompt();

  rl.on('line', (line) => {
    const input = line.trim();
    if (input.toLowerCase() === 'quit') {
      console.log('Goodbye!');
      rl.close();
      return;
    }
    console.log(respond(input));
    rl.prompt();
  }).on('close', () => {
    console.log('Goodbye!');
  });
}

if (require.main === module) {
  main();
}
