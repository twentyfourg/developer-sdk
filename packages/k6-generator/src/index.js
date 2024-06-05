#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const replace = require('replace-in-file');
const { StringPrompt, NumberPrompt } = require('enquirer');

const templateFile = fs.readFileSync('./packages/k6-generator/src/template.js');

let [customImport, customMetrics, writeVuObj, mainContent] = ['', '', '', ''];

module.exports.run = async () => {
  const methodsPath = await new StringPrompt({
    initial: './methods/expressTemplate.json',
    message: 'Confirm the path to the methods JSON file:',
  }).run();

  if (!fs.existsSync(`${methodsPath}`) || methodsPath.slice(-5) !== '.json') {
    console.log(`${methodsPath} is not a valid path`);
    process.exit();
  }

  const sleepTime = await new NumberPrompt({
    message: 'Choose wait time between requests, measured in seconds',
    initial: 1,
  }).run();

  if (typeof sleepTime !== 'number' || sleepTime <= 0 || sleepTime > 350) {
    console.log(`Wait time must be a number between 0 and 350`);
    process.exit();
  }

  const methods = require(`${path.resolve(process.cwd(), methodsPath)}`);

  const newFile = await new StringPrompt({
    initial: `./${methodsPath.slice(methodsPath.lastIndexOf('/') + 1, -5)}.k6.js`,
    message: 'Choose path and name for k6 script',
  }).run();

  if (newFile.slice(-3) !== '.js') {
    console.log(`${newFile} must end in '.js'`);
    process.exit();
  }

  fs.writeFileSync(newFile, templateFile);

  const summaryReport = await new StringPrompt({
    initial: `.${methodsPath.slice(methodsPath.lastIndexOf('/'), -5)}.summary.${Math.floor(
      Date.now() / 1000
    )}.html`,
    message: 'Choose path and name for results report, to be generated by k6 script',
  }).run();

  if (summaryReport.slice(-5) !== '.html') {
    console.log(`${summaryReport} must end in '.html'`);
    process.exit();
  }

  // DETERMINE IF UNIQUE DATA IS NEEDED
  for (let i = 0; i < methods.routes.length; i++) {
    const { method, endpoint, uniquePayload } = methods.routes[i];

    let uniqueFile;

    // GET FILE OF UNIQUE DATA, PARSE NAME OF OBJECT CONTAINED WITHIN
    if (uniquePayload) {
      uniqueFile = await new StringPrompt({
        initial: './unique/user.json',
        message: `${method} request to ${endpoint} requires unique payload - provide a path to JSON file containing this data`,
      }).run();

      if (!fs.existsSync(uniqueFile) || uniqueFile.slice(-5) !== '.json') {
        console.log(`${uniqueFile} is not a valid path`);
        process.exit();
      }

      customImport = `JSON.parse(open('${path.resolve(process.cwd(), uniqueFile)}'))`;
      const uniqueObj = `${uniqueFile.slice(uniqueFile.lastIndexOf('/') + 1, -5)}`;

      customImport = `new SharedArray('${uniqueObj}', function () {
        return ${customImport}.${uniqueObj};
      })`;
    }
  }

  if (!customImport) {
    customImport = null;
  }

  // SPAWN CUSTOM THRESHOLDS AND CHECKS
  for (let i = 0; i < methods.routes.length; i++) {
    const { tag } = methods.routes[i];

    customMetrics = `${customMetrics}
      "http_req_duration{name:${tag}}": ["p(95)<800"], // threshold on ${tag} requests only
      "checks{tag:${tag}}": ["rate>0.99"], // rate of successful checks should be higher than 99%`;
  }

  // PULL VU OBJECT FROM METHODS FILE - WITHIN DEFAULT FUNCTION
  const vuObj = Object.assign(methods['vuData']);
  writeVuObj = `const vuObj = ${JSON.stringify(vuObj)};\n\n`;

  // PARSE THROUGH ALL ROUTES AND ADD TO MAIN CONTENT - WITHIN DEFAULT FUNCTION
  const { baseUrl } = methods;

  for (let i = 0; i < methods.routes.length; i++) {
    const {
      method,
      endpoint,
      custom,
      tag,
      authReq,
      payload,
      uniquePayload,
      propertyReturned,
      bodyIncludes,
      setNull,
    } = methods.routes[i];

    let fullPath;

    const checkSleep = `check(
          ${tag}Res, {
            ['${method} - ${endpoint} returns successful status']:  (r) => r.status === 200 || r.status === 204,
            ['${method} - ${endpoint} returns valid body']: (r) =>
            r.status === 204 ? true : r.json().hasOwnProperty('${propertyReturned}'),
            ['${method} - ${endpoint} returns no error codes']: (r) => r.error_code === 0,
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
      const prop = endpoint.slice(endpoint.indexOf('$') + 2, endpoint.indexOf('}'));
      if (vuObj[prop]) {
        fullPath = `${baseUrl}${endpoint.slice(
          0,
          endpoint.indexOf('$')
        )}\$\{vuObj['${prop}']\}${endpoint.slice(endpoint.indexOf('}') + 1)}`;
      } else {
        fullPath = `${baseUrl}${endpoint.slice(
          0,
          endpoint.indexOf('$')
        )}\$\{vuObj["${prop}"]\}${endpoint.slice(endpoint.indexOf('}') + 1)}`;
      }
    } else {
      fullPath = `${baseUrl}${endpoint}`;
    }

    switch (method) {
      case 'post':
        let postContent = `${setup}
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
            
            ${checkSleep}`;

        if (tag.toLowerCase().includes('create') && `${tag}Res?.json()?.id`) {
          postContent = `${postContent}
          vuObj.id = ${tag}Res.json()['id'];\n\n`;
        }

        if (tag.toLowerCase().includes('login') && `${tag}Res?.json()?.token`) {
          postContent = `${postContent}
          vuObj.token = ${tag}Res.json()['token']
          params.headers['Authorization'] = vuObj.token;\n\n`;
        }

        if (setNull) {
          setNull.forEach(
            (property) => (postContent = `${postContent}\nvuObj['${property}'] = null`)
          );
        }
        mainContent = `${mainContent}${postContent}`;
        break;
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
              ['${method} - ${endpoint} returns successful status']: (r) =>
              r.status === 200 || r.status === 204,
              ['${method} - ${endpoint} returns valid body']: (r) =>
              r.status !== 204 && ${
                propertyReturned !== null
              } ? r.json().hasOwnProperty('${propertyReturned}') : JSON.stringify(r.body).includes('${bodyIncludes}'),
              ['${method} - ${endpoint} returns no error codes']: (r) => r.error_code === 0,
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
        let deleteContent = `${setup}
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

        if (setNull) {
          setNull.forEach(
            (property) => (deleteContent = `${deleteContent}\nvuObj['${property}'] = null`)
          );
        }

        mainContent = `${mainContent}${deleteContent}`;
        break;
      default:
        console.log('No matching method found for: ', method);
        break;
    }
  }

  options = {
    files: newFile,
    from: [
      /DYNAMIC_SLEEP_TIME/g,
      /DYNAMIC_IMPORTS_VARS/g,
      /DYNAMIC_THRESHOLDS/g,
      /DYNAMIC_VU_OBJ/g,
      /DYNAMIC_ROUTE_RES/g,
      /DYNAMIC_SUMMARY_PATH/g,
    ],
    to: [
      `${sleepTime}`,
      `${customImport}`,
      `${customMetrics}`,
      `${writeVuObj}`,
      `${mainContent}`,
      `"${summaryReport}"`,
    ],
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