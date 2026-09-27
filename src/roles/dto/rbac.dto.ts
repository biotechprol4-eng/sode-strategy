import { IsNotEmpty, IsString, Length } from 'class-validator';

export class AssignRoleDto {
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @IsString()
  @IsNotEmpty()
  roleId: string;
}

export class AssignPermissionDto {
  @IsString()
  @IsNotEmpty()
  permissionId: string;
}
