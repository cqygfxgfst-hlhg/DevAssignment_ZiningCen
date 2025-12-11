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
exports.TrendOptions = exports.UserPreferences = exports.NormalizedMarket = void 0;
const swagger_1 = require("@nestjs/swagger");
class NormalizedMarket {
    platform;
    id;
    question;
    probability;
    volume;
    volume24h;
    liquidity;
    createdAt;
    endDate;
    category;
    url;
    lastUpdated;
    trendScore;
    _activity;
    _activityRaw;
}
exports.NormalizedMarket = NormalizedMarket;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['Polymarket', 'Kalshi'], description: '来源平台' }),
    __metadata("design:type", String)
], NormalizedMarket.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '市场唯一标识符' }),
    __metadata("design:type", String)
], NormalizedMarket.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '预测问题标题' }),
    __metadata("design:type", String)
], NormalizedMarket.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '当前概率 (0-1)', example: 0.65 }),
    __metadata("design:type", Number)
], NormalizedMarket.prototype, "probability", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '总交易量 (USD)', required: false }),
    __metadata("design:type", Number)
], NormalizedMarket.prototype, "volume", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '24小时交易量 (USD)', required: false }),
    __metadata("design:type", Number)
], NormalizedMarket.prototype, "volume24h", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '流动性深度 (USD)', required: false }),
    __metadata("design:type", Number)
], NormalizedMarket.prototype, "liquidity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '创建时间 (ISO 8601)', required: false }),
    __metadata("design:type", String)
], NormalizedMarket.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '结束时间 (ISO 8601)', required: false }),
    __metadata("design:type", String)
], NormalizedMarket.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '类别标签', required: false, type: [String] }),
    __metadata("design:type", Array)
], NormalizedMarket.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '市场链接', required: false }),
    __metadata("design:type", String)
], NormalizedMarket.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '最后更新时间', required: false }),
    __metadata("design:type", String)
], NormalizedMarket.prototype, "lastUpdated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '趋势得分', required: false }),
    __metadata("design:type", Number)
], NormalizedMarket.prototype, "trendScore", void 0);
class UserPreferences {
    categories;
    platformWeights;
    timeHorizon;
    volatility;
}
exports.UserPreferences = UserPreferences;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "偏好类别：如 'Politics', 'Crypto', 'Sports'",
        required: false,
        type: [String],
    }),
    __metadata("design:type", Array)
], UserPreferences.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '平台权重：如 { Polymarket: 1.5, Kalshi: 1.0 }',
        required: false,
    }),
    __metadata("design:type", Object)
], UserPreferences.prototype, "platformWeights", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '时间偏好：short (<7d), medium (<30d), long (>30d)',
        required: false,
        enum: ['short', 'medium', 'long'],
    }),
    __metadata("design:type", String)
], UserPreferences.prototype, "timeHorizon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '波动偏好：high (uncertainty), low (stability)',
        required: false,
        enum: ['high', 'low'],
    }),
    __metadata("design:type", String)
], UserPreferences.prototype, "volatility", void 0);
class TrendOptions {
    limit;
    platform;
    endWithinHours;
    createdWithinHours;
    personalized;
    preferences;
}
exports.TrendOptions = TrendOptions;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '限制返回数量', default: 20, required: false }),
    __metadata("design:type", Number)
], TrendOptions.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['Polymarket', 'Kalshi'],
        required: false,
        description: '指定平台',
    }),
    __metadata("design:type", String)
], TrendOptions.prototype, "platform", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '过滤在指定小时数内结束的市场',
        required: false,
    }),
    __metadata("design:type", String)
], TrendOptions.prototype, "endWithinHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: '过滤在指定小时数内创建的市场',
        required: false,
    }),
    __metadata("design:type", String)
], TrendOptions.prototype, "createdWithinHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '是否启用个性化排序', required: false }),
    __metadata("design:type", Boolean)
], TrendOptions.prototype, "personalized", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: UserPreferences, required: false }),
    __metadata("design:type", UserPreferences)
], TrendOptions.prototype, "preferences", void 0);
//# sourceMappingURL=market.dto.js.map