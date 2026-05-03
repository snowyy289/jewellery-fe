export interface Permission {
    _id: string;
    title: string;
    value: string;
    group?: string;
    description?: string;
    createBy?: string;
    updateBy?: string;
    createdAt?: string;
    updatedAt?: string;
}
