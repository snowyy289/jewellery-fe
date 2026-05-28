export interface Collection {
    _id: string;
    title: string;
    slug: string;
    description?: string;
    thumbnail?: string;
    cover_image?: string;
    products?: string[] | any[];
    status: 'active' | 'inactive';
    position?: number;
    featured?: boolean;
    createdAt: string;
    updatedAt: string;
    createBy?: {
        _id: string;
        fullName: string;
    };
    updateBy?: {
        _id: string;
        fullName: string;
    };
}
