export enum Category {
  FOOD_AND_BEVERAGE = 'food_and_beverage',
  GROCERIES = 'groceries',
  INCOME = 'income',
  TRANSPORT = 'transport',
  GIFTS = 'gifts',
  ELECTRICAL_APPLIANCES = 'electrical_appliances',
  OTHERS = 'others',
}

export interface CategoryConfig {
  label: string;
  icon: string;
}

export const CategoryConfigurations: Record<Category, CategoryConfig> = {
  [Category.FOOD_AND_BEVERAGE]: { label: 'Food and Beverage', icon: 'restaurant' },
  [Category.GROCERIES]: { label: 'Groceries', icon: 'shopping_cart' },
  [Category.INCOME]: { label: 'Income', icon: 'payments' },
  [Category.TRANSPORT]: { label: 'Transport', icon: 'commute' },
  [Category.GIFTS]: { label: 'Gifts', icon: 'card_giftcard' },
  [Category.ELECTRICAL_APPLIANCES]: { label: 'Electrical Appliances', icon: 'electrical_services' },
  [Category.OTHERS]: { label: 'Others', icon: 'category' },
};

export enum financialFlow {
  INFLOW = 'inflow',
  OUTFLOW = 'outflow',
}
