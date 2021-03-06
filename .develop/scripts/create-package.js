require('@twentyfourg/cloud-sdk').logger();
const fs = require('fs-extra');
const { prompt } = require('enquirer');

const NPM_ORG = '@twentyfourg-developer-sdk';
const files = ['package.json', 'README.md'];

(async () => {
  const project = await prompt({
    type: 'input',
    name: 'project',
    message: 'What is the project name?',
  }).then((data) => data.project);

  const templatePath = './.develop/package';
  const packagePath = `./packages/${project}`;

  if (!project) {
    console.error('Please provide a project name');
    process.exit();
  }

  if (fs.existsSync(packagePath)) {
    console.error(`projects/${project} already exists`);
    process.exit();
  }

  await fs.copy(templatePath, packagePath);

  for (let i = 0; i < files.length; i++) {
    let content = await fs.readFile(`${packagePath}/${files[i]}`, 'utf8');
    content = content
      .replace(new RegExp(`${NPM_ORG}/package`, 'g'), `${NPM_ORG}/${project}`)
      .replace(/packages\/package/g, `packages/${project}`);
    await fs.writeFile(`${packagePath}/${files[i]}`, content);
  }

  console.log(`projects/${project} created`);
})();
