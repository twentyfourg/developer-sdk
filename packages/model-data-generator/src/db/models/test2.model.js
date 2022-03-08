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

const { UUID, INTEGER, MEDIUMINT, SMALLINT, TINYINT, FLOAT, DECIMAL, STRING, CHAR, BOOLEAN, NOW } =
  DataTypes;

class Test extends Model {}

const testDTO = {
  id: {
    type: UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: STRING,
  },
  email: {
    type: STRING,
  },
  userEmail: {
    type: STRING,
    unique: true,
  },
  password: {
    type: STRING,
  },
  timezone: {
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
  randomChar: {
    type: CHAR,
  },
  randomBoolean: {
    type: BOOLEAN,
  },
  randomTinyInt: {
    type: TINYINT,
  },
  randomFloat: {
    type: FLOAT,
  },
  randomNow: {
    type: NOW,
  },
  randomNoMatch: {
    type: UUID,
  },
  uniqueRandomChar: {
    type: CHAR,
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
  uniqueRandomDecimal: {
    type: DECIMAL,
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
