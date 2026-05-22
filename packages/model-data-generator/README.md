# @twentyfourg-developer-sdk/model-data-generator

[![Version](https://flat.badgen.net/npm/v/@twentyfourg-developer-sdk/model-data-generator)](https://github.com/twentyfourg/developer-sdk/releases) [![Installs](https://flat.badgen.net/npm/dt/@twentyfourg-developer-sdk/model-data-generator)](https://www.npmjs.com/package/@twentyfourg-developer-sdk/model-data-generator)

An interactive CLI that reads your Sequelize model files, generates realistic dummy data respecting field names and type constraints, and either inserts the data directly into a MySQL database or writes it to a fixture file.

## Requirements

- Node.js v18+
- For database insertion, a running MySQL instance and the following environment variables:

| Variable | Description |
|---|---|
| `SQL_HOST` | MySQL host (or `READER_SQL_HOST` for a read replica) |
| `SQL_USER` | MySQL username |
| `SQL_PASSWORD` | MySQL password |
| `SQL_DATABASE` | MySQL database name |
| `SDK_SEQUELIZE_MODELS_PATH` | *(optional)* Path to the models folder. Defaults to `./src/db/models`. |

## Usage

```bash
npx @twentyfourg-developer-sdk/model-data-generator
```

## Interactive Workflow

1. **Confirm models path** – Defaults to `./src/db/models` (overridable via `SDK_SEQUELIZE_MODELS_PATH`).
2. **Filter models** – If more than 5 model files are found you can enter a filter string to narrow the list.
3. **Select models** – Multi-select from the discovered `*.model.js` files.
4. **Per-model options** (repeated for each selected model):
   - **How many objects** to create.
   - **Dry run** – If `Yes`, generated data is printed to the console instead of inserted into the database.
   - **Create fixture file** – If `Yes`, data is written to `./seeders/fixtures/<table>.dummy.fixture.json`.

## Model File Format

Model files must export a DTO (Data Transfer Object) that describes each column. The object key must end in `DTO` and the key prefix becomes the table name (e.g. `userDTO` → table `user`).

```js
// src/db/models/user.model.js
const { DataTypes } = require('sequelize');

module.exports = {
  userDTO: {
    firstName: { type: DataTypes.STRING },
    email:     { type: DataTypes.STRING, unique: true },
    age:       { type: DataTypes.INTEGER, allowNull: true },
    roleId:    { type: DataTypes.INTEGER, references: { model: 'roles', key: 'id' } },
  },
};
```

## Data Generation Rules

### Field Name Matching (takes priority)

When a field name matches one of the following patterns, semantically appropriate data is generated:

| Field name / pattern | Generated data |
|---|---|
| `firstname` | First name |
| `lastname` | Last name |
| `name`, `fullname` | Full name |
| `email` (exact) | `test@24g.com` |
| contains `email` | `<nanoid(5)>@24g.com` |
| `password` | bcrypt hash of `testpassword` |
| `message`, `description` | Lorem ipsum sentence |
| `timezone` | Random IANA timezone |
| `addressone` | Street address |
| `city` | City name |
| `state` | 2-letter state abbreviation |
| `country` | Country name |
| `zip` | 5-digit zip code |
| `phone` | `###-###-####` format |
| contains `link` | Random URL |

### Type-Based Fallback

If a field name is not matched, data is generated from the Sequelize column type:

| Sequelize type | Generated value | Range / notes |
|---|---|---|
| `STRING`, `CHAR` | Random string | Respects `length` constraint |
| `TEXT` | Lorem ipsum sentences | `tiny` = 2, `medium` = 8, `long` = 16 sentences |
| `BOOLEAN` | `0` or `1` | |
| `INTEGER` | Random integer | -2,147,483,648 – 2,147,483,647 |
| `BIGINT` | Random bigint | Full bigint range |
| `MEDIUMINT` | Random integer | -8,388,608 – 8,388,608 |
| `SMALLINT` | Random integer | -32,768 – 32,767 |
| `TINYINT` | Random integer | -128 – 127 |
| `FLOAT`, `DOUBLE`, `DECIMAL`, `REAL` | Random float | |
| `NOW` | Random datetime | ISO 8601 string |

### Constraints

| Constraint | Behaviour |
|---|---|
| `allowNull: true` | The field has a ~50 % chance of being `null`. |
| `unique: true` | A pool of unique values is pre-generated (2× the requested count) and consumed one at a time. |
| `primaryKey` | Field is skipped. |
| `defaultValue` | Field is skipped. |

### Foreign Key References

If a field has a `references` property, the generator queries the referenced table for a random existing record and uses its value. Three reference formats are supported:

```js
// String shorthand
references: 'roles'

// Object with string model
references: { model: 'roles', key: 'id' }

// Object with Sequelize model class
references: { model: Role, key: 'id' }
```

> **Note:** Foreign key resolution requires a live database connection.

## Testing

```bash
npm test
```

Tests use [Jest](https://jestjs.io/) with coverage collection enabled. Test fixtures are located in `packages/model-data-generator/tests/`.

## Dependencies

- [`@faker-js/faker`](https://fakerjs.dev/) – Fake data generation
- `bcrypt` – Password hashing
- `nanoid` – Unique short IDs
- `sequelize` + `mysql2` – ORM and DB driver
- `enquirer` – Interactive prompts
- `ansi-colors` – Terminal colour output
- `dotenv` – Environment variable loading
- [`@twentyfourg/cloud-sdk`](https://github.com/twentyfourg/cloud-sdk) – Logger initialisation

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

### Credits

- *https://github.com/jakowenko*
- *https://github.com/roselandroche*
