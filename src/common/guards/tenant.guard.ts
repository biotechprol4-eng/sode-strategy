import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RequestWithUser } from '../types/request-with-user.type';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (!user?.organizationId) {
      throw new ForbiddenException('Organization context is required');
    }

    const routeOrganizationId =
      request.params?.organizationId ??
      request.params?.id ??
      request.body?.organizationId ??
      request.query?.organizationId;

    if (
      routeOrganizationId &&
      String(routeOrganizationId) !== String(user.organizationId)
    ) {
      throw new ForbiddenException('Cross-tenant access is not allowed');
    }

    return true;
  }
}
