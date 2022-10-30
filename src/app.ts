import { createWriteStream, DelimiterFormatter, FileWriter } from 'io-one';
import mysql from 'mysql2';
import { Exporter, ExportService, Statement } from 'mysql2-core';
import { User, userModel } from './user';

const DB_HOST = 'sql6.freesqldatabase.com';
const DB_USER = 'sql6525477';
const DB_NAME = 'sql6525477';
const DB_PWD = 'dqPFB293Gq';
const USE_SERVICE = false;

export class QueryBuilder {
  build = (): Promise<Statement> => Promise.resolve({
    query: 'SELECT * FROM users'
  })
}

async function main() {
  const dir = './dest_dir/';
  const streamWrite = createWriteStream(dir, 'export.csv');
  const writer = new FileWriter(streamWrite);
  const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    database: DB_NAME,
    password: DB_PWD
  });

  const formatter = new DelimiterFormatter<User>(',', userModel);
  const queryBuilder = new QueryBuilder();

  const exporter = USE_SERVICE
    ? new ExportService(connection, queryBuilder, formatter, writer, userModel)
    : new Exporter<User>(connection, queryBuilder.build, formatter.format, writer.write, writer.end, userModel);
  const total = await exporter.export();

  console.log('total ' + total);
}

main();
