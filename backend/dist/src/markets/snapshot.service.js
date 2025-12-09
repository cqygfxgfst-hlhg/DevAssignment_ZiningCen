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
var SnapshotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let SnapshotService = SnapshotService_1 = class SnapshotService {
    prisma;
    logger = new common_1.Logger(SnapshotService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(markets) {
        if (!markets.length)
            return;
        try {
            await this.prisma.marketSnapshot.createMany({
                data: markets.map((m) => ({
                    platform: m.platform,
                    marketId: m.id,
                    question: m.question,
                    probability: Number(m.probability),
                    volume: m.volume !== undefined ? Number(m.volume) : null,
                    volume24h: m.volume24h !== undefined ? Number(m.volume24h) : null,
                    liquidity: m.liquidity !== undefined ? Number(m.liquidity) : null,
                    createdAt: m.createdAt ? new Date(m.createdAt) : null,
                    endDate: m.endDate ? new Date(m.endDate) : null,
                    trendScore: m.trendScore !== undefined ? Number(m.trendScore) : null,
                })),
            });
        }
        catch (err) {
            this.logger.warn(`Failed to persist snapshots: ${err instanceof Error ? err.message : err}`);
        }
    }
    async getLatest(limit, platform) {
        const latest = await this.prisma.marketSnapshot.findFirst({
            where: platform ? { platform } : {},
            orderBy: { fetchedAt: 'desc' },
            select: { fetchedAt: true },
        });
        if (!latest?.fetchedAt)
            return [];
        return this.prisma.marketSnapshot.findMany({
            where: {
                fetchedAt: latest.fetchedAt,
                ...(platform ? { platform } : {}),
            },
            orderBy: { trendScore: 'desc' },
            take: limit,
        });
    }
};
exports.SnapshotService = SnapshotService;
exports.SnapshotService = SnapshotService = SnapshotService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SnapshotService);
//# sourceMappingURL=snapshot.service.js.map