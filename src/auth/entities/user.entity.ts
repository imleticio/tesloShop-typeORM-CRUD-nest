import { IsArray, IsBoolean, IsEmail, IsString, IsUUID, Min } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    @IsUUID()
    id:string;

    @Column('text', {
        unique:true
    })
    email:string;

    @Column('text')
    password:string;

    @Column('text')
    fullName:string;

    @Column('bool',{
        default:true //unique:true ? 
    })
    isActive:boolean;

    @Column('text',{
        array: true,
        default:['user']
    })
    roles:string[];



}
