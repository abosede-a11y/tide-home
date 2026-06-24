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
exports.Resident = exports.CarePackage = exports.ResidentStatus = void 0;
const typeorm_1 = require("typeorm");
var ResidentStatus;
(function (ResidentStatus) {
    ResidentStatus["STABLE"] = "stable";
    ResidentStatus["MONITORING"] = "monitoring";
    ResidentStatus["ATTENTION"] = "attention";
    ResidentStatus["CRITICAL"] = "critical";
})(ResidentStatus || (exports.ResidentStatus = ResidentStatus = {}));
var CarePackage;
(function (CarePackage) {
    CarePackage["STANDARD"] = "Standard Care";
    CarePackage["ENHANCED"] = "Enhanced Care";
    CarePackage["PREMIUM"] = "Premium Care";
})(CarePackage || (exports.CarePackage = CarePackage = {}));
let Resident = class Resident {
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
};
exports.Resident = Resident;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Resident.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Resident.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Resident.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Resident.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Resident.prototype, "roomNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Resident.prototype, "floor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: CarePackage, default: CarePackage.STANDARD }),
    __metadata("design:type", String)
], Resident.prototype, "carePackage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ResidentStatus, default: ResidentStatus.STABLE }),
    __metadata("design:type", String)
], Resident.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Resident.prototype, "photoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Resident.prototype, "medicalHistory", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Resident.prototype, "allergies", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Resident.prototype, "emergencyContact", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Resident.prototype, "emergencyPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Resident.prototype, "gpName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Resident.prototype, "gpPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Resident.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Resident.prototype, "guardianUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Resident.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Resident.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Resident.prototype, "updatedAt", void 0);
exports.Resident = Resident = __decorate([
    (0, typeorm_1.Entity)('residents')
], Resident);
//# sourceMappingURL=resident.entity.js.map