import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<import("./dto/auth.dto").AuthResponseDto>;
    login(dto: LoginDto): Promise<import("./dto/auth.dto").AuthResponseDto>;
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
    }>;
}
//# sourceMappingURL=auth.controller.d.ts.map