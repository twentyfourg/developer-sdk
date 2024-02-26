import chalk from 'chalk';
import enquirer from 'enquirer';
import { execSync } from 'child_process';
import axios from 'axios';
import fs from 'fs';

import formatDateTime from './util/format.time.util.js';

const { prompt } = enquirer;

const log = console;

class Prompt {
  constructor() {
    this.packageName = 'lxp-base';
    this.continuePagination = false;
    this.matches = [];
    this.deletedFiles = [];
    this.selection = null;
  }

  async start() {
    if (!process.env.LXP_PACKAGE_HELPER_GITHUB_TOKEN)
      throw new Error('LXP_PACKAGE_HELPER_GITHUB_TOKEN is required');
    else if (!process.env.LXP_PACKAGE_HELPER_URL)
      throw new Error('LXP_PACKAGE_HELPER_URL is required');

    const version = await this.promptVersion();
    this.matches = (await this.fetchAllReleases()).filter((obj) => obj.name.includes(version));
    await this.selectVersion();
    await this.downloadPackage();

    const { value: options } = await prompt({
      type: 'multiselect',
      name: 'value',
      message: 'Package options?',
      limit: 4,
      initial: ['update', 'install', 'delete', 'commit'],
      choices: [
        {
          name: 'update',
          message: `Update ${this.packageName} in package.json to ${this.selection.package.name}?`,
        },
        { name: 'install', message: `Install ${this.packageName} to update package-lock.json?` },
        { name: 'delete', message: 'Delete old packages?' },
        { name: 'commit', message: 'Stage and commit files' },
      ],
    });

    if (options.includes('update')) {
      this.updatePackageJsonDependency();

      if (options.includes('install')) this.npmInstall();
      if (options.includes('delete')) this.deleteOldPackages();
      if (options.includes('commit')) this.commitFiles();
    }
  }

  commitFiles() {
    log.info(`${chalk.bold.cyan('⚙')} ${chalk.bold('Staging and committing files')}`);

    execSync(
      `git add package.json package-lock.json ${this.selection.package.name} ${this.deletedFiles.join(' ')}`,
      {
        stdio: 'pipe',
      }
    );
    execSync(
      `git commit -m "build: update ${this.packageName} to ${this.selection.package.name}"`,
      {
        stdio: 'pipe',
      }
    );
    log.info(`${chalk.green.bold('✔')} ${chalk.bold('Staged and committed files')}`);
  }

  deleteOldPackages() {
    const oldPackages = fs
      .readdirSync(process.cwd())
      .filter(
        (file) =>
          !file.includes(this.selection.package.name) &&
          file.includes(this.packageName) &&
          file.endsWith('.tgz')
      );

    oldPackages.forEach((file) => {
      fs.unlinkSync(file);
      this.deletedFiles.push(file);
      log.info(`${chalk.green.bold('✔')} ${chalk.bold(`Deleted ${file}`)}`);
    });
  }

  updatePackageJsonDependency() {
    const packageJsonPath = `${process.cwd()}/package.json`;
    const packageJsonText = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonText);
    packageJson.dependencies[this.packageName] = `file:${this.selection.package.name}`;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    log.info(
      `${chalk.green.bold('✔')} ${chalk.bold(`Updated ${this.packageName} to ${this.selection.package.name}`)}`
    );
  }

  npmInstall() {
    log.info(`${chalk.bold.cyan('⚙')} ${chalk.bold('Running npm install')}`);
    execSync(`npm install ${this.packageName}`, { stdio: 'pipe' });
    log.info(
      `${chalk.green.bold('✔')} ${chalk.bold(`Successfully installed ${this.packageName}`)}`
    );
  }

  async downloadPackage() {
    const path = `./${this.selection.package.name}`;
    const url = this.selection.package.api_download_url;
    log.info(`${chalk.green.cyan('↓')} ${chalk.bold('Downloading:')} ${url}`);

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      headers: {
        Accept: 'application/octet-stream',
        Authorization: `token ${process.env.LXP_PACKAGE_HELPER_GITHUB_TOKEN}`,
      },
    });

    const writer = fs.createWriteStream(path);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        log.info(`${chalk.green.bold('✔')} ${chalk.bold('Download complete')}`);
        resolve();
      });
      writer.on('error', reject);
    });
  }

  async selectVersion() {
    const { version } = await prompt({
      type: 'select',
      name: 'version',
      message: 'Select a version',
      choices: this.matches.slice(0, 10).map((obj) => ({
        name: obj.tag_name,
        message: obj.tag_name + chalk.gray(` @ ${formatDateTime(obj.published_at)}`),
      })),
    });
    this.selection = this.matches.find((obj) => obj.tag_name === version);
  }

  static parseLinkHeader(header) {
    if (!header || header.length === 0) {
      return {};
    }

    return header.split(',').reduce((acc, part) => {
      const section = part.split(';');
      const url = section[0].replace(/<|>|\s/g, '');
      const name = section[1].replace(/rel="|"/g, '').trim();
      acc[name] = url;
      return acc;
    }, {});
  }

  async fetchAllReleases(
    url = `${process.env.LXP_PACKAGE_HELPER_URL}/releases?page=1&per_page=100`,
    allReleases = []
  ) {
    const response = await fetch(url, {
      headers: {
        Authorization: `token ${process.env.LXP_PACKAGE_HELPER_GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const data = await response.json();
    allReleases = allReleases.concat(data);

    const links = Prompt.parseLinkHeader(response.headers.get('Link'));
    if (this.continuePagination && links.next)
      return this.fetchAllReleases(links.next, allReleases);

    return allReleases
      .map((release) => {
        const pkg = release.assets.find((asset) => asset.name.includes('.tgz'));
        return {
          name: release.name,
          tag_name: release.tag_name,
          published_at: release.published_at,
          html_url: release.html_url,
          package: pkg
            ? {
                name: pkg.name,
                api_download_url: pkg.url,
                browser_download_url: pkg.browser_download_url,
              }
            : null,
        };
      })
      .filter((release) => release.package);
  }

  async promptVersion() {
    const { version } = await prompt({
      type: 'input',
      name: 'version',
      message: 'Package version',
    });
    if (!version) {
      log.warn(`${chalk.red.bold('✖')} ${chalk.bold('Version is required')}`);
      return this.promptVersion();
    }
    return version;
  }
}

export default Prompt;
