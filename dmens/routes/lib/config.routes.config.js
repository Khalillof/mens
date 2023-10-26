import { ConfigController } from '../../controllers/index.js';
import { DefaultRoutesConfig } from './default.routes.config.js';
export async function ConfigRoutes() {
    return new DefaultRoutesConfig(new ConfigController(), async function () {
        await this.defaultRoutes();
        await this.buidRoute(this.routeName + '/routes', 'list', 'routes', ['authenticate', 'isAdmin']);
        await this.buidRoute(this.routeName + '/delete/route', 'delete', 'deleteRoute', ['authenticate', 'isAdmin']);
        await this.buidRoute(this.routeName + '/forms', 'get', 'forms', ['authenticate', 'isAdmin']);
    });
}
