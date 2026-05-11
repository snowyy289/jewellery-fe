/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category } from "@/types/category";

interface TreeItem extends Category {
    level: number;
}

export const createTree = (categories: Category[], parentId: string = "", level: number = 0): TreeItem[] => {
    const tree: TreeItem[] = [];
    
    // Filter categories by parent_id, xử lý cả trường hợp parent_id là object hoặc string
    const favorites = categories.filter(c => {
        const pid = typeof c.parent_id === 'object' && c.parent_id ? (c.parent_id as any)._id : (c.parent_id || "");
        return pid === parentId;
    });
    
    for (const item of favorites) {
        tree.push({ ...item, level });
        const children = createTree(categories, item._id, level + 1);
        tree.push(...children);
    }
    
    return tree;
};
