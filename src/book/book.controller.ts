import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator'; 
import { BookService } from './book.service';
import { Book } from './book.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('books') 
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookController {

  constructor(private readonly BookService: BookService) {}

  @Get()
  @Roles('user','admin')
  findAll(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10, //equivalent to page 
    @Query('sortBy') sortBy = 'id',
    @Query('sortDirection') sortDirection: 'ASC' | 'DESC' = 'ASC', //equivalent to order
  ): Promise<Book[]> {
    return this.BookService.findAll(Number(page), Number(pageSize), sortBy, sortDirection);
  }

  @Get(':id')
  @Roles('user','admin')
  findOne(@Param('id') id: number): Promise<Book> {
    return this.BookService.findOne(id);
  }

  @Post()
  @Roles('admin')
  create(@Body() book: Book): Promise<Book> {
    return this.BookService.create(book);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: number, @Body() book: Book): Promise<void> {
    return this.BookService.update(id, book);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: number): Promise<string> {
    return this.BookService.remove(id);
  }

  @Post('borrow/:id')
  @Roles('user')
  async borrow(@Param('id') id: number, @Body('numberOfDays') numberOfDays: number): Promise<{ requestedId: number}>{
    const requestedId = await this.BookService.borrowBook(id, numberOfDays);
    return { requestedId };
  }
  
  @Post('return/:id')
  @Roles('user')
  async return(@Param('id') id: number) {
    await this.BookService.returnBook(id);
  }

  @Post('approve/:requestId')
  @Roles('admin')
  async approveBorrow(@Param('requestId') requestedId: number): Promise<{ requestedId: number}> {
    await this.BookService.approveBorrowing(requestedId);
    return { requestedId };
  }  

  @Post('reject/:id')
  @Roles('admin')
  async rejectBorrow(@Param('id') id: number): Promise<{ id: number}> {
    await this.BookService.rejectBorrowing(id);
    return { id };
  }
}
