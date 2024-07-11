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
    
      async remove(id: number): Promise<void> {
        await this.booksRepository.delete(id);
      }
}
