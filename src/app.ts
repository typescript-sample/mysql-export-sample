import { createWriteStream, DelimiterFormatter, FileWriter } from 'io-one';
import { Exporter, ExportService, Statement } from 'mysql-export';
import mysql from 'mysql2';
import { User, userModel } from './user';

const DB_HOST = 'sql6.freesqldatabase.com';
const DB_USER = 'sql6525477';
const DB_NAME = 'sql6525477';
const DB_PWD = 'dqPFB293Gq';
const USE_SERVICE = false;

export class QueryBuilder {
  build = (ctx?: any): Promise<Statement> => Promise.resolve({
    query: 'SELECT * FROM users'
  })
}

async function main() {
  const dir = './dest_dir/';
  const writer = createWriteStream(dir, 'export.csv');
  const w2 = new FileWriter(writer);
  const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    database: DB_NAME,
    password: DB_PWD
  });

  // (D) EXPORT TO CSV
  const formatter = new DelimiterFormatter<User>(',', userModel);
  const queryBuilder = new QueryBuilder();

  // (D1) ON ERROR
  // const exporter = new ExportService<User>(pool, queryBuilder, transform, writer);
  const exporter = USE_SERVICE
    ? new ExportService(connection, queryBuilder, formatter, w2, userModel)
    : new Exporter<User>(connection, queryBuilder.build, formatter.format, w2.write, w2.end, userModel);
  const total = await exporter.export();

  console.log('total ' + total);
}

main();
