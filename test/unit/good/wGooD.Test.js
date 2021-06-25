const { balance, time } = require('@openzeppelin/test-helpers');
const testUtils = require('../../helpers/utils')
const truffleAssert = require('truffle-assertions')
const web3 = require('web3')
const { assert } = require("chai")
const WGooD = artifacts.require('WGooD')

const { toWei, fromWei } = web3.utils

contract('WGooD test', async ([alice, bob, minter]) => {
    let wgood
    before('init contracts', async () => {
        wgood = await WGooD.new(
            {
                from: minter
            }
        )
    })

    describe('deposit native GooD to earn WGooD', () => {
        it('Alice deposits 1 native GooD by deposit', async () => {
            const depositAmount = toWei('1')
            let tx = await wgood.deposit(
                { from: alice, value: depositAmount }
            )
            
            let depositEvent = testUtils.getEventArgsFromTx(tx, 'Deposit')
            assert.equal(
                depositEvent.dst,
                alice
            )
            assert.equal(
                depositEvent.amount,
                depositAmount
            )

            assert.equal(
                fromWei(await wgood.balanceOf(alice)),
                '1'
            )
        })

        it('Alice deposits 1 native GooD by fallback', async () => {
            const depositAmount = toWei('1')
            let tx = await wgood.sendTransaction(
                { from: alice, value: depositAmount }
            )
            
            let depositEvent = testUtils.getEventArgsFromTx(tx, 'Deposit')
            assert.equal(
                depositEvent.dst,
                alice
            )
            assert.equal(
                depositEvent.amount,
                depositAmount
            )

            assert.equal(
                fromWei(await wgood.balanceOf(alice)),
                '2'
            )
        })
    })

    describe('withdraw native GooD by burning WGooD', () => {
        it('withdraw amount exceeds balance', async () => {
            truffleAssert.fails(
                wgood.withdraw(toWei('1'), { from: bob }),
                truffleAssert.ErrorType.REVERT,
                'WGooD: withdraw amount exceeds balance'
            )
        })

        it('Alice withdraws 1 native GooD', async () => {
            const withdrawalAmount = toWei('2')
            let tx = await wgood.withdraw(
                withdrawalAmount, { from: alice }
            )
            
            let withdrawEvent = testUtils.getEventArgsFromTx(tx, 'Withdrawal')
            assert.equal(
                withdrawEvent.src,
                alice
            )
            assert.equal(
                withdrawEvent.amount,
                withdrawalAmount
            )

            assert.equal(
                fromWei(await wgood.balanceOf(alice)),
                '0'
            )
        })
    })
})
