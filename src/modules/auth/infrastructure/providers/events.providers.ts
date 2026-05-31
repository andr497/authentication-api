import { Provider } from '@nestjs/common';

import { UserRegisteredHandler } from '../events/handlers/user-registered.handler';

export const eventsProviders: Provider[] = [UserRegisteredHandler];
