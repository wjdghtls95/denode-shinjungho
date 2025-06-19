export const INVENTORY_TYPE = {
  IN: 'in',
  OUT: 'out',
} as const;

export type InventoryType =
  (typeof INVENTORY_TYPE)[keyof typeof INVENTORY_TYPE];
