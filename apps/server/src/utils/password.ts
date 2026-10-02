import bcrypt from "bcrypt";

const hashPassword = async (plainText: string): Promise<string> => {
  return bcrypt.hash(plainText, 10);
};

const comparePassword = async (
  plainText: string,
  hashed: string,
): Promise<boolean> => {
  return bcrypt.compare(plainText, hashed);
};

export { hashPassword, comparePassword };
