import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity.decorator';

@ApiTags('Default')
@Controller()
export class DefaultController {
  @Get('/health')
  @ApiResponseEntity({ summary: '헬스 체크' })
  healthCheck(): Record<string, string> {
    return { env: process.env.NODE_ENV };
  }
}
