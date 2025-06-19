import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CUSTOM_OPTIONS } from '@libs/common/constants/swagger.constants';

export class ApiServer {
  constructor(private readonly app: INestApplication) {}
  /**
   * 서버 초기화
   */
  init(): void {
    this._initializeApiSwagger();
  }

  /**
   * 서버 실행
   */
  async run(): Promise<void> {
    const port = process.env.SERVER_PORT || 3000;

    Logger.log(`Server is running on port ${port}`);

    await this.app.listen(port, '0.0.0.0');
  }

  /**
   * Swagger 초기화
   */
  private _initializeApiSwagger(): void {
    if (!['prod', 'staging'].includes(process.env.NODE_ENV)) {
      const config = new DocumentBuilder()
        .setTitle('Inventory Management API')
        .setDescription('디노드 과제 재고관리 API 문서')
        .setVersion('1.0')
        .addBearerAuth(
          {
            type: 'http',
            scheme: 'bearer', // authorize prefix 에 bearer 붙힘
            bearerFormat: 'jwt',
            name: 'Authorization',
            in: 'header',
          },
          'access-token', // @ApiBearerAuth('access-token')과 이름 일치 다르면 안됨
        )
        .build();

      const document = SwaggerModule.createDocument(this.app, config);

      SwaggerModule.setup(
        '/api-docs',
        this.app,
        document,
        SWAGGER_CUSTOM_OPTIONS,
      );
    }
  }
}
