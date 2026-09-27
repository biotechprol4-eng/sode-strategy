export type AuthUser = {
  sub: string;
  email?: string;
  organizationId: string;
  role?: string;
};

export type RequestWithUser = Request & {
  user: AuthUser;
};
