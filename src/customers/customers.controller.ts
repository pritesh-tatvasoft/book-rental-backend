import { Body, Controller, NotFoundException, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Patch(':id/profile')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updated = await this.customersService.update(id, updateProfileDto);

    if (!updated) {
      throw new NotFoundException('Customer not found');
    }

    return {
      message: 'Profile updated successfully',
      data: updated,
    };
  }
}
