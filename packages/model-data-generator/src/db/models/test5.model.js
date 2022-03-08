const { DataTypes, Model, Sequelize } = require('sequelize');

const timestampConfig = {
  fields: {
    updatedAt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.fn('NOW'),
    },
    createdAt: {
      type: 'TIMESTAMP',
      defaultValue: Sequelize.fn('NOW'),
    },
  },
  tableOptions: {
    timestamps: false,
  },
};

const sequelize = new Sequelize(process.env.SQL_DATABASE, null, null, {
  query: { raw: true },
  dialect: 'mysql',
  replication: {
    read: [
      {
        host:
          process.env.READER_SQL_HOST !== undefined
            ? process.env.READER_SQL_HOST
            : process.env.SQL_HOST,
        username: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
      },
    ],
    write: {
      host:
        process.env.WRITER_SQL_HOST !== undefined
          ? process.env.WRITER_SQL_HOST
          : process.env.SQL_HOST,
      username: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
    },
  },
});

const {
  UUID,
  INTEGER,
  BIGINT,
  MEDIUMINT,
  SMALLINT,
  TINYINT,
  FLOAT,
  DOUBLE,
  DECIMAL,
  REAL,
  STRING,
  CHAR,
  TEXT,
  BOOLEAN,
  NOW,
} = DataTypes;

class Test extends Model {}

const testDTO = {
  id: {
    type: UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  firstName: {
    type: STRING,
  },
  lastName: {
    type: STRING,
  },
  name: {
    type: STRING,
  },
  fullName: {
    type: STRING,
  },
  email: {
    type: STRING,
  },
  password: {
    type: STRING,
  },
  message: {
    type: STRING,
  },
  description: {
    type: STRING,
  },
  timezone: {
    type: STRING,
  },
  addressOne: {
    type: STRING,
  },
  city: {
    type: STRING,
  },
  state: {
    type: STRING,
  },
  country: {
    type: STRING,
  },
  zip: {
    type: INTEGER,
    length: 5,
  },
  phone: {
    type: INTEGER,
    length: 10,
  },
  noNameSupport: {
    type: STRING,
  },
  randomString: {
    type: STRING,
  },
  randomStringLength: {
    type: STRING,
    length: 12,
  },
  randomChar: {
    type: CHAR,
  },
  randomCharLength: {
    type: CHAR,
    length: 12,
  },
  randomText: {
    type: TEXT,
  },
  randomTextTiny: {
    type: TEXT,
    length: 'tiny',
  },
  randomTextMedium: {
    type: TEXT,
    length: 'medium',
  },
  randomTextLong: {
    type: TEXT,
    length: 'long',
  },
  randomBoolean: {
    type: BOOLEAN,
  },
  randomInteger: {
    type: INTEGER,
  },
  randomBigInt: {
    type: BIGINT,
  },
  randomMediumInt: {
    type: MEDIUMINT,
  },
  randomSmallInt: {
    type: SMALLINT,
  },
  randomTinyInt: {
    type: TINYINT,
  },
  randomFloat: {
    type: FLOAT,
  },
  randomDouble: {
    type: DOUBLE,
  },
  randomDecimal: {
    type: DECIMAL,
  },
  randomReal: {
    type: REAL,
  },
  randomNow: {
    type: NOW,
  },
  randomNoMatch: {
    type: UUID,
  },
  uniqueRandomString: {
    type: STRING,
    unique: true,
  },
  uniqueRandomStringLength: {
    type: STRING,
    length: 12,
    unique: true,
  },
  uniqueRandomChar: {
    type: CHAR,
    unique: true,
  },
  uniqueRandomCharLength: {
    type: CHAR,
    length: 12,
    unique: true,
  },
  uniqueRandomText: {
    type: TEXT,
    unique: true,
  },
  uniqueRandomTextTiny: {
    type: TEXT,
    length: 'tiny',
    unique: true,
  },
  uniqueRandomTextMedium: {
    type: TEXT,
    length: 'medium',
    unique: true,
  },
  uniqueRandomTextLong: {
    type: TEXT,
    length: 'long',
    unique: true,
  },
  uniqueRandomInteger: {
    type: INTEGER,
    unique: true,
  },
  uniqueRandomBigInt: {
    type: BIGINT,
    unique: true,
  },
  uniqueRandomMediumInt: {
    type: MEDIUMINT,
    unique: true,
  },
  uniqueRandomSmallInt: {
    type: SMALLINT,
    unique: true,
  },
  uniqueRandomTinyInt: {
    type: TINYINT,
    unique: true,
  },
  uniqueRandomFloat: {
    type: FLOAT,
    unique: true,
  },
  uniqueRandomDouble: {
    type: DOUBLE,
    unique: true,
  },
  uniqueRandomDecimal: {
    type: DECIMAL,
    unique: true,
  },
  uniqueRandomReal: {
    type: REAL,
    unique: true,
  },
  uniqueRandomNoMatch: {
    type: UUID,
    unique: true,
  },
  ...timestampConfig.fields,
};

Test.init(testDTO, {
  ...timestampConfig.tableOptions,
  sequelize,
  tableName: 'test',
});

module.exports = {
  model: Test,
  testDTO,
};
