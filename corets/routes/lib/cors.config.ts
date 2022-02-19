import  Cors  from 'cors';


const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:4200', 
'http://tuban.me', 'http://static.tuban.me', 'http://test.tuban.me', 'http://mobile.tuban.me',
'https://tuban.me', 'https://static.tuban.me', 'https://test.tuban.me', 'https://mobile.tuban.me'];


if (process.env.NODE_ENV === 'development'){
    ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:4200'].forEach(i=> whitelist.push(i))
  }

var corsOptionsDelegate = (req:any, callback:any):any => {
    var corsOptions;
   // console.log(req.header('Origin'));
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false};
    }
    callback(null, corsOptions);
};

export var cors = Cors();
export var corsWithOptions = Cors(corsOptionsDelegate);