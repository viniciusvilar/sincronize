import { Provider } from '@nestjs/common';
import * as Firebird from 'node-firebird';

const options: Firebird.Options = {
  host: 'localhost',
  port: 3050,
  database: 'C:/gensis/market.gdb',
  user: 'SYSDBA',
  password: '1234',
  lowercase_keys: true,
  //role: null,
  pageSize: 4096,
};

export const FirebirdProvider: Provider = {
  provide: 'FIREBIRD_CONNECTION',
  useFactory: (): Promise<Firebird.Database> => {
    return new Promise((resolve, reject) => {
      Firebird.attach(options, (err, db) => {
        if (err) {
          reject(err);
        } else {
          resolve(db);
        }
      });
    });
  },
};
