/**
 * random id
 */
export const generateRandomId = (length = 26) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
};
/**
 * product slug
 */

export const createSlug = (name) => {
  // Convert to lowercase and replace spaces with hyphens
  let slug = name.toLowerCase().replace(/\s+/g, "-");

  // Remove special characters and symbols
  slug = slug.replace(/[^\w-]+/g, "");

  // Trim leading and trailing hyphens
  slug = slug.replace(/^-+|-+$/g, "");

  return slug;
};
