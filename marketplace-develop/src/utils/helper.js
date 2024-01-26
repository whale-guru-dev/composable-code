export const shorten = (str, amountFromSides) =>
  str.length > 20
    ? `${str.substring(0, amountFromSides)}...${str.substring(str.length - amountFromSides)}`
    : '';

export const copyToClipboard = async (text) => {
  return await navigator.clipboard.writeText(text);
};
