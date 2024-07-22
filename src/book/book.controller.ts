import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards, HttpException, HttpStatus, BadRequestException, NotFoundException, UsePipes } from '@nestjs/common';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator'; 
import { BookService } from './book.service';
import { Book } from './book.entity';
import { CreateBookDto } from './dtos/create-book.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BorrowRequestDto } from './dtos/borrow-request.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { ValidationPipe } from '@nestjs/common';


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
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createBookDto: CreateBookDto): Promise<{ id: number, title: string, publishedDate: string }> {
    try {
      const newBook = await this.BookService.create(createBookDto);
      return { id: newBook.id, title: newBook.title, publishedDate: new Date(newBook.publishedDate).toISOString() };
    } catch (error) {
      if(error instanceof BadRequestException)
        throw new HttpException(`Book with Title ${createBookDto.title} Exists!`, HttpStatus.BAD_REQUEST);
      else {
        console.error(`Error processing request for book with Ttile ${createBookDto.title}:`, error);
        throw new HttpException('An unexpected error occurred. Please try again later.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: number, @Body() updateBookDto: UpdateBookDto): Promise<{ id: number, title: string, publishedDate: string }> {
    try {
      const updatedBook = await this.BookService.update(id, updateBookDto);
      return {
        id: updatedBook.id,
        title: updatedBook.title,
        publishedDate: updatedBook.publishedDate.toISOString() };
    } catch (error) {
      
    }
    
  }


  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: number): Promise<{ message: string}> {
    try {
      const isDeleted = await this.BookService.remove(id);
      return { message: `Book with ID ${id} removed Successfuly` };
    } catch (error) {
      throw new HttpException( `Book with ID ${id} not Found`, HttpStatus.NOT_FOUND);
    }
  }


  @Post('borrow/:id')
  @Roles('user')
  async borrow(@Param('id') id: number, @Body() borrowRequestDto: BorrowRequestDto): Promise<{ requestedId: number}>{
    const requestedId = await this.BookService.borrowBook(id, borrowRequestDto.numberOfDays);
    return { requestedId };
  }
  

  @Post('return/:id')
  @Roles('user')
  async return(@Param('id') id: number): Promise<{ message: string}> {
    try {
       const isReturned = await this.BookService.returnBook(id);
       return { message: `Book with ID ${id} removed Successfuly` };
    } catch (error) {
      return {message: `an Error occurred: ${error.message}`};
    }
  }


  @Post('approve/:requestedId')
  @Roles('admin')
  async approveBorrow(@Param('requestedId') requestedId: number): Promise<{ requestedId: number}> {
    try {
    await this.BookService.approveBorrowing(requestedId);
    return { requestedId };
    } catch (error) {
      if(error instanceof BadRequestException)
        throw new HttpException(`Book with ID ${requestedId} is not being Requested for borrowing`, HttpStatus.BAD_REQUEST);
      else if(error instanceof NotFoundException)
        throw new HttpException(`Book with ID ${requestedId} is not Found`, HttpStatus.NOT_FOUND);
    }
  }  


  @Post('reject/:id')
  @Roles('admin')
  async rejectBorrow(@Param('id') id: number): Promise<{ id: number }> {
    try {
      await this.BookService.rejectBorrowing(id);
      return { id };
    } catch (error) {
      if(error instanceof BadRequestException)
        throw new HttpException(`Book with ID ${id} is not being Requested for borrowing`, HttpStatus.BAD_REQUEST);
      else if(error instanceof NotFoundException)
        throw new HttpException(`Book with ID ${id} is not Found`, HttpStatus.NOT_FOUND);
    }
  }
}
