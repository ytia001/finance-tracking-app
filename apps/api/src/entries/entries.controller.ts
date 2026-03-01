import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { CreateEntryDto } from './dto/create-entry.dto';

@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  /** POST /entries — Save a new data entry */
  @Post()
  create(@Body() dto: CreateEntryDto) {
    return this.entriesService.create(dto);
  }

  /** GET /entries — Retrieve all entries */
  @Get()
  findAll() {
    return this.entriesService.findAll();
  }

  /** PUT /entries/:id — Update an existing entry */
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateEntryDto>) {
    return this.entriesService.update(id, dto);
  }

  /** DELETE /entries/:id — Remove an entry */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.entriesService.remove(id);
  }
}
