export declare class CreateDeliveryDto {
    tenantId: string;
    reference: string;
    pickupAddress: string;
    dropoffAddress: string;
    distanceKm?: number;
    pickupGeo?: {
        lat: number;
        lng: number;
        region?: string;
    };
    dropoffGeo?: {
        lat: number;
        lng: number;
        region?: string;
    };
}
//# sourceMappingURL=create-delivery.dto.d.ts.map