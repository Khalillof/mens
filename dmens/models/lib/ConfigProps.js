"use strict";
import { dbStore } from '../../common/index.js';
export class ConfigProps {
    constructor(_config) {
        // basic validation
        if (!_config || !_config.name || !_config.schemaObj) {
            throw new Error(`ConfigProps class constructor is missing requird properties => ${_config}`);
        }
        if (dbStore[_config.name.toLowerCase()]) {
            throw new Error(`ConfigProps basic schema validation faild ! name property : ${_config.name} already on db.`);
        }
        this.name = _config.name.toLowerCase();
        this.active = _config.active || false;
        this.useAuth = _config.useAuth || [];
        this.useAdmin = _config.useAdmin || [];
        this.schemaObj = _config.schemaObj || {};
        this.schemaOptions = { timestamps: true, strict: true, ..._config.schemaOptions };
        // validate schema
        // this.validateSchema()
    }
    name;
    active;
    useAuth;
    useAdmin;
    schemaObj;
    schemaOptions;
}
