import { Contract } from 'ethers'
import {
  BaseRegistrarImplementation as permanentRegistrarContract,
  BulkRenewal as bulkRenewalContract,
  SID as ensContract,
  BNBRegistrarControllerV8 as permanentRegistrarControllerContract,
  DNSRegistrar as dnsRegistrarContract,
  Resolver as resolverContract,
  ReverseRegistrar as reverseRegistrarContract,
  TestRegistrar as testRegistrarContract,
  AggregatorInterface as oracleContract,
  SidGiftCardRegistrar as giftCardRegistrar,
  SidGiftCardController as giftCardController,
  SidGiftCardLedger as giftCardLedger,
} from '@siddomains/sid-contracts'

import { abi as oldResolverContract } from '@ensdomains/contracts/abis/ens-022/PublicResolver.json'
import { abi as dnsRegistrarContractOld } from '@ensdomains/contracts/abis/dnsregistrar/DNSRegistrar.json'
import { abi as legacyAuctionRegistrarContract } from '@ensdomains/contracts/abis/ens/HashRegistrar'
import { abi as deedContract } from '@ensdomains/contracts/abis/ens/Deed'

function getReverseRegistrarContract({ address, provider }) {
  return new Contract(address, reverseRegistrarContract, provider)
}

function getResolverContract({ address, provider }) {
  return new Contract(address, resolverContract, provider)
}

function getOldResolverContract({ address, provider }) {
  return new Contract(address, oldResolverContract, provider)
}

function getENSContract({ address, provider }) {
  return new Contract(address, ensContract, provider)
}

function getTestRegistrarContract({ address, provider }) {
  return new Contract(address, testRegistrarContract, provider)
}

function getOldDnsRegistrarContract({ parentOwner, provider }) {
  return new Contract(parentOwner, dnsRegistrarContractOld, provider)
}

function getDnsRegistrarContract({ parentOwner, provider }) {
  return new Contract(parentOwner, dnsRegistrarContract, provider)
}

function getPermanentRegistrarContract({ address, provider }) {
  return new Contract(address, permanentRegistrarContract, provider)
}

function getPermanentRegistrarControllerContract({ address, provider }) {
  return new Contract(address, permanentRegistrarControllerContract, provider)
}

function getDeedContract({ address, provider }) {
  return new Contract(address, deedContract, provider)
}

function getLegacyAuctionContract({ address, provider }) {
  return new Contract(address, legacyAuctionRegistrarContract, provider)
}

function getBulkRenewalContract({ address, provider }) {
  return new Contract(address, bulkRenewalContract, provider)
}

function getOracleContract({ address, provider }) {
  return new Contract(address, oracleContract, provider)
}
function getGiftCardController({ address, provider }) {
  return new Contract(address, giftCardController, provider)
}
function getGiftCardRegistrar({ address, provider }) {
  return new Contract(address, giftCardRegistrar, provider)
}
function getGiftCardLedger({ address, provider }) {
  return new Contract(address, giftCardLedger, provider)
}

export {
  getTestRegistrarContract,
  getReverseRegistrarContract,
  getENSContract,
  getResolverContract,
  getOldResolverContract,
  getDnsRegistrarContract,
  getOldDnsRegistrarContract,
  getPermanentRegistrarContract,
  getPermanentRegistrarControllerContract,
  getLegacyAuctionContract,
  getDeedContract,
  getBulkRenewalContract,
  getOracleContract,
  getGiftCardRegistrar,
  getGiftCardController,
  getGiftCardLedger,
}
