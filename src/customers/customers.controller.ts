import { Body, Controller, NotFoundException, Param, Patch } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Patch(':id/profile')
  @ApiOperation({ summary: 'Update customer profile details' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    schema: {
      example: {
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: '3f8e8a70-1a50-4a3a-b0f8-123456789abc',
          email: 'jane.doe@example.com',
          firstName: 'Jane',
          lastName: 'Doe',
          address: '123 Main St',
          profilePictureUrl: 'https://your-supabase-url.supabase.co/storage/v1/object/public/profiles/abc123.png',
          role: 'USER',
          createdAt: '2026-05-22T12:00:00.000Z',
          updatedAt: '2026-05-22T12:00:00.000Z',
        },
      },
    },
  })
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
