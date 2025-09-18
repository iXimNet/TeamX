// This DTO is used internally by the UsersService.
// The Auth's RegisterUserDto will be used for the public-facing API.
export class CreateUserDto {
    fullName: string;
    email: string;
    passwordHash: string;
    role?: 'ADMIN' | 'MEMBER';
}
