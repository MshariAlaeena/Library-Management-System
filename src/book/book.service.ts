import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dtos/create-book.dto';
import { BorrowRequestDto } from './dtos/borrow-request.dto';
import { UpdateBookDto } from './dtos/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  findAll(
    page: number,
    limit: number,
    sortBy: string,
    order: 'ASC' | 'DESC',
  ): Promise<Book[]> {
    return this.booksRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      order: {
        [sortBy]: order,
      },
    });
  }

  findOne(id: number): Promise<Book> {
    return this.booksRepository.findOneBy({ id });
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const existingBook = await this.booksRepository.findOne({
      where: { title: createBookDto.title },
    });

    if (existingBook)
      throw new BadRequestException(
        `Book with Title ${createBookDto.title} Exists!`,
      );

    const newBook = this.booksRepository.create({
      ...createBookDto,
      publishedDate: new Date(createBookDto.publishedDate),
    });
    return await this.booksRepository.save(newBook);
  }

  async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
    const existingBook = await this.booksRepository.findOne({
      where: { id: updateBookDto.id },
    });

    if (!existingBook)
      throw new NotFoundException(`Book with ID ${updateBookDto.id} not found`);

    Object.assign(existingBook, updateBookDto);

    return this.booksRepository.save(existingBook);
  }

  async remove(id: number): Promise<boolean> {
    const book = await this.booksRepository.findOne({ where: { id } });

    if (!book) throw new NotFoundException(`Book with ID ${id} not found`);

    await this.booksRepository.delete(id);
    return true;
  }

  async borrowBook(
    id: number,
    borrowRequestDto: BorrowRequestDto,
  ): Promise<number> {
    const book = await this.booksRepository.findOne({ where: { id } });

    if (!book) throw new Error('Book not found');

    if (book.borrowingStatus !== 'available') {
      throw new BadRequestException(
        `Book with ID ${id} is unavailable for borrowing`,
      );
    }

    const currentDate = new Date();
    const returnDate = new Date(
      currentDate.getTime() +
        borrowRequestDto.numberOfDays * 24 * 60 * 60 * 1000,
    );

    book.borrowedUntil = returnDate;
    book.borrowingStatus = 'pending';

    await this.booksRepository.save(book);
    return book.id;
  }

  async returnBook(id: number): Promise<void> {
    const book = await this.booksRepository.findOne({ where: { id } });
    if (!book) throw new Error('Book not found');

    book.borrowingStatus = 'available';
    book.borrowedUntil = null;
    await this.booksRepository.save(book);
  }

  async approveBorrowing(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException();
    }
    if (book.borrowingStatus !== 'pending') {
      throw new BadRequestException(
        `Book with ID ${id} is not being Requested for borrowing`,
      );
    }

    book.borrowingStatus = 'borrowed';
    await this.booksRepository.save(book);
    return book;
  }

  async rejectBorrowing(id: number): Promise<Book> {
    const book = await this.booksRepository.findOne({ where: { id } });

    if (!book) {
      throw new NotFoundException();
    }

    if (book.borrowingStatus == 'pending') {
      throw new BadRequestException(
        `Book with ID ${id} is not being Requested for borrowing`,
      );
    }
    book.borrowingStatus = 'available';
    await this.booksRepository.save(book);
    return book;
  }
}
