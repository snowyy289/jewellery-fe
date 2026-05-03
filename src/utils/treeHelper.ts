import { Category } from "@/types/category";

interface TreeItem extends Category {
    level: number;
}

export const createTree = (categories: Category[], parentId: string = "", level: number = 0): TreeItem[] => {
    const tree: TreeItem[] = [];
    
    const favorites = categories.filter(c => (c.parent_id || "") === parentId);
    
    for (const item of favorites) {
        tree.push({ ...item, level });
        const children = createTree(categories, item._id, level + 1);
        tree.push(...children);
    }
    
    return tree;
};
