import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'
import { QueryBuilder } from 'typeorm/browser';
import { title } from 'process';
@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {

      const product = this.productRepository.create(createProductDto)//crea la instancia del producot
      await this.productRepository.save(product);

      return product

    } catch (error) {
      this.handleDBExceptions(error)
    }

  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto
    return this.productRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(term: string) {
    let product: Product | null = null;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term })
    } else {

        const queryBuilder=this.productRepository.createQueryBuilder();
        product = await queryBuilder
          .where('LOWER(title) =:title or slug=:slug',{
            title: term,
            slug: term
          }).getOne();
    }

    if (!product)
       throw new NotFoundException(`Product with id ${term} not found`)

    return product
  }

 async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      //busca un producto por el id y adicionalemtne carga con todas las propiedades del updateProductoDto
      id: id, 
      ...updateProductDto
    }); // prepara para la actualizacion
    if(!product) throw new NotFoundException(`Product with id: ${id} not found`)
    
    try {
      await this.productRepository.save(product)
      
    } catch (error) {
      this.handleDBExceptions(error)
      
    }
    return product
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    await this.productRepository.remove(product)
  }


  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new BadRequestException('Unexpected error, check server logs')
  }
}
