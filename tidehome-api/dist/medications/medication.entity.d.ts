export declare enum MedStatus {
    ON_TRACK = "on_track",
    MISSED = "missed",
    REVIEW = "review_needed"
}
export declare class Medication {
    id: string;
    residentId: string;
    residentName: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    instructions: string;
    status: MedStatus;
    lastGiven: Date;
    nextDue: Date;
    givenById: string;
    givenByName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
