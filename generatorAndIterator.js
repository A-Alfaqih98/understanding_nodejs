(async () => {
  function* simpleGenerator() {
    yield 1;
    yield 2;
  }
  const generator = simpleGenerator();
  console.log(generator.next());
  console.log(generator.next());
  console.log(generator.next());

  const delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(ms);
      }, ms);
    });
  };

  async function* asyncGenerator() {
    // Two ways to return from a promise
    yield await delay(1000).then((ms) => ms);
    yield await delay(4000);
  }

  for await (const item of asyncGenerator()) {
    console.log(item);
  }
})();
