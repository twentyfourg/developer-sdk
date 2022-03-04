# @twentyfourg-developer-sdk/model-data-generator

[![Version](https://flat.badgen.net/npm/v/@twentyfourg-developer-sdk/model-data-generator)](https://github.com/twentyfourg/developer-sdk/releases) [![Installs](https://flat.badgen.net/npm/dt/@twentyfourg-developer-sdk/model-data-generator)](https://www.npmjs.com/package/@twentyfourg-developer-sdk/model-data-generator)

A script that parses a model file, reads data types required, applies constraints listed, creates dummy data, and injects that data into the database and or a fixture file.

## Usage

```
npx @twentyfourg-express-sdk/model-data-generator
```

- Prompts for:

  1. What models to populate
  2. How many objects to create for each model
  3. Dry run option

     - If chosen, data will will not be inserted into the db, but rather printed to the console

  4. Create a fixture file option

---

**Ignores**:

- Fields with keys of:
  - defaultValue
  - primaryKey

---

**Supports**:

- Constraints:

  - allowNull
  - unique
    - For names:
      - All names that exactly match the `chance` naming convention
        - 'email', 'city', etc.
    - For types:
      - 'string', 'char'
        - supports length constraint (integer)
      - 'text'
        - supports length constraint (string)
      - 'integer' types
      - 'float', 'double', 'decimal'

- References to other tables

- Field Names:

  - 'firstname'
  - 'lastname'
  - 'name'
  - 'fullname'
  - 'message'
  - 'description'
  - 'timezone'
  - 'addressOne'
  - 'city'
  - 'state'
  - 'country'
  - 'zip'
  - 'phone'
  - name.includes:
    - 'email'
    - 'link'

- Data Types:
  - 'string'
    - Constraints:
      - Length (integer)
  - 'char'
    - Constraints:
      - Length (integer)
  - 'text':
    - Constraints:
      - Length (string)
  - 'boolean':
    - Format of 0 or 1
  - 'integer':
    - min: -2147483648
    - max: 2147483647
  - 'bigint':
    - min: -9223372036854775808
    - max: 9223372036854775807
  - 'mediumint':
    - min: -8388608
    - max: 8388608
  - 'smallint':
    - min: -32768
    - max: 32767
  - 'tinyint':
    - min: -128
    - max: 127
  - 'float'
  - 'double'
  - 'decimal'
  - 'real'
  - 'now'

## Contributing

## Testing

- `npm test`

### Credits

*https://github.com/jakowenko*
*https://github.com/roselandroche*

### License
