"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Security
    app.use((0, helmet_1.default)());
    // Basic in-memory rate limiter (simple/demo only)
    const rateMap = new Map();
    app.use((req, res, next) => {
        try {
            const key = req.ip || 'global';
            const now = Date.now();
            const entry = rateMap.get(key) || { count: 0, reset: now + 60 * 1000 };
            if (now > entry.reset) {
                entry.count = 0;
                entry.reset = now + 60 * 1000;
            }
            entry.count += 1;
            rateMap.set(key, entry);
            if (entry.count > 120) {
                res.status(429).json({ message: 'Too many requests' });
                return;
            }
        }
        catch (err) {
            // ignore rate errors
        }
        next();
    });
    // CORS
    app.enableCors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
    });
    // Global pipes
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    // Global exception filter
    const { AllExceptionsFilter } = await Promise.resolve().then(() => __importStar(require('./common/filters/all-exceptions.filter')));
    app.useGlobalFilters(new AllExceptionsFilter());
    // Swagger
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Logistics ERP API')
        .setDescription('Multi-tenant logistics ERP SaaS platform API')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = Number(process.env.PORT) || 3001;
    await app.listen(port);
    console.log(`Server running on port ${port}`);
    // Seed default tenant + admin for local/dev
    try {
        const { seedDefaultAdmin } = await Promise.resolve().then(() => __importStar(require('./common/seed')));
        await seedDefaultAdmin();
    }
    catch (err) {
        console.warn('Seeding skipped or failed:', err?.message || String(err));
    }
}
bootstrap().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=main.js.map