import App from '@/app';
import { FlowController } from '@controllers/flow.controller';
import { HealthController } from '@controllers/health.controller';
import { IndexController } from '@controllers/index.controller';
import { SessionController } from '@controllers/session.controller';
import { UserController } from '@controllers/user.controller';
import { initRedis } from '@utils/initRedis';
import validateEnv from '@utils/validateEnv';

validateEnv();

async function bootstrap() {
  // Connects Redis only when SESSION_STORE=redis; App then builds the session store from it.
  await initRedis();

  const app = new App([IndexController, UserController, HealthController, FlowController, SessionController]);

  app.listen();
}

bootstrap().catch(err => {
  console.error('Failed to start app:', err);
  process.exit(1);
});
