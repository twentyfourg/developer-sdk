# @twentyfourg-developer-sdk/k6-generator

[![Version](https://flat.badgen.net/npm/v/@twentyfourg-developer-sdk/k6-generator)](https://github.com/twentyfourg/developer-sdk/releases) [![Installs](https://flat.badgen.net/npm/dt/@twentyfourg-developer-sdk/k6-generator)](https://www.npmjs.com/package/@twentyfourg-developer-sdk/k6-generator)

A script that parses a JSON file containing methods and creates a ready-to-run k6 script.

## Usage

CURRENTLY: `npx ./packages/k6-generator`

IN FUTURE: `npx @twentyfourg-developer-sdk/k6-generator`

This command results in a k6 test script reflective of the methods included in the methods JSON file. This means that it may be a comprehensive 'master' script, calling each method of the project, or it can be customized by using a unique methods file or by editing the resulting script file.

Once the k6 script has been generated, it can be run with:

`k6 run tests/k6/scripts/SCRIPT_NAME`

To view the generated report after running the k6 script, simply open it in a browser.
To save the report, ensure the report has a unique name - otherwise it may be overwritten on the next k6 run.

- Dependencies:

  - `k6`
    - `https://k6.io/docs/getting-started/installation/`
    - _requires global installation_
  - `replace-in-file`
    - `https://www.npmjs.com/package/replace-in-file#installation`
  - `enquirer`
    - `https://github.com/enquirer/enquirer#-install`

- Prompts for:

  - The JSON file containing methods
  - The wait time (aka sleep) between requests
  - The name and path for the resulting k6 script
  - The name and path for the summary report the new k6 script will generate
  - The JSON file containing unique data (if required by a method)
    - Note that this _file should be named after the main object it contains_. For example, if the main object is `user` followed by an array of unique users, the file should be named `user.json`

### **Methods** JSON file:

Example:

```
  {
  "baseUrl": "http://localhost:3000",
  "vuData": {
    "email": "test@24g.com",
    "password": "************",
    "firstName": "Alpha",
    "lastName": "Test",
    "id": "************"
  },
  "routes": [
    {
      "method": "post",
      "path": "/users",
      "custom": false,
      "payload": ["email", "firstName", "lastName", "password"],
      "uniquePayload": true,
      "tag": "createUser",
      "authReq": false,
      "propertyReturned": "id",
      "bodyIncludes": null
    },
    {
      "method": "post",
      "path": "/users/auth",
      "custom": false,
      "payload": ["email", "password"],
      "uniquePayload": false,
      "tag": "userLogin",
      "authReq": false,
      "propertyReturned": "token",
      "bodyIncludes": null
    },
    {
      "method": "put",
      "path": "/users/${id}",
      "custom": true,
      "payload": ["email", "firstName", "lastName", "password"],
      "uniquePayload": false,
      "tag": "editUser",
      "authReq": true,
      "propertyReturned": "",
      "bodyIncludes": null
    },
    {
      "method": "get",
      "path": "/users?limit=10&offset=0",
      "custom": false,
      "tag": "getAllUsers",
      "authReq": true,
      "propertyReturned": "users",
      "bodyIncludes": null
    },
    {
      "method": "delete",
      "path": "/users/${id}",
      "custom": true,
      "tag": "deleteUser",
      "authReq": true,
      "propertyReturned": "",
      "bodyIncludes": null,
      "setNull": ["id", "token"]
    }
  ]
}

```

- `vuData` object should contain any variables needed in the method path
- routes should contain the represented data
  - If the path should be customized with a value from the vuData, mark `custom: true`
    - ex. `put` request in example JSON file requires an `${id}`
  - Include a property that the results should reliably include (ex. `id`, `token`, etc.)
  - If route does not return an object with properties to check against, include a unique snippet from the body of the response to check for. If there is a property to check, leave `bodyIncludes` as null and vice versa. If the route is a `204 No Content` the script will overlook the 'valid body' check as there should be nothing to check.
  - `setNull` property is supported by `post` and `delete` requests to accommodate for a user logging out (remove token) and user account being deleted (both id and token can be removed)

---

### Contributing

### Testing

### Credits

*https://github.com/roselandroche*

*https://github.com/jakowenko*

### License
