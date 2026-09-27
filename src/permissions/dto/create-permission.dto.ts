import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ResourceType {
  MEMBERS = 'members',
  ROLES = 'roles',
  PERMISSIONS = 'permissions',
  ORGANIZATIONS = 'organizations',
  SESSIONS = 'sessions',
  AUDIT = 'audit',
  CREDITS = 'credits',
  OTP = 'otp',
}

export enum ActionType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

export class CreatePermissionDto {
  @IsEnum(ResourceType)
  @IsNotEmpty()
  resource: ResourceType;

  @IsEnum(ActionType)
  @IsNotEmpty()
  action: ActionType;

  @IsString()
  @IsOptional()
  description?: string;
}
