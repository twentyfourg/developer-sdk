#!/usr/bin/env node

const fs = require('fs');
const replace = require('replace-in-file');
const { StringPrompt } = require('enquirer');

const templateFile = fs.readFileSync('./template.js');

let [customImport, customMetrics, writeVuObj, uniqueObj, mainContent] = ['', '', '', '', ''];

module.exports.run = async () => {
  const methodsPath = await new StringPrompt({
    initial: './methods/expressTemplate.json',
    message: 'Confirm the path to the methods JSON file:',
  }).run();

  if (
    !fs.existsSync(`${__dirname}${methodsPath.slice(methodsPath.indexOf('/'))}`) ||
    methodsPath.slice(-5) !== '.json'
  ) {
    console.log(`${methodsPath} is not a valid path`);
    process.exit();
  }

  const methods = require(`${__dirname}${methodsPath.slice(methodsPath.indexOf('/'))}`);

  const newFile = await new StringPrompt({
    initial: 'tests/k6/scripts/alpha.js',
    message: 'Choose path and name for the results file',
  }).run();

  if (newFile.slice(-3) !== '.js') {
    console.log(`${newFile} must end in '.js'`);
    process.exit();
  }

  fs.writeFileSync(newFile, templateFile);

  // DETERMINE IF UNIQUE DATA IS NEEDED
  for (let i = 0; i < Object.keys(methods.routes).length; i++) {
    let methodUrl = Object.keys(methods.routes)[i];

    for (let j = 0; j < methods.routes[methodUrl].length; j++) {
      const current = methods.routes[methodUrl][j];
      const { path, uniquePayload } = current;

      // GET FILE OF UNIQUE DATA, PARSE NAME OF OBJECT CONTAINED WITHIN
      if (uniquePayload) {
        const uniqueFile = await new StringPrompt({
          initial: '../unique/user.json',
          message: `${methodUrl} request to ${path} requires unique payload - provide a path to JSON file containing this data`,
        }).run();

        if (
          !fs.existsSync(`${__dirname}${uniqueFile.slice(uniqueFile.indexOf('/'))}`) ||
          uniqueFile.slice(-5) !== '.json'
        ) {
          console.log(`${uniqueFile} is not a valid path`);
          process.exit();
        }

        customImport = `const SLEEP_DURATION = ${methods['sleep']}\nconst uniqueData = JSON.parse(open('${uniqueFile}'))`;
        uniqueObj = `'${uniqueFile.slice(uniqueFile.lastIndexOf('/') + 1, -5)}'`;
      }
      if (!customImport) {
        customImport = `const SLEEP_DURATION = ${methods['sleep']}`;
      }
    }
  }

  if (!uniqueObj) {
    uniqueObj = '""';
  }

  // SPAWN CUSTOM THRESHOLDS AND CHECKS
  for (let i = 0; i < Object.keys(methods.routes).length; i++) {
    let methodUrl = Object.keys(methods.routes)[i];

    for (let j = 0; j < methods.routes[methodUrl].length; j++) {
      const current = methods.routes[methodUrl][j];
      const { tag } = current;
      customMetrics = `${customMetrics}
      "http_req_duration{name:${tag}}": ["p(95)<800"], // threshold on ${tag} requests only
      "checks{tag:${tag}}": ["rate>0.99"], // rate of successful checks should be higher than 99%`;
    }
  }

  // PULL VU OBJECT FROM METHODS FILE - WITHIN DEFAULT FUNCTION
  const vuObj = Object.assign(methods['vuData']);
  writeVuObj = `let vuObj = ${JSON.stringify(vuObj)};\n\n`;

  // PARSE THROUGH ALL ROUTES AND ADD TO MAIN CONTENT - WITHIN DEFAULT FUNCTION
  const baseUrl = methods['baseUrl'];

  for (let i = 0; i < Object.keys(methods.routes).length; i++) {
    let methodUrl = Object.keys(methods.routes)[i];
    let fullPath;

    for (let j = 0; j < methods.routes[methodUrl].length; j++) {
      let current = methods.routes[methodUrl][j];
      const { path, custom, tag, authReq, payload, uniquePayload, propertyReturned, bodyIncludes } =
        current;
      const checkSleep = `check(
          ${tag}Res, {
            ['${methodUrl} - ${path} returns successful status']:  (r) => r.status === 200 || r.status === 204,
            ['${methodUrl} - ${path} returns valid body']: (r) =>
            r.status === 204 ? true : r.json().hasOwnProperty('${propertyReturned}'),
            ['${methodUrl} - ${path} returns no error codes']: (r) => r.error_code === 0,
          },
          { tag: '${tag}' }
          );
          reqBody = {}
          sleep(SLEEP_DURATION);\n\n`;
      const setup = `payload = ${JSON.stringify(payload)}
        if (${payload && payload.length > 0}) {
            parsePayload(${uniquePayload})
            }
        payload = [];
        tagName = '${tag}Res';`;

      if (custom) {
        const prop = path.slice(path.indexOf('$') + 2, path.indexOf('}'));
        if (vuObj[prop]) {
          fullPath = `${baseUrl}${path.slice(
            0,
            path.indexOf('$')
          )}\$\{vuObj['${prop}']\}${path.slice(path.indexOf('}') + 1)}`;
        } else {
          fullPath = `${baseUrl}${path.slice(
            0,
            path.indexOf('$')
          )}\$\{vuObj["${prop}"]\}${path.slice(path.indexOf('}') + 1)}`;
        }
      } else {
        fullPath = `${baseUrl}${path}`;
      }

      switch (methodUrl) {
        case 'createUser':
        case 'login':
        case 'logout':
        case 'post':
          const postContent = `${setup}
            const ${tag}Res = 
              reqBody && Object.keys(reqBody).length >= 1 
              ? http.post('${fullPath}', reqBody, {
                tags: { name: '${tag}' },
                headers: ${authReq} ? params.headers : null,
              })
              : http.post('${fullPath}', null, {
                tags: { name: '${tag}' },
                headers: ${authReq} ? params.headers : null,
              });

            ${tag === 'createUser' && `vuObj.id = ${tag}Res.json()['id'];`}
            ${
              tag === 'userLogin' &&
              `vuObj.token = ${tag}Res.json()['token'];
              params.headers['Authorization'] = vuObj.token;`
            }
            
            ${checkSleep}`;

          mainContent = `${mainContent}${postContent}`;
          break;
        case 'profile':
        case 'get':
          const getContent = `
            tagName = '${tag}Res';
            const ${tag}Res = http.get(\`${fullPath}\`, {
              tags: { name: '${tag}' },
              headers: ${authReq} ? params.headers : null,
            });
            
            saveIds(tagName, ${tag}Res)
            
            check(
            ${tag}Res,
            {
              ['${methodUrl} - ${path} returns successful status']: (r) =>
              r.status === 200 || r.status === 204,
              ['${methodUrl} - ${path} returns valid body']: (r) =>
              r.status !== 204 && ${
                propertyReturned !== null
              } ? r.json().hasOwnProperty('${propertyReturned}') : JSON.stringify(r.body).includes('${bodyIncludes}'),
              ['${methodUrl} - ${path} returns no error codes']: (r) => r.error_code === 0,
            },
            { tag: '${tag}' }
            );
            reqBody = {}
            sleep(SLEEP_DURATION);\n\n`;

          mainContent = `${mainContent}${getContent}`;
          break;
        case 'put':
          const putContent = `${setup}
            const ${tag}Res =
              reqBody && Object.keys(reqBody).length >= 1
              ? http.put(\`${fullPath}\`, reqBody, {
                tags: { name: '${tag}' },
                headers: ${authReq} ? params.headers : null,
              })
              : http.put(\`${fullPath}\`, {
                tags: { name: '${tag}' },
                headers: ${authReq} ? params.headers : null,
              });
            
            ${checkSleep}`;

          mainContent = `${mainContent}${putContent}`;
          break;
        case 'delete':
          const deleteContent = `${setup}
            const ${tag}Res = 
              reqBody && Object.keys(reqBody).length >= 1
              ? http.del(\`${fullPath}\`, reqBody, {
                tags: { name: '${tag}' },
                headers: ${authReq} ? params.headers : null,
              })
              : http.del(\`${fullPath}\`, null, {
                tags: { name: '${tag}' },
                headers: ${authReq} ? params.headers : null,
              });
            
            ${checkSleep}`;

          mainContent = `${mainContent}${deleteContent}`;
          break;
        default:
          console.log('No method found');
          break;
      }
    }
  }

  options = {
    files: newFile,
    from: [
      /DYNAMIC_IMPORTS_VARS/g,
      /DYNAMIC_THRESHOLDS/g,
      /DYNAMIC_VU_OBJ/g,
      /DYNAMIC_UNIQUE_OBJ/g,
      /DYNAMIC_ROUTE_RES/g,
    ],
    to: [`${customImport}`, `${customMetrics}`, `${writeVuObj}`, `${uniqueObj}`, `${mainContent}`],
    countMatches: true,
  };

  try {
    await replace(options);
  } catch (error) {
    console.error(error);
  }
};

this.run()
  .then(() => process.exit())
  .catch((error) => {
    if (error) console.error(error);
  });
