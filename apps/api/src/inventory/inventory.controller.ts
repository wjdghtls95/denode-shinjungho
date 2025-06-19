import { Auth } from '@libs/common/decorator/auth.decorator';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { ApiResponseEntity } from '@libs/common/decorator/api-response-entity.decorator';
import { ResponseEntity } from '@libs/common/network/response.entity';
import { InventoryStockInDto } from '@libs/dao/inventory/dto/inventory-stock-in.dto';
import { InventoryStockOutDto } from '@libs/dao/inventory/dto/inventory-stock-out.dto';
import { InventoryResponseOutDto } from '@libs/dao/inventory/dto/inventory-response-out.dto';
import { InventoryHistoryInDto } from '@libs/dao/inventory/dto/inventory-history-in.dto';
import { InventoryHistoryOutDto } from '@libs/dao/inventory/dto/inventory-history-out.dto';
import { PaginatedResultDto } from '@libs/common/pagination/dto/pagination-result-dto';

@Auth()
@ApiTags('Inventories')
@Controller('inventories')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('in')
  @ApiResponseEntity({ summary: '재고 입고' })
  async inventoryStockIn(
    @Body() inventoryStockInDto: InventoryStockInDto,
  ): Promise<ResponseEntity<InventoryResponseOutDto>> {
    const InventoryResponseOutDto =
      await this.inventoryService.inventoryStockIn(inventoryStockInDto);

    return ResponseEntity.ok().body(InventoryResponseOutDto);
  }

  @Post('out')
  @ApiResponseEntity({ summary: '재고 출고' })
  async inventoryStockOut(
    @Body() inventoryStockOutDto: InventoryStockOutDto,
  ): Promise<ResponseEntity<InventoryResponseOutDto>> {
    const InventoryResponseOutDto =
      await this.inventoryService.inventoryStockOut(inventoryStockOutDto);

    return ResponseEntity.ok().body(InventoryResponseOutDto);
  }

  @Get('history')
  @ApiResponseEntity({ summary: '입고 | 출고 히스토리 조회' })
  async getInventoryHistory(
    @Query() inventoryHistInDto: InventoryHistoryInDto,
  ): Promise<ResponseEntity<PaginatedResultDto<InventoryHistoryOutDto>>> {
    const inventoryHistoryOutDto =
      await this.inventoryService.getInventoryHistories(inventoryHistInDto);

    return ResponseEntity.ok().body(inventoryHistoryOutDto);
  }

  @Post('in/error-test')
  @ApiResponseEntity({ summary: '트랜잭션 테스트 - 강제 에러 발생' })
  async stockInWithError(
    @Body() dto: InventoryStockInDto,
  ): Promise<ResponseEntity<unknown>> {
    await this.inventoryService.inventoryStockIn(dto);

    // 트랜잭션 내에서 강제 예외 발생
    throw new Error('강제 에러로 트랜잭션 롤백 확인');
  }
}
