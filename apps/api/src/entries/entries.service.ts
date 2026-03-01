import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE, DrizzleDB } from '../db/db.module';
import { dataEntries, DataEntryRow } from '../db/schema';
import { CreateEntryDto } from './dto/create-entry.dto';

@Injectable()
export class EntriesService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async create(dto: CreateEntryDto) {
    const [entry] = await this.db
      .insert(dataEntries)
      .values({
        amount: dto.amount.toString(),
        date: new Date(dto.date),
        category: dto.category
      })
      .returning();

    return this.toResponse(entry);
  }

  async findAll() {
    const entries = await this.db.select().from(dataEntries).orderBy(dataEntries.date);

    return entries.map((e) => this.toResponse(e));
  }

  async update(id: number, dto: Partial<CreateEntryDto>) {
    const values: Partial<typeof dataEntries.$inferInsert> = {};
    if (dto.amount !== undefined) values.amount = dto.amount.toString();
    if (dto.date !== undefined) values.date = new Date(dto.date);
    if (dto.category !== undefined) values.category = dto.category;

    const [entry] = await this.db.update(dataEntries).set(values).where(eq(dataEntries.id, id)).returning();

    if (!entry) throw new NotFoundException(`Entry ${id} not found`);
    return this.toResponse(entry);
  }

  async remove(id: number): Promise<{ success: boolean }> {
    const [deleted] = await this.db.delete(dataEntries).where(eq(dataEntries.id, id)).returning();

    if (!deleted) throw new NotFoundException(`Entry ${id} not found`);
    return { success: true };
  }

  /**
   * Converts a DB row to the shape the Angular frontend expects:
   *  { id: number, amount: string, date: number (Unix ms), category: string }
   */
  private toResponse(entry: DataEntryRow) {
    return {
      id: entry.id,
      amount: entry.amount, // Drizzle returns numeric as string — matches DataEntry.amount
      date: entry.date.getTime(), // Unix ms timestamp — matches DataEntry.date
      category: entry.category
    };
  }
}
