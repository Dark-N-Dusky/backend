/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { AdminService } from '../admin.service';
import { CreateProductDto, EditProductDto } from 'src/common/dto/product.dto';

@Controller('admin/products')
export class ProductsController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  createProduct(@Body() body: CreateProductDto) {
    return this.adminService.createProduct(body);
  }

  @Put(':id')
  updateProduct(@Param('id') id: string, @Body() body: EditProductDto) {
    return this.adminService.updateProductById(id, body);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProductById(id);
  }
}
