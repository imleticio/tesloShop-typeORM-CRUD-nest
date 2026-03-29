import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductImage{

    @PrimaryGeneratedColumn()//numero que incremata solo
    id:number;

    @Column('text')
    url:string;

    @ManyToOne(
        ()=>Product,
        (product)=>product.images  //es el atributo con el que se relaciona
    )
    product:Product

}