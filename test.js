const hello = () => {
  return "hello";
};

const test = () => void hello();

console.log(test());
