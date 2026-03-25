import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {

      // if(!createProductDto.slug){//si esto no existe
      //   createProductDto.slug=createProductDto.title
      //   .toLocaleLowerCase()
      //   .replaceAll(' ','_')
      //   .replaceAll("'",'')
      // }else{
      //   createProductDto.slug=createProductDto.slug
      //   .toLocaleLowerCase()
      //   .replaceAll(' ','_')
      //   .replaceAll("'",'')
      // }
      const product = this.productRepository.create(createProductDto)//crea la instancia del producot
      await this.productRepository.save(product);

      return product

    } catch (error) {
      this.handleDBExceptions(error)
    }

  }

  findAll(paginationDto:PaginationDto) {
    const {limit=10 , offset=0} = paginationDto
    return this.productRepository.find({
      take:limit,
      skip:offset
    });
  }

  async findOne(id: string) {
    // let product: Product | null = null;

    // if (!product) {
    //   product = await this.productRepository.findOneBy({ id: id.toLocaleLowerCase() })
    // }


    // if (!product) {
    //   product = await this.productRepository.findOneBy({ slug: id.toLocaleLowerCase() })
    // }
    const product = await this.productRepository.findOneBy({ id });
    if(!product) throw new NotFoundException(`Product with id ${id} not found`)
   
    return product
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
