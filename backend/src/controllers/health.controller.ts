import ApiService from '@/services/api.service';
import { logger } from '@/utils/logger';
import { Controller, Get } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { APIS } from '@config';
import { User } from '@interfaces/users.interface';

@Controller()
export class HealthController {
  private apiService = new ApiService();
  public api = APIS.find(x => x.name === 'simulatorserver');

  @Get('/health/up')
  @OpenAPI({ summary: 'Return health check' })
  async up() {
    const url = `${this.api.name}/${this.api.version}/simulations/response?status=200%20OK`;
    const data = {
      status: 'OK',
    };
    const user: User = {
      name: '',
      username: '',
      givenName: '',
      surname: '',
    };
    const res = await this.apiService.post<{ status: string }, { status: string }>({ url, data }, user).catch(e => {
      logger.error('Error when doing health check:', e);
      return e;
    });

    return res.data;
  }
}
