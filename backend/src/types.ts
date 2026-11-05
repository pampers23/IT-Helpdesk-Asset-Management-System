import { UserRole } from '../generated/prisma/enums';

export type JwtUser = {
  id: number;
  sub: number;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export type JwtPayload = {
  sub: number;
  email: string;
  role: UserRole;
};