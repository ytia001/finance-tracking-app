import { IsEnum, IsISO8601, IsNumber, IsPositive } from 'class-validator';

// Must match Category enum values in the Angular frontend
export enum Category {
  FOOD_AND_BEVERAGE = 'food_and_beverage',
  GROCERIES = 'groceries',
  INCOME = 'income',
  TRANSPORT = 'transport',
  GIFTS = 'gifts',
  ELECTRICAL_APPLIANCES = 'electrical_appliances',
  OTHERS = 'others'
}

export class CreateEntryDto {
  @IsEnum(Category)
  category: Category;

  @IsNumber()
  @IsPositive()
  amount: number;

  /** Angular sends Date as ISO 8601 string over JSON e.g. "2026-02-28T00:00:00.000Z" */
  @IsISO8601()
  date: string;
}
