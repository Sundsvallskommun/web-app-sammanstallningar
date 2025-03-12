import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import { UserController } from '@controllers/user.controller';
import { HealthController } from '@controllers/health.controller';
import { FlowController } from '@controllers/flow.controller';
import { SessionController } from '@controllers/session.controller';

validateEnv();

const app = new App([IndexController, UserController, HealthController, FlowController, SessionController]);

app.listen();
