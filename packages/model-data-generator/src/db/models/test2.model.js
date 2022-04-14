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

const { UUID, STRING } = DataTypes;

class Test2 extends Model {}

const test2DTO = {
  id: {
    type: UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  roleSomething: {
    type: DataTypes.UUID,
    onDelete: 'SET NULL',
    allowNull: false,
    references: 'role',
  },
  roleId: {
    type: DataTypes.UUID,
    onDelete: 'SET NULL',
    allowNull: false,
    references: {
      model: {
        tableName: 'role',
      },
      key: 'id',
    },
  },
  roleName: {
    type: DataTypes.UUID,
    onDelete: 'SET NULL',
    allowNull: false,
    references: {
      model: 'role',
      key: 'name',
    },
  },
  groupId: {
    type: DataTypes.UUID,
    onDelete: 'SET NULL',
    allowNull: false,
    references: {
      model: {
        tableName: 'group',
      },
      key: 'id',
    },
  },
  groupName: {
    type: DataTypes.UUID,
    onDelete: 'SET NULL',
    allowNull: false,
    references: {
      model: 'group',
      key: 'name',
    },
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

  ...timestampConfig.fields,
};

Test2.init(test2DTO, {
  ...timestampConfig.tableOptions,
  sequelize,
  tableName: 'test2',
});

module.exports = {
  model: Test2,
  test2DTO,
};
