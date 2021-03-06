#!/usr/bin/env node

const fs = require('fs')
const readline = require('readline')
const artifacts = require('../artifact-index.js')
const exec = require('child_process').exec

const TEMPLATE = 'readme-template.md'
const README = 'README.md'

let outStream = fs.createWriteStream(__dirname + '/../' + README)

// get coverage
exec('grep -m 1 -o ">.\\{1,5\\}%" ./docs/coverage/index.html', (error, stdout, stderr) => {
  var coverage = stdout.slice(1).replace('\n', '')

  let lines = readline.createInterface({
    input: fs.createReadStream(__dirname + '/../' + TEMPLATE)
  })
  lines.on('line', line => {
    if (line === '<coverage>') {
      outStream.write('[![solidity-coverage](https://img.shields.io/badge/coverage-' +
        coverage + '25-green.svg)](https://cclp-project.github.io/cclp-contracts/coverage)\n')
    } else if (line === '<contract-deployments>') {
      outStream.write('## Contract Deployments\n')
      outStream.write('### Mainnet (id: 1)\n')
      writeContractInfo(1)
      outStream.write('### Rinkeby testnet (id: 4)\n')
      writeContractInfo(4)
      outStream.write('### Kovan testnet (id: 42)\n')
      writeContractInfo(42)
      outStream.write('### Ropsten testnet (id: 3)\n')
      writeContractInfo(3)
    } else {
      outStream.write(line + '\n')
    }
  })
})


function writeContractInfo(id) {
  outStream.write('|Contract|Address|\n')
  outStream.write('| --|--|\n')
  outStream.write(createContractString(artifacts.AllowanceRegistry, id))
  outStream.write(createContractString(artifacts.cCLP, id))
  outStream.write('\n')
}

function createContractString(artifact, id) {
  let wrapAddr = '(not deployed)'
  let version = artifact.latestVersion
  let artifactObj = artifact[version]
  if (artifactObj.networks[id]) {
    let address = artifactObj.networks[id].address
    let netPrefix = ''
    if (id === 3) {
      netPrefix = 'ropsten.'
    } else if (id === 4) {
      netPrefix = 'rinkeby.'
    } else if (id === 42) {
      netPrefix = 'kovan.'
    }
    wrapAddr = '[' + address +'](https://' + netPrefix + 'etherscan.io/address/' + address + ')'
  }
  return '|' + artifactObj.contractName + '|' + wrapAddr + '|\n'
}
