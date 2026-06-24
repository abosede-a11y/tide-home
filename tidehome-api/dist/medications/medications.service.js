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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedicationsService = exports.LogDoseDto = exports.UpdateMedicationDto = exports.CreateMedicationDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const medication_entity_1 = require("./medication.entity");
class CreateMedicationDto {
}
exports.CreateMedicationDto = CreateMedicationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "residentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "residentName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "medicationName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMedicationDto.prototype, "nextDue", void 0);
class UpdateMedicationDto {
}
exports.UpdateMedicationDto = UpdateMedicationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "medicationName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "dosage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "frequency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "instructions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMedicationDto.prototype, "status", void 0);
class LogDoseDto {
}
exports.LogDoseDto = LogDoseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LogDoseDto.prototype, "givenByName", void 0);
let MedicationsService = class MedicationsService {
    constructor(repo) {
        this.repo = repo;
    }
    findAll() {
        return this.repo.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
    }
    findByResident(residentId) {
        return this.repo.find({ where: { residentId, isActive: true } });
    }
    async create(dto) {
        const m = this.repo.create(dto);
        return this.repo.save(m);
    }
    async update(id, dto) {
        const m = await this.repo.findOne({ where: { id } });
        if (!m)
            throw new common_1.NotFoundException('Medication record not found');
        Object.assign(m, dto);
        return this.repo.save(m);
    }
    async logDose(id, dto, userId) {
        const m = await this.repo.findOne({ where: { id } });
        if (!m)
            throw new common_1.NotFoundException('Medication record not found');
        m.lastGiven = new Date();
        m.givenById = userId;
        m.givenByName = dto.givenByName;
        m.status = medication_entity_1.MedStatus.ON_TRACK;
        return this.repo.save(m);
    }
    async deactivate(id) {
        const m = await this.repo.findOne({ where: { id } });
        if (!m)
            throw new common_1.NotFoundException();
        m.isActive = false;
        await this.repo.save(m);
        return { message: 'Medication record removed' };
    }
};
exports.MedicationsService = MedicationsService;
exports.MedicationsService = MedicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(medication_entity_1.Medication)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MedicationsService);
//# sourceMappingURL=medications.service.js.map