export const logTime = (msg: string) =>
  console.log(msg, new Date(Date.now()).getSeconds());
