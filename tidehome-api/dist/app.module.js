"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const residents_module_1 = require("./residents/residents.module");
const medications_module_1 = require("./medications/medications.module");
const appointments_module_1 = require("./appointments/appointments.module");
const payments_module_1 = require("./payments/payments.module");
const blog_module_1 = require("./blog/blog.module");
const faq_module_1 = require("./faq/faq.module");
const permissions_module_1 = require("./permissions/permissions.module");
const chat_module_1 = require("./chat/chat.module");
let HealthController = class HealthController {
    health() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "health", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)()
], HealthController);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const databaseUrl = config.get('DATABASE_URL');
                    const isProduction = config.get('NODE_ENV') === 'production';
                    if (databaseUrl) {
                        return {
                            type: 'postgres',
                            url: databaseUrl,
                            entities: [__dirname + '/**/*.entity{.ts,.js}'],
                            synchronize: true,
                            ssl: isProduction ? { rejectUnauthorized: false } : false,
                            logging: false,
                        };
                    }
                    return {
                        type: 'postgres',
                        host: config.get('DATABASE_HOST', 'localhost'),
                        port: config.get('DATABASE_PORT', 5432),
                        username: config.get('DATABASE_USERNAME', 'postgres'),
                        password: config.get('DATABASE_PASSWORD', 'password'),
                        database: config.get('DATABASE_NAME', 'tidehome'),
                        entities: [__dirname + '/**/*.entity{.ts,.js}'],
                        synchronize: true,
                        logging: !isProduction,
                    };
                },
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            residents_module_1.ResidentsModule,
            medications_module_1.MedicationsModule,
            appointments_module_1.AppointmentsModule,
            payments_module_1.PaymentsModule,
            blog_module_1.BlogModule,
            faq_module_1.FaqModule,
            permissions_module_1.PermissionsModule,
            chat_module_1.ChatModule,
        ],
        controllers: [HealthController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map