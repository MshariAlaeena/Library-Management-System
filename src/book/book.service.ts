import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dtos/create-book.dto';
import { BorrowRequestDto } from './dtos/borrow-request.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Borrow } from './borrow.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    @InjectRepository(Borrow)
    private borrowRepository: Repository<Borrow>,
    private notificationService: NotificationsService,
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
      throw new ConflictException(
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

    if (!book) throw new NotFoundException('Book not found');

    const borrowReq = await this.borrowRepository.find({ where: { book: { id }, status: 'approved' }});

    if (borrowReq.length > 0)
      throw new ConflictException(`Book with ID ${id} is currently borrowed and unavailable`);

    const currentDate = new Date();
    const returnDate = new Date(
      currentDate.getTime() +
        borrowRequestDto.numberOfDays * 24 * 60 * 60 * 1000,
    );

    const borrow = this.borrowRepository.create({
      user: { id: borrowRequestDto.userId },
      book: { id: borrowRequestDto.bookId },
      borrowDate: currentDate,
      dueDate: returnDate,
      status: 'pending',
    });
    await this.borrowRepository.save(borrow);
    return book.id;
  }

  async returnBook(id: number): Promise<void> {
    const borrowReq = await this.borrowRepository.findOne({ where: { id }, relations: ['book'] });    
    if (!borrowReq) throw new NotFoundException('borrow not found');

    borrowReq.status = 'returned';
    await this.borrowRepository.save(borrowReq);

    // to check if there are any other active borrow requests for the same book
    const book = borrowReq.book;
    const activeBorrows = await this.borrowRepository.find({
      where: { book: { id: book.id }, status: 'approved' },
    });    
    
    // If there are no other active borrow requests, update the book's status to available
    if (activeBorrows.length === 0) {
      book.availableCopies += 1; 
      await this.booksRepository.save(book);  //TODO increment
    }
  }
  

  async approveBorrowing(id: number): Promise<Book> {
    const borrowReq = await this.borrowRepository.findOne({ where: { id }, relations: ['book'] });

    if (!borrowReq) {
      throw new NotFoundException(`No pending borrow request found for book with ID ${id}`);
    }
    if (borrowReq.status !== 'pending') {
      throw new ConflictException(
        `Book with ID ${borrowReq.book.id} is not being Requested for borrowing`,
      );
    }

    borrowReq.status = 'approved';
    await this.borrowRepository.save(borrowReq);

    this.scheduleReminder(borrowReq.user.id, borrowReq.book.id, borrowReq.dueDate);

    return borrowReq.book;
  }


  scheduleReminder(userId: string, bookId: number, dueDate: Date) {
    const twoDaysBefore = new Date(dueDate.getTime() - 2 * 24 * 60 * 60 * 1000);
    const now = new Date();
    
    if (twoDaysBefore > now) {
      const delay = twoDaysBefore.getTime() - now.getTime();
      setTimeout(async () => {
        await this.notificationService.createNotification({
          userId,
          category: 'reminder',
          content: `Reminder: Your borrowed book with ID ${bookId} is due in 2 days.`,
        });
      }, delay);
    } else {
      throw new BadRequestException('Reminder date has already passed');
    }
  }


  async rejectBorrowing(id: number): Promise<Book> {
    const borrowReq = await this.borrowRepository.findOne({ where: { id }, relations: ['book'] });

    if (!borrowReq) {
      throw new NotFoundException(`No pending borrow request found for book with ID ${id}`);
    }
    if (borrowReq.status !== 'pending') {
      throw new ConflictException(
        `Book with ID ${borrowReq.book.id} is not being Requested for borrowing`,
      );
    }
    borrowReq.status = 'available';
    await this.borrowRepository.save(borrowReq);
    return borrowReq.book;
  }
}
