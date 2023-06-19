import { registerEnumType } from "@nestjs/graphql";

export enum ValidRoles {
    ADMIN = 'ADMIN',
    USER = 'USER',
    SUPERUSER = 'SUPERUSER'
}

registerEnumType(ValidRoles, {name: 'ValidRoles', description: 'Roles permitidos'});