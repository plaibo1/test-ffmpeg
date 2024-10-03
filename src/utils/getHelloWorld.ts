export const getHelloWorld = (obj: Record<string, string>) => {
  return { hello: "world", heeeeel: "yeeeah", ...obj };
};
