export const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const;

export type SheetSide = (typeof SHEET_SIDES)[number];

export type ISheetEditClient = {
  side: SheetSide;
  isOpen: boolean;
  setIsOpen: (_isOpen: boolean) => void;
  refetch?: () => void;
  clientId?: string;
};
