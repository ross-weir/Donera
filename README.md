# Donera

[![CI](https://github.com/ross-weir/Donera/actions/workflows/ci.yml/badge.svg)](https://github.com/ross-weir/Donera/actions/workflows/ci.yml)

Donera is a decentralized crowdfunding platform built on the Alephium blockchain.

It aims to be a familiar experience to web2 users while providing valuable tools to fundraisers that are made possible by innovations of blockchain technology.


## Getting Started

This repository is a monorepo containing all the libraries and apps that make up the `Doneara` application stack.

Find a brief description below:

### Packages

| Package                                           | Description                                                                                               |
|---------------------------------------------------|-----------------------------------------------------------------------------------------------------------|
| [alephium-config](/packages/alephium-config/)     | Contains common defaults and configuration values, node & explorer providers for example                  |
| [blob-store](/packages/blob-store/)               | Functionality for interacting with object stores such as IPFS                                             |
| [core](/packags/core/)                            | Core/common functionality used throughout the repository                                                  |
| [dapp](/packages/dapp/)                           | Contains the Donera smart contracts and utilities for interacting with the onchain protocol               |
| [database](/packages/database/)                   | Exposes database operations and interactions. Uses `prisma-js` for schema declaration and code generation |
| [eslint-config](/packages/eslint-config/)         | Contains eslint configurations used throughout the repository                                             |
| [indexer](/packages/indexer/)                     | Donera data indexer implementations and tooling                                                           |
| [integrations](/packages/integrations/)           | Provides functionality for intergrating Donera with external services such as Discord                     |
| [typescript-config](/packages/typescript-config/) | Contains TypeScript configurations used throughout the repository                                         |

### Applications

| Application       | Description                                                                                          |
|-------------------|------------------------------------------------------------------------------------------------------|
| [web](/apps/web/) | NextJS based web frontend for the Donera dApp. Contains the user interface and backend server        |
| [cli](/apps/cli/) | Donera command line interface providing tooling such as off-chain bots and utilities for fundraisers |
