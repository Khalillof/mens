import { cors,corsWithOptions} from './lib/cors.config';
import {AuthRoutes} from './lib/auth.routes.config';
import {DefaultRoutesConfig} from './lib/default.routes.config';
import {IndexRoutes} from './lib/init.routes.config';
import {AccountsRoutes} from './lib/accounts.routes.config';
import {EditorRoutes} from './lib/editor.routes.config';
import {uploadImages, uploadSchema} from './lib/uploads';
const initRouteStore = [AccountsRoutes,AuthRoutes, EditorRoutes,IndexRoutes, DefaultRoutesConfig.createInstancesWithDefault ]
export { corsWithOptions,cors,DefaultRoutesConfig,initRouteStore, uploadImages, uploadSchema}