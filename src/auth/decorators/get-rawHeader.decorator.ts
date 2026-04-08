

import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const GetRawHeader= createParamDecorator(
    (data:string , ctx:ExecutionContext) => { 
        const req = ctx.switchToHttp().getRequest();
        const rawHeader =req.rawHeaders
        
        return rawHeader
       
    }
);