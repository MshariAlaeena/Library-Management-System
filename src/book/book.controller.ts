import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.entity';


@Controller('books')
export class BookController {

  constructor(private readonly BookService: BookService) {}

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'id',
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ): Promise<Book[]> {
    return this.BookService.findAll(Number(page), Number(limit), sortBy, order);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Book> {
    return this.BookService.findOne(id);
  }

  @Post()
  create(@Body() book: Book): Promise<Book> {
    return this.BookService.create(book);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() book: Book): Promise<void> {
    return this.BookService.update(id, book);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.BookService.remove(id);
  }

}
