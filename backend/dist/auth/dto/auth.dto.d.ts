export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    tenantId: string;
}
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        tenantId: string;
    };
}
export declare class RefreshTokenDto {
    refreshToken: string;
}
//# sourceMappingURL=auth.dto.d.ts.map