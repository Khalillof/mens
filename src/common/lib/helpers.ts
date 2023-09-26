
import mongoose from "mongoose";
import {MongoServerError} from "mongodb";
import {AssertionError} from '../lib/assertionError.js';
import jwt from 'jsonwebtoken';
import {IController,IDbModel} from '../../interfaces/index.js';
import {DefaultController} from '../../controllers/index.js';
import {DefaultRoutesConfig} from '../../routes/index.js';
import express from 'express';
import pluralize from './pluralize.js';

export const errStore = [mongoose.Error.ValidatorError, mongoose.Error.ValidationError,AssertionError,MongoServerError,jwt.TokenExpiredError];

export const logger = {
    log:console.log,
    err:(err:any)=> console.error(err.stack),
    resErrMsg:(res:express.Response, ErorMsg?:string)=> res.status(400).json({ success: false, error:ErorMsg ||'operation faild!' }),
    resErr:function(res:express.Response,err:any){
        if (err) {
           let errInstance= errStore.filter((errObj:any)=> {
               if(err instanceof errObj){ 
                   return errObj
               }
            })[0];
            //console.log(instance.length)
           let msg = errInstance ? err.message : 'operation faild! server error'
            this.err(err); 
            this.resErrMsg(res,msg)
          }
    }
}
export const responce =(res:express.Response, cb?:Function)=>{
    let successMsg='operation Successful!';
    let  errMsg='error operation faild!';

    let self= { 
      errObjInfo:(error:any, obj:any, info:any)=>{
        if (obj) {
          cb ? self.callback(cb) : self.success();
          return;
        }
        self.fail(error ? error.message : info.message);
        logger.err(error ?? info)
        return;
      },
      success:(msg?:string)=> res.json({success:true,message:msg ?? successMsg}),
      fail:(error?:string)=> res.json({success:false,error:(error ?? errMsg)}),
      errStatus:(status:number,error:string)=> res.status(status).json({success:false,error}),
      badRequest: (msg?: string)=> self.errStatus(400,msg ?? 'bad Request!'),
      unAuthorized: (msg?: string)=> self.errStatus(401,msg ?? 'unAuthorized!'),
      forbidden: (msg?: string)=> self.errStatus(403,msg ?? 'forbidden!'),
      error:(error:any)=> logger.resErr(res, error),
      data:(data:any, message?:string,total?:number)=> res.json({ success: true, message, data,total}),
      errCb:(error:any, cb:Function)=> error ? self.error(error) : self.callback(cb),
      errSuccess:(error:any)=> error ? self.error(error) : self.success(),
      callback:(cb:Function, obj?:any) => cb && typeof cb === 'function' ? cb(obj) : false,
      json:(obj:{}) => res.json(obj)
    }

    return self;
  };

export const sortArray = (itemsArray: any[], propKey:string)=>{
    let sorted = itemsArray.sort((item1, item2) => (item1[propKey] > item2[propKey]) ? 1 : (item1[propKey] < item2[propKey]) ? -1 : 0);
    return sorted;
}
export const Roles =["user", "admin", "application"];
export const isValidRole =(role:string)=> role ?  Roles.indexOf(role) !== -1 : false;
  
export async function printRoutesToString(app:any){
    let result = app._router!.stack
      .filter((r:any) => r.route)
      .map((r:any) => Object.keys(r.route.methods)[0].toUpperCase().padEnd(7) + r.route.path)
      .join("\n");
      
      console.log('================= All Routes avaliable ================ \n'+ result)
  }
export function printRoutesToJson(app:any){
    let result =  app._router.stack
        .filter((r:any) => r.route)
        .map((r:any) => {
        return {
            method: Object.keys(r.route.methods)[0].toUpperCase(),
            path: r.route.path
        };
    });
    console.log('================= All Routes avaliable ================ \n'+ JSON.stringify(result, null, 2))
    //console.log(JSON.stringify(result, null, 2));
  }
  
export function pluralizeRoute(routeName:string){ 
  routeName = routeName.toLowerCase();
  if (routeName.indexOf('/') == -1){
     return ('/'+ pluralize(routeName));
  }else{
      return routeName;
  } 
}


// types
export type Dic<Type>  = { [key: string] : Type };

// db object
export const dbStore : Dic<IDbModel>={};

export function  getDb(url:string):IDbModel{
  for(let d in dbStore){
   if(url !== '/' && url.match(d.toLowerCase())){
   return dbStore[d];
 }
}
throw new Error('service not found for arg :'+ url);;
//throw 
}

// routesStore
export const routeStore : Dic<DefaultRoutesConfig> = {};

export function  getCont(url:string):IController | any{
    for(let d in routeStore){     
      if(d !== '/' && url.match(d) || d === '/' && url === d){
     // console.log('from getcon : '+url +' - '+d)
      return routeStore[d].controller;
    }
  } 
  return null; 
  //throw new Error('controller not found for the url :'+ url);
}

export function extendedInstance<A extends DefaultController>(arg:any[], c: new(...args: any[])=> A): A {   
  return new c(...arg);
}

export function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
    return obj[key];
}

export async function createInstance<T>(constructor: new(...args: any[])=> T, ...args: any[]):Promise<T>  {
    return Promise.resolve(new constructor(...args));
  }

export async function activator(type: any, ...arg:any[]){
  // if(arg)
   return await Promise.resolve(new type(...arg));
   // usage:
  // const classcc = activator(ClassA);
  //const classee = activator(ClassA, ['']);
}

