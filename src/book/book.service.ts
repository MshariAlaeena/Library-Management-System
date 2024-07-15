import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private booksRepository: Repository<Book>,
      ) {}

      findAll(page: number, limit: number, sortBy: string, order: 'ASC' | 'DESC'): Promise<Book[]> {
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
    
      create(book: Book): Promise<Book> {
        return this.booksRepository.save(book);
      }
    
      async update(id: number, book: Book): Promise<void> {
        await this.booksRepository.update(id, book);
      }
    
      async remove(id: number): Promise<string> {
       const deletion = await this.booksRepository.delete(id);
       const isDeleted = deletion.affected > 0;

       if(isDeleted)
        return "Deleted Successfully";
      
      return "an Error occurred";
      }

      async borrowBook(id: number, numberOfDays: number): Promise<number> {
        const book = await this.booksRepository.findOne({ where: { id }});

        if(!book)
          throw new Error('Book not found');

        if(book.borrowingStatus == 'available') {
          book.borrowedUntil = new Date(new Date().getTime() + (numberOfDays * 24 * 60 * 60 * 1000));
          book.borrowingStatus = 'pending';
          await this.booksRepository.save(book);
          return book.id;
        }
          return book.id;
      }

      async returnBook(id: number) {
        const book = await this.booksRepository.findOne({ where: { id }});
        if(!book)
          throw new Error('Book not found');

        book.borrowingStatus = 'available';
        book.borrowedUntil = null;
        await this.booksRepository.save(book);
      }

      async approveBorrowing(id: number): Promise<Book> {
        const book = await this.booksRepository.findOne({ where: { id }});
        if(book.borrowingStatus == 'pending') {
          book.borrowingStatus = 'borrowed';
          await this.booksRepository.save(book);
          return book;
        }
        return book;
      }

      async rejectBorrowing(id: number): Promise<Book> {
        const book = await this.booksRepository.findOne({ where: { id }});
        if(book.borrowingStatus == 'pending') {
          book.borrowingStatus = 'available';
          await this.booksRepository.save(book);
          return book;
        }
        return book;
      }

}
