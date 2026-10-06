import { hash } from "bcryptjs";

const PASSWORD_ROUNDS = 12;

export function hashPassword(password: string) {
  return hash(password, PASSWORD_ROUNDS);
}
