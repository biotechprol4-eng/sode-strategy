import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'sode:permissions';
export const Permissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
