import { SetMetadata } from '@nestjs/common';
import { $Enums } from '@prisma/client';

const Roles = (role: $Enums.Role[]) => SetMetadata('role', role);
export default Roles;
