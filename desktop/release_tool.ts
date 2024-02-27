// release.ts
import { Octokit } from '@octokit/rest'

import * as shell from 'shelljs'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as prompts from 'prompts'
import 'dotenv/config'
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'))

// GitHub settings
const owner = 'juanmeister420'
const repo = 'asystent'
const token = process.env.GITHUB_ACCESS_TOKEN

// Directory settings
const distDir = path.join(__dirname, 'dist')
const ignoreList = ['builder-debug.yml', 'builder-effective-config.yaml', 'win-unpacked']

// Initialize Octokit
const octokit = new Octokit({ auth: token })

async function cleanDistDirectory() {
  const files = fs.readdirSync(distDir)
  for (const file of files) {
    if (!ignoreList.includes(file)) {
      const filePath = path.join(distDir, file)
      fs.removeSync(filePath)
    }
  }
}

async function getReleaseInfo(packageJsonVersion: string) {
  const questions = [
    {
      type: 'text',
      name: 'version',
      message: `What new version should be named (current version: ${packageJsonVersion}): `
    },
    {
      type: 'text',
      name: 'title',
      message: 'Release title: '
    },
    {
      type: 'text',
      name: 'description',
      message: 'Release description: '
    }
  ]

  return prompts(questions)
}

async function buildApplication(newVersion: string) {
  // Path to your package.json file
  const packageJsonPath = path.join(__dirname, 'package.json')

  // Read the package.json file
  const packageData = fs.readJsonSync(packageJsonPath)

  // Update the version
  packageData.version = newVersion

  // Write the updated package.json back to the file
  fs.writeJsonSync(packageJsonPath, packageData, { spaces: 2 })

  // Run the build command
  shell.exec('npm run build:win')
}

async function createRelease({
  version,
  title,
  description
}: {
  version: string
  title: string
  description: string
}) {
  const release = await octokit.repos.createRelease({
    owner,
    repo,
    tag_name: version,
    name: title,
    body: description
  })

  const { data } = release

  const exePath = path.join(distDir, `${packageJson.build.productName}-Instalator-${version}.exe`)

  const ymlPath = path.join(distDir, 'latest.yml')

  // Upload assets
  if (fs.existsSync(exePath) && fs.existsSync(ymlPath)) {
    await octokit.repos.uploadReleaseAsset({
      owner,
      repo,
      release_id: data.id,
      name: path.basename(exePath),
      data: fs.readFileSync(exePath) as any
    })

    await octokit.repos.uploadReleaseAsset({
      owner,
      repo,
      release_id: data.id,
      name: path.basename(ymlPath),
      data: fs.readFileSync(ymlPath) as any
    })
  } else {
    console.error('Required files not found in the dist directory.')
  }
}

async function checkIfTagExists(version: string): Promise<boolean> {
  try {
    const tags = await octokit.repos.listTags({
      owner,
      repo
    })
    return tags.data.some((tag) => tag.name === version)
  } catch (error) {
    console.error('Error checking existing tags:', error)
    return false
  }
}

async function main() {
  cleanDistDirectory()

  const releaseInfo = await getReleaseInfo(packageJson.version)
  if (!releaseInfo.version || !releaseInfo.title) {
    console.error('Release information is incomplete.')
    return
  }

  const tagExists = await checkIfTagExists(releaseInfo.version)
  if (tagExists) {
    console.error(`Tag ${releaseInfo.version} already exists. Choose a different version.`)
    return
  }

  await buildApplication(releaseInfo.version)
  await createRelease(releaseInfo)
}

main().catch(console.error)
