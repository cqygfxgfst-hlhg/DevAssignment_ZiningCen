import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type MarketSnapshotModel = runtime.Types.Result.DefaultSelection<Prisma.$MarketSnapshotPayload>;
export type AggregateMarketSnapshot = {
    _count: MarketSnapshotCountAggregateOutputType | null;
    _avg: MarketSnapshotAvgAggregateOutputType | null;
    _sum: MarketSnapshotSumAggregateOutputType | null;
    _min: MarketSnapshotMinAggregateOutputType | null;
    _max: MarketSnapshotMaxAggregateOutputType | null;
};
export type MarketSnapshotAvgAggregateOutputType = {
    probability: number | null;
    volume: number | null;
    volume24h: number | null;
    liquidity: number | null;
    trendScore: number | null;
};
export type MarketSnapshotSumAggregateOutputType = {
    probability: number | null;
    volume: number | null;
    volume24h: number | null;
    liquidity: number | null;
    trendScore: number | null;
};
export type MarketSnapshotMinAggregateOutputType = {
    id: string | null;
    platform: string | null;
    marketId: string | null;
    question: string | null;
    probability: number | null;
    volume: number | null;
    volume24h: number | null;
    liquidity: number | null;
    createdAt: Date | null;
    endDate: Date | null;
    trendScore: number | null;
    fetchedAt: Date | null;
};
export type MarketSnapshotMaxAggregateOutputType = {
    id: string | null;
    platform: string | null;
    marketId: string | null;
    question: string | null;
    probability: number | null;
    volume: number | null;
    volume24h: number | null;
    liquidity: number | null;
    createdAt: Date | null;
    endDate: Date | null;
    trendScore: number | null;
    fetchedAt: Date | null;
};
export type MarketSnapshotCountAggregateOutputType = {
    id: number;
    platform: number;
    marketId: number;
    question: number;
    probability: number;
    volume: number;
    volume24h: number;
    liquidity: number;
    createdAt: number;
    endDate: number;
    trendScore: number;
    fetchedAt: number;
    _all: number;
};
export type MarketSnapshotAvgAggregateInputType = {
    probability?: true;
    volume?: true;
    volume24h?: true;
    liquidity?: true;
    trendScore?: true;
};
export type MarketSnapshotSumAggregateInputType = {
    probability?: true;
    volume?: true;
    volume24h?: true;
    liquidity?: true;
    trendScore?: true;
};
export type MarketSnapshotMinAggregateInputType = {
    id?: true;
    platform?: true;
    marketId?: true;
    question?: true;
    probability?: true;
    volume?: true;
    volume24h?: true;
    liquidity?: true;
    createdAt?: true;
    endDate?: true;
    trendScore?: true;
    fetchedAt?: true;
};
export type MarketSnapshotMaxAggregateInputType = {
    id?: true;
    platform?: true;
    marketId?: true;
    question?: true;
    probability?: true;
    volume?: true;
    volume24h?: true;
    liquidity?: true;
    createdAt?: true;
    endDate?: true;
    trendScore?: true;
    fetchedAt?: true;
};
export type MarketSnapshotCountAggregateInputType = {
    id?: true;
    platform?: true;
    marketId?: true;
    question?: true;
    probability?: true;
    volume?: true;
    volume24h?: true;
    liquidity?: true;
    createdAt?: true;
    endDate?: true;
    trendScore?: true;
    fetchedAt?: true;
    _all?: true;
};
export type MarketSnapshotAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MarketSnapshotWhereInput;
    orderBy?: Prisma.MarketSnapshotOrderByWithRelationInput | Prisma.MarketSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.MarketSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MarketSnapshotCountAggregateInputType;
    _avg?: MarketSnapshotAvgAggregateInputType;
    _sum?: MarketSnapshotSumAggregateInputType;
    _min?: MarketSnapshotMinAggregateInputType;
    _max?: MarketSnapshotMaxAggregateInputType;
};
export type GetMarketSnapshotAggregateType<T extends MarketSnapshotAggregateArgs> = {
    [P in keyof T & keyof AggregateMarketSnapshot]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMarketSnapshot[P]> : Prisma.GetScalarType<T[P], AggregateMarketSnapshot[P]>;
};
export type MarketSnapshotGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MarketSnapshotWhereInput;
    orderBy?: Prisma.MarketSnapshotOrderByWithAggregationInput | Prisma.MarketSnapshotOrderByWithAggregationInput[];
    by: Prisma.MarketSnapshotScalarFieldEnum[] | Prisma.MarketSnapshotScalarFieldEnum;
    having?: Prisma.MarketSnapshotScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MarketSnapshotCountAggregateInputType | true;
    _avg?: MarketSnapshotAvgAggregateInputType;
    _sum?: MarketSnapshotSumAggregateInputType;
    _min?: MarketSnapshotMinAggregateInputType;
    _max?: MarketSnapshotMaxAggregateInputType;
};
export type MarketSnapshotGroupByOutputType = {
    id: string;
    platform: string;
    marketId: string;
    question: string;
    probability: number;
    volume: number | null;
    volume24h: number | null;
    liquidity: number | null;
    createdAt: Date | null;
    endDate: Date | null;
    trendScore: number | null;
    fetchedAt: Date;
    _count: MarketSnapshotCountAggregateOutputType | null;
    _avg: MarketSnapshotAvgAggregateOutputType | null;
    _sum: MarketSnapshotSumAggregateOutputType | null;
    _min: MarketSnapshotMinAggregateOutputType | null;
    _max: MarketSnapshotMaxAggregateOutputType | null;
};
type GetMarketSnapshotGroupByPayload<T extends MarketSnapshotGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MarketSnapshotGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MarketSnapshotGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MarketSnapshotGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MarketSnapshotGroupByOutputType[P]>;
}>>;
export type MarketSnapshotWhereInput = {
    AND?: Prisma.MarketSnapshotWhereInput | Prisma.MarketSnapshotWhereInput[];
    OR?: Prisma.MarketSnapshotWhereInput[];
    NOT?: Prisma.MarketSnapshotWhereInput | Prisma.MarketSnapshotWhereInput[];
    id?: Prisma.StringFilter<"MarketSnapshot"> | string;
    platform?: Prisma.StringFilter<"MarketSnapshot"> | string;
    marketId?: Prisma.StringFilter<"MarketSnapshot"> | string;
    question?: Prisma.StringFilter<"MarketSnapshot"> | string;
    probability?: Prisma.FloatFilter<"MarketSnapshot"> | number;
    volume?: Prisma.FloatNullableFilter<"MarketSnapshot"> | number | null;
    volume24h?: Prisma.FloatNullableFilter<"MarketSnapshot"> | number | null;
    liquidity?: Prisma.FloatNullableFilter<"MarketSnapshot"> | number | null;
    createdAt?: Prisma.DateTimeNullableFilter<"MarketSnapshot"> | Date | string | null;
    endDate?: Prisma.DateTimeNullableFilter<"MarketSnapshot"> | Date | string | null;
    trendScore?: Prisma.FloatNullableFilter<"MarketSnapshot"> | number | null;
    fetchedAt?: Prisma.DateTimeFilter<"MarketSnapshot"> | Date | string;
};
export type MarketSnapshotOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    question?: Prisma.SortOrder;
    probability?: Prisma.SortOrder;
    volume?: Prisma.SortOrderInput | Prisma.SortOrder;
    volume24h?: Prisma.SortOrderInput | Prisma.SortOrder;
    liquidity?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    endDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    trendScore?: Prisma.SortOrderInput | Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type MarketSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.MarketSnapshotWhereInput | Prisma.MarketSnapshotWhereInput[];
    OR?: Prisma.MarketSnapshotWhereInput[];
    NOT?: Prisma.MarketSnapshotWhereInput | Prisma.MarketSnapshotWhereInput[];
    platform?: Prisma.StringFilter<"MarketSnapshot"> | string;
    marketId?: Prisma.StringFilter<"MarketSnapshot"> | string;
    question?: Prisma.StringFilter<"MarketSnapshot"> | string;
    probability?: Prisma.FloatFilter<"MarketSnapshot"> | number;
    volume?: Prisma.FloatNullableFilter<"MarketSnapshot"> | number | null;
    volume24h?: Prisma.FloatNullableFilter<"MarketSnapshot"> | number | null;
    liquidity?: Prisma.FloatNullableFilter<"MarketSnapshot"> | number | null;
    createdAt?: Prisma.DateTimeNullableFilter<"MarketSnapshot"> | Date | string | null;
    endDate?: Prisma.DateTimeNullableFilter<"MarketSnapshot"> | Date | string | null;
    trendScore?: Prisma.FloatNullableFilter<"MarketSnapshot"> | number | null;
    fetchedAt?: Prisma.DateTimeFilter<"MarketSnapshot"> | Date | string;
}, "id">;
export type MarketSnapshotOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    question?: Prisma.SortOrder;
    probability?: Prisma.SortOrder;
    volume?: Prisma.SortOrderInput | Prisma.SortOrder;
    volume24h?: Prisma.SortOrderInput | Prisma.SortOrder;
    liquidity?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    endDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    trendScore?: Prisma.SortOrderInput | Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    _count?: Prisma.MarketSnapshotCountOrderByAggregateInput;
    _avg?: Prisma.MarketSnapshotAvgOrderByAggregateInput;
    _max?: Prisma.MarketSnapshotMaxOrderByAggregateInput;
    _min?: Prisma.MarketSnapshotMinOrderByAggregateInput;
    _sum?: Prisma.MarketSnapshotSumOrderByAggregateInput;
};
export type MarketSnapshotScalarWhereWithAggregatesInput = {
    AND?: Prisma.MarketSnapshotScalarWhereWithAggregatesInput | Prisma.MarketSnapshotScalarWhereWithAggregatesInput[];
    OR?: Prisma.MarketSnapshotScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MarketSnapshotScalarWhereWithAggregatesInput | Prisma.MarketSnapshotScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"MarketSnapshot"> | string;
    platform?: Prisma.StringWithAggregatesFilter<"MarketSnapshot"> | string;
    marketId?: Prisma.StringWithAggregatesFilter<"MarketSnapshot"> | string;
    question?: Prisma.StringWithAggregatesFilter<"MarketSnapshot"> | string;
    probability?: Prisma.FloatWithAggregatesFilter<"MarketSnapshot"> | number;
    volume?: Prisma.FloatNullableWithAggregatesFilter<"MarketSnapshot"> | number | null;
    volume24h?: Prisma.FloatNullableWithAggregatesFilter<"MarketSnapshot"> | number | null;
    liquidity?: Prisma.FloatNullableWithAggregatesFilter<"MarketSnapshot"> | number | null;
    createdAt?: Prisma.DateTimeNullableWithAggregatesFilter<"MarketSnapshot"> | Date | string | null;
    endDate?: Prisma.DateTimeNullableWithAggregatesFilter<"MarketSnapshot"> | Date | string | null;
    trendScore?: Prisma.FloatNullableWithAggregatesFilter<"MarketSnapshot"> | number | null;
    fetchedAt?: Prisma.DateTimeWithAggregatesFilter<"MarketSnapshot"> | Date | string;
};
export type MarketSnapshotCreateInput = {
    id?: string;
    platform: string;
    marketId: string;
    question: string;
    probability: number;
    volume?: number | null;
    volume24h?: number | null;
    liquidity?: number | null;
    createdAt?: Date | string | null;
    endDate?: Date | string | null;
    trendScore?: number | null;
    fetchedAt?: Date | string;
};
export type MarketSnapshotUncheckedCreateInput = {
    id?: string;
    platform: string;
    marketId: string;
    question: string;
    probability: number;
    volume?: number | null;
    volume24h?: number | null;
    liquidity?: number | null;
    createdAt?: Date | string | null;
    endDate?: Date | string | null;
    trendScore?: number | null;
    fetchedAt?: Date | string;
};
export type MarketSnapshotUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    marketId?: Prisma.StringFieldUpdateOperationsInput | string;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    probability?: Prisma.FloatFieldUpdateOperationsInput | number;
    volume?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    volume24h?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    liquidity?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    trendScore?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MarketSnapshotUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    marketId?: Prisma.StringFieldUpdateOperationsInput | string;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    probability?: Prisma.FloatFieldUpdateOperationsInput | number;
    volume?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    volume24h?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    liquidity?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    trendScore?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MarketSnapshotCreateManyInput = {
    id?: string;
    platform: string;
    marketId: string;
    question: string;
    probability: number;
    volume?: number | null;
    volume24h?: number | null;
    liquidity?: number | null;
    createdAt?: Date | string | null;
    endDate?: Date | string | null;
    trendScore?: number | null;
    fetchedAt?: Date | string;
};
export type MarketSnapshotUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    marketId?: Prisma.StringFieldUpdateOperationsInput | string;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    probability?: Prisma.FloatFieldUpdateOperationsInput | number;
    volume?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    volume24h?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    liquidity?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    trendScore?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MarketSnapshotUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    platform?: Prisma.StringFieldUpdateOperationsInput | string;
    marketId?: Prisma.StringFieldUpdateOperationsInput | string;
    question?: Prisma.StringFieldUpdateOperationsInput | string;
    probability?: Prisma.FloatFieldUpdateOperationsInput | number;
    volume?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    volume24h?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    liquidity?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    trendScore?: Prisma.NullableFloatFieldUpdateOperationsInput | number | null;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MarketSnapshotCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    question?: Prisma.SortOrder;
    probability?: Prisma.SortOrder;
    volume?: Prisma.SortOrder;
    volume24h?: Prisma.SortOrder;
    liquidity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    trendScore?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type MarketSnapshotAvgOrderByAggregateInput = {
    probability?: Prisma.SortOrder;
    volume?: Prisma.SortOrder;
    volume24h?: Prisma.SortOrder;
    liquidity?: Prisma.SortOrder;
    trendScore?: Prisma.SortOrder;
};
export type MarketSnapshotMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    question?: Prisma.SortOrder;
    probability?: Prisma.SortOrder;
    volume?: Prisma.SortOrder;
    volume24h?: Prisma.SortOrder;
    liquidity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    trendScore?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type MarketSnapshotMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    platform?: Prisma.SortOrder;
    marketId?: Prisma.SortOrder;
    question?: Prisma.SortOrder;
    probability?: Prisma.SortOrder;
    volume?: Prisma.SortOrder;
    volume24h?: Prisma.SortOrder;
    liquidity?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
    trendScore?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
};
export type MarketSnapshotSumOrderByAggregateInput = {
    probability?: Prisma.SortOrder;
    volume?: Prisma.SortOrder;
    volume24h?: Prisma.SortOrder;
    liquidity?: Prisma.SortOrder;
    trendScore?: Prisma.SortOrder;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type MarketSnapshotSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    platform?: boolean;
    marketId?: boolean;
    question?: boolean;
    probability?: boolean;
    volume?: boolean;
    volume24h?: boolean;
    liquidity?: boolean;
    createdAt?: boolean;
    endDate?: boolean;
    trendScore?: boolean;
    fetchedAt?: boolean;
}, ExtArgs["result"]["marketSnapshot"]>;
export type MarketSnapshotSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    platform?: boolean;
    marketId?: boolean;
    question?: boolean;
    probability?: boolean;
    volume?: boolean;
    volume24h?: boolean;
    liquidity?: boolean;
    createdAt?: boolean;
    endDate?: boolean;
    trendScore?: boolean;
    fetchedAt?: boolean;
}, ExtArgs["result"]["marketSnapshot"]>;
export type MarketSnapshotSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    platform?: boolean;
    marketId?: boolean;
    question?: boolean;
    probability?: boolean;
    volume?: boolean;
    volume24h?: boolean;
    liquidity?: boolean;
    createdAt?: boolean;
    endDate?: boolean;
    trendScore?: boolean;
    fetchedAt?: boolean;
}, ExtArgs["result"]["marketSnapshot"]>;
export type MarketSnapshotSelectScalar = {
    id?: boolean;
    platform?: boolean;
    marketId?: boolean;
    question?: boolean;
    probability?: boolean;
    volume?: boolean;
    volume24h?: boolean;
    liquidity?: boolean;
    createdAt?: boolean;
    endDate?: boolean;
    trendScore?: boolean;
    fetchedAt?: boolean;
};
export type MarketSnapshotOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "platform" | "marketId" | "question" | "probability" | "volume" | "volume24h" | "liquidity" | "createdAt" | "endDate" | "trendScore" | "fetchedAt", ExtArgs["result"]["marketSnapshot"]>;
export type $MarketSnapshotPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MarketSnapshot";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        platform: string;
        marketId: string;
        question: string;
        probability: number;
        volume: number | null;
        volume24h: number | null;
        liquidity: number | null;
        createdAt: Date | null;
        endDate: Date | null;
        trendScore: number | null;
        fetchedAt: Date;
    }, ExtArgs["result"]["marketSnapshot"]>;
    composites: {};
};
export type MarketSnapshotGetPayload<S extends boolean | null | undefined | MarketSnapshotDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MarketSnapshotPayload, S>;
export type MarketSnapshotCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MarketSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MarketSnapshotCountAggregateInputType | true;
};
export interface MarketSnapshotDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MarketSnapshot'];
        meta: {
            name: 'MarketSnapshot';
        };
    };
    findUnique<T extends MarketSnapshotFindUniqueArgs>(args: Prisma.SelectSubset<T, MarketSnapshotFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MarketSnapshotClient<runtime.Types.Result.GetResult<Prisma.$MarketSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MarketSnapshotFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MarketSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MarketSnapshotClient<runtime.Types.Result.GetResult<Prisma.$MarketSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MarketSnapshotFindFirstArgs>(args?: Prisma.SelectSubset<T, MarketSnapshotFindFirstArgs<ExtArgs>>): Prisma.Prisma__MarketSnapshotClient<runtime.Types.Result.GetResult<Prisma.$MarketSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MarketSnapshotFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MarketSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MarketSnapshotClient<runtime.Types.Result.GetResult<Prisma.$MarketSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MarketSnapshotFindManyArgs>(args?: Prisma.SelectSubset<T, MarketSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MarketSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MarketSnapshotCreateArgs>(args: Prisma.SelectSubset<T, MarketSnapshotCreateArgs<ExtArgs>>): Prisma.Prisma__MarketSnapshotClient<runtime.Types.Result.GetResult<Prisma.$MarketSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MarketSnapshotCreateManyArgs>(args?: Prisma.SelectSubset<T, MarketSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MarketSnapshotCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MarketSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MarketSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MarketSnapshotDeleteArgs>(args: Prisma.SelectSubset<T, MarketSnapshotDeleteArgs<ExtArgs>>): Prisma.Prisma__MarketSnapshotClient<runtime.Types.Result.GetResult<Prisma.$MarketSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MarketSnapshotUpdateArgs>(args: Prisma.SelectSubset<T, MarketSnapshotUpdateArgs<ExtArgs>>): Prisma.Prisma__MarketSnapshotClient<runtime.Types.Result.GetResult<Prisma.$MarketSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MarketSnapshotDeleteManyArgs>(args?: Prisma.SelectSubset<T, MarketSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MarketSnapshotUpdateManyArgs>(args: Prisma.SelectSubset<T, MarketSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MarketSnapshotUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MarketSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MarketSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MarketSnapshotUpsertArgs>(args: Prisma.SelectSubset<T, MarketSnapshotUpsertArgs<ExtArgs>>): Prisma.Prisma__MarketSnapshotClient<runtime.Types.Result.GetResult<Prisma.$MarketSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MarketSnapshotCountArgs>(args?: Prisma.Subset<T, MarketSnapshotCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MarketSnapshotCountAggregateOutputType> : number>;
    aggregate<T extends MarketSnapshotAggregateArgs>(args: Prisma.Subset<T, MarketSnapshotAggregateArgs>): Prisma.PrismaPromise<GetMarketSnapshotAggregateType<T>>;
    groupBy<T extends MarketSnapshotGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MarketSnapshotGroupByArgs['orderBy'];
    } : {
        orderBy?: MarketSnapshotGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MarketSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMarketSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MarketSnapshotFieldRefs;
}
export interface Prisma__MarketSnapshotClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MarketSnapshotFieldRefs {
    readonly id: Prisma.FieldRef<"MarketSnapshot", 'String'>;
    readonly platform: Prisma.FieldRef<"MarketSnapshot", 'String'>;
    readonly marketId: Prisma.FieldRef<"MarketSnapshot", 'String'>;
    readonly question: Prisma.FieldRef<"MarketSnapshot", 'String'>;
    readonly probability: Prisma.FieldRef<"MarketSnapshot", 'Float'>;
    readonly volume: Prisma.FieldRef<"MarketSnapshot", 'Float'>;
    readonly volume24h: Prisma.FieldRef<"MarketSnapshot", 'Float'>;
    readonly liquidity: Prisma.FieldRef<"MarketSnapshot", 'Float'>;
    readonly createdAt: Prisma.FieldRef<"MarketSnapshot", 'DateTime'>;
    readonly endDate: Prisma.FieldRef<"MarketSnapshot", 'DateTime'>;
    readonly trendScore: Prisma.FieldRef<"MarketSnapshot", 'Float'>;
    readonly fetchedAt: Prisma.FieldRef<"MarketSnapshot", 'DateTime'>;
}
export type MarketSnapshotFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.MarketSnapshotOmit<ExtArgs> | null;
    where: Prisma.MarketSnapshotWhereUniqueInput;
};
export type MarketSnapshotFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.MarketSnapshotOmit<ExtArgs> | null;
    where: Prisma.MarketSnapshotWhereUniqueInput;
};
export type MarketSnapshotFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.MarketSnapshotOmit<ExtArgs> | null;
    where?: Prisma.MarketSnapshotWhereInput;
    orderBy?: Prisma.MarketSnapshotOrderByWithRelationInput | Prisma.MarketSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.MarketSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MarketSnapshotScalarFieldEnum | Prisma.MarketSnapshotScalarFieldEnum[];
};
export type MarketSnapshotFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.MarketSnapshotOmit<ExtArgs> | null;
    where?: Prisma.MarketSnapshotWhereInput;
    orderBy?: Prisma.MarketSnapshotOrderByWithRelationInput | Prisma.MarketSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.MarketSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MarketSnapshotScalarFieldEnum | Prisma.MarketSnapshotScalarFieldEnum[];
};
export type MarketSnapshotFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.MarketSnapshotOmit<ExtArgs> | null;
    where?: Prisma.MarketSnapshotWhereInput;
    orderBy?: Prisma.MarketSnapshotOrderByWithRelationInput | Prisma.MarketSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.MarketSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MarketSnapshotScalarFieldEnum | Prisma.MarketSnapshotScalarFieldEnum[];
};
export type MarketSnapshotCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.MarketSnapshotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MarketSnapshotCreateInput, Prisma.MarketSnapshotUncheckedCreateInput>;
};
export type MarketSnapshotCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MarketSnapshotCreateManyInput | Prisma.MarketSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MarketSnapshotCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketSnapshotSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MarketSnapshotOmit<ExtArgs> | null;
    data: Prisma.MarketSnapshotCreateManyInput | Prisma.MarketSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MarketSnapshotUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.MarketSnapshotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MarketSnapshotUpdateInput, Prisma.MarketSnapshotUncheckedUpdateInput>;
    where: Prisma.MarketSnapshotWhereUniqueInput;
};
export type MarketSnapshotUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MarketSnapshotUpdateManyMutationInput, Prisma.MarketSnapshotUncheckedUpdateManyInput>;
    where?: Prisma.MarketSnapshotWhereInput;
    limit?: number;
};
export type MarketSnapshotUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketSnapshotSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MarketSnapshotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MarketSnapshotUpdateManyMutationInput, Prisma.MarketSnapshotUncheckedUpdateManyInput>;
    where?: Prisma.MarketSnapshotWhereInput;
    limit?: number;
};
export type MarketSnapshotUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.MarketSnapshotOmit<ExtArgs> | null;
    where: Prisma.MarketSnapshotWhereUniqueInput;
    create: Prisma.XOR<Prisma.MarketSnapshotCreateInput, Prisma.MarketSnapshotUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MarketSnapshotUpdateInput, Prisma.MarketSnapshotUncheckedUpdateInput>;
};
export type MarketSnapshotDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.MarketSnapshotOmit<ExtArgs> | null;
    where: Prisma.MarketSnapshotWhereUniqueInput;
};
export type MarketSnapshotDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MarketSnapshotWhereInput;
    limit?: number;
};
export type MarketSnapshotDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MarketSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.MarketSnapshotOmit<ExtArgs> | null;
};
export {};
