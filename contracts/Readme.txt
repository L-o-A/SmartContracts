
This is property of Realm Stack.


Raffle Contract :

Raffale contract is kind of lottery contract, where user can stake LOA token for one or multiple Raffle tickets.
After tickets are allocated, then user can open those tickets to find if they have own capsule token or not. Anyone who doesn't won capsule after opening ticket, will get his staked LOA in his account.
User can open capsule token to mint LOA NFT.

Rules:

LOA Capsule is a ERC-1155 standard NFT.
Standard Raffle: No. of LOA Capsules per draw is shown in table above (this amount is subjected to change). No limit on the number of wallets that can participate, each wallet can purchase any amount of raffle tickets.
Each wallet can win more than 1 LOA Capsule, depending on how many raffle tickets owned by that specific wallet are selected as a winner.
Standard Raffle price starts from $30 BUSD worth of $LOA Tokens for the first 5,000 raffle entries (the price may change seeing current marketplace conditions). As the raffle entries increases, the price of the raffle entries increases according to the tier which is based on the table above.
Once you participate, your $LOA Tokens will be staked/frozen, at the end of the Raffle if you did not get a LOA Capsule you can redeem your $LOA Tokens.
At the end of the raffle period, random raffle numbers will be drawn to identify the winners for the LOA Capsules. 
Once you participate, your $LOA Tokens will be staked/held. At the end of the Raffle Event, you are able to redeem your $LOA Tokens if you did not get a LOA Capsule.
The amount of $LOA Tokens staking requirements may change at a later time if deemed necessary by the team.
All $LOA Tokens used to win the LOA Capsules will be sent to the Treasury Pool.
Using Smart Contracts for the raffle is strictly prohibited.
$LOA Token Holders will have the opportunity to vote on the Raffle Event rules in the future.
Unclaimed LOA Capsules are stored in the Marketplace Storage for a period of time. After that time exceeds, the LOA Capsules will be forfeited and the $LOA Tokens staked will be returned to the respective wallets.

#Functions

constructor():
    - requrires LOA address, Raffle Helper address, Admin address

validAdmin()
    - validates if request sender is valid Admin

getTicketDetail()
    - requires Raffle ticket ID and returns (ticket status, ticket price, ticket owner, raffle type)
    - gets ticket details

buyTicket()
    - requires no. of units
    - to buy no. tickets requested by request sender

pickWinner():
    - requires no. of winning tickets
    - used to pick winning raffle tickets
    - only admin can access this method

terminate():
    - used to terminate raffle event if raffle is not closed

withdraw()
    - requires LOA contract address
    - request sent by ticket owner to pick winning tickets and claim those raffle tickets to capsules

cleanup()
    - if winners are declared, then ticket are flushed if tickets are already claimed




//#############################################################################################################################################################################################

Capsule Contract :

LOA Capsule is a ERC-1155 standard NFT.
Standard Raffle: No. of LOA Capsules per draw is shown in table above (this amount is subjected to change). 
No limit on the number of wallets that can participate, each wallet can purchase any amount of raffle tickets.
Each wallet can win more than 1 LOA Capsule, depending on how many raffle tickets owned by that specific wallet are selected as a winner.
Standard Raffle price starts from $30 BUSD worth of $LOA Tokens for the first 5,000 raffle entries (the price may change seeing current marketplace conditions). As the raffle entries increases, the price of the raffle entries increases according to the tier which is based on the table above.
Once you participate, your $LOA Tokens will be staked/frozen, at the end of the Raffle if you did not get a LOA Capsule you can redeem your $LOA Tokens.
At the end of the raffle period, random raffle numbers will be drawn to identify the winners for the LOA Capsules. 
Once you participate, your $LOA Tokens will be staked/held. At the end of the Raffle Event, you are able to redeem your $LOA Tokens if you did not get a LOA Capsule.
The amount of $LOA Tokens staking requirements may change at a later time if deemed necessary by the team.
All $LOA Tokens used to win the LOA Capsules will be sent to the Treasury Pool.
Using Smart Contracts for the raffle is strictly prohibited.
$LOA Token Holders will have the opportunity to vote on the Raffle Event rules in the future.
Unclaimed LOA Capsules are stored in the Marketplace Storage for a period of time. After that time exceeds, the LOA Capsules will be forfeited and the $LOA Tokens staked will be returned to the respective wallets.


#Functions

constructor(adminAddress)
    - requires admin address

validAdmin()
    - validates if request sender is valid Admin

burn(owner, id)
    - requires owner address and Id
    - This burns the capsule token when its minted as LOA NFT
    - Can only be called from LOA NFT smart contract

airdrop(capsuleType, dropTo, units)
    - requires Capsule Type, Address of user to assign capsule, Units to capsule to assign
    - used to assign no. of capsules of a particular type to a specific recipient
    - Only admin call this function

claim(ticketIds, raffleAddress, owner)
    - requires Raffle Ticket Ids, Raffle Address, Owner of tickets
    - used to assign capsules to user for a particular ticket and remove that ticket from user after it is claimed

safeTransferFrom(from, to, id, amount, data)
    - requires Transfer From, Transfer To, ID, Transfer Amount, Tranfer Data
    - user to transfer amount and data from a address to a another address

safeTransferFrom(from, to, ids, amounts, data)
    - requires Transfer From, Transfer To, IDs, Transfer Amounts, Tranfer Data
    - user to transfer amount and data from a address to another address

extract(tokenAddress)
    - requires token address
    - transfer the amount of tokens of a particular contract from treasury contract to recipient contract



 //#############################################################################################################################################################################################

Capsule Data Contract :

LOA Capsule is a ERC-1155 standard NFT.
Standard Raffle: No. of LOA Capsules per draw is shown in table above (this amount is subjected to change). 
No limit on the number of wallets that can participate, each wallet can purchase any amount of raffle tickets.
Each wallet can win more than 1 LOA Capsule, depending on how many raffle tickets owned by that specific wallet are selected as a winner.
Standard Raffle price starts from $30 BUSD worth of $LOA Tokens for the first 5,000 raffle entries (the price may change seeing current marketplace conditions). As the raffle entries increases, the price of the raffle entries increases according to the tier which is based on the table above.
Once you participate, your $LOA Tokens will be staked/frozen, at the end of the Raffle if you did not get a LOA Capsule you can redeem your $LOA Tokens.
At the end of the raffle period, random raffle numbers will be drawn to identify the winners for the LOA Capsules. 
Once you participate, your $LOA Tokens will be staked/held. At the end of the Raffle Event, you are able to redeem your $LOA Tokens if you did not get a LOA Capsule.
The amount of $LOA Tokens staking requirements may change at a later time if deemed necessary by the team.
All $LOA Tokens used to win the LOA Capsules will be sent to the Treasury Pool.
Using Smart Contracts for the raffle is strictly prohibited.
$LOA Token Holders will have the opportunity to vote on the Raffle Event rules in the future.
Unclaimed LOA Capsules are stored in the Marketplace Storage for a period of time. After that time exceeds, the LOA Capsules will be forfeited and the $LOA Tokens staked will be returned to the respective wallets.


#Functions

constructor(adminAddress)
    - requires admin address

validAdmin()
    - validates if request sender is valid Admin

validCapsule()
    - validates if request sender is valid Capsule Address

getNewCapsuleIdByType(capsuleType, owner)
    - requires Capsule Type, Owner address
    - return Capusule Id
    - used to get a Capsule id after assigning a capsule to owner address

addCapsuleSupply(capsuleType, levels, supply)
    - requires Capsule Type, Capsule Levels, Capsule Supplies
    - can be accessed by admin only
    - used to assign Capsule of a particular type of different level with it's supply

pickCapsuleLevel(capsuleType)
    - requires Capsule Type
    - returns capusle level
    - used to get a capsule level picked randomly of a particular type

extract(tokenAddress)
    - requires token address
    - transfer the amount of tokens of a particular contract from treasury contract to recipient contract

getUserCapsules(owner)
    - requires owner address
    - return list of owner capsules
    - used to get list of capsules owned

doBurn(id, owner)
    - requires id, owner address
    - only Capsule can access this method
    - used to burn capsules to NFT

doTransfer(capsuleId, owner, dropTo)
    - requires Capsule Id, Owner address, Drop To addess
    - only Capsule can access this method
    - used to transfer a Capsule from it's current owner to a recipient

getCapsuleDetail(id)
    - requires Capsule Id
    - returns (type, level, status, owner, endTime, amount) of capsule

getCapsuleSupply(capsuleType)
    - requires capsule type
    - return (capsule total supply, capsule total consuled) of a particular type

markUnstaked(capsuleId, forced)
    - requires capsule id, action type
    - used to unstake a capsule
    - if request id forced then capsule is marked as locked else unlocked

markStaked(capsuleId, forced)
    - requires capsule id
    - used to stake a Capsule


 //#############################################################################################################################################################################################

Capsule Staking Contract


This contract is for Capsule Staking
Logic: LOA capsules needs to be staked along with LOA tokens to be eligible for revelaing the underneath NFT.
User in order to have an NFT, needs to have a capusule. Stake the capsule. Then he can open the capsule via NFT contract to get NFT.

constructor(loaContract)
    requrires address or LOA token


addAdmin()
    Add a admin for this contract

removeAdmin()
    Add a admin for this contract

setTresury()
    Sets the admin treasury address


setCapsuleContract(capsuleContract)
    Only admin set capsule contract.

setCapsuleStakingRule(capsuleType, stakingDays, loaTokens)
    Only admin can set capsule staking rules

stake(capsuleIds)
    User can stake multiple capsule tokens

reclaim(capsuleIds)
    User can reclaim can capsule tokens after the staking period is over.


//#############################################################################################################################################################################################


LOA NFT Contract

This is contract that creates LOA NFTs
In order to mint an LOA NFT user need to submit an 


constructor(loaContract)
    requrires address of LOA token

updateAccessAddressAndFees(capsuleContract, nftMarketAddress, fusion_address, capsuleTypes, fees)
    Only admin can set capsule contract address, NFT martket address, fusion contract address.
    Also it sets capsule minting fees for each capsule type.

getNFTDetail(id)
    this returns the nft detail.

modifyNFTs(bool adding, ids, levels, heroes, startTimes)
    Only Admin can set/remove NFT details and its attributes to be minted.


mint(capsuleId)
    User can mint an NFT by providing capsule token that they own.
    They also have to pay minting fee along with capsule token.

withdraw()
    Admin can withdraw fee collected from minting fees.



//#############################################################################################################################################################################################


LoA NFT Fusion Contract

The responsibility of this contract is to merge multiple NFTs to a single more valuable NFT.

constructor(loaContract, loaNFTContract)
    requrires address of LOA token and LOA NFT Contract


addAdmin()
    Add a admin for this contract

removeAdmin()
    Add a admin for this contract

setTresury()
    Sets the admin treasury address

withdraw()
    Admin can withdraw fee collected from minting fees.

createFusionRule(id, price,  resultLevel, levelValues)
    Admin can add fusion rule.
    Fusion rule contains the fees and type of nfts to be merged and resultant nft type.

removeFusionRule(id)
    Admin can removes a fusion for correction.

fusion(ruleId, ids)
    User can call fusion with NFTs and rule id against which the NFTs to be merged into a new NFT.




//#############################################################################################################################################################################################

ZAP 

This is based on Pancakeswap. 
User can can provide single type of token to participate in (BUSD-LOA) Liquidity Pool.

constructor( busdAddress, loaAdddress,  wBNBAddress, pancakeRouterAddress)
    required BUSD token address, LOA token address, Wrapped BNB token address, Pancakeswap Router Address

addAdmin()
    Add a admin for this contract

removeAdmin()
    Add a admin for this contract

setTresury()
    Sets the admin treasury address

zap(token, amount)
    User provides token type and amount to zap to provide BUSD-LOA liquidity

zapEth()
    User provides BNB to zap to provide BUSD-LOA liquidity

swapTokens(_from,  amount, _to, amountOutMin, receiver, deadline)
    User can swap one token for another.
    Its an overridden methos of Pancakeswap router.
    It only supports which are configured to be supported.
    

//#############################################################################################################################################################################################


LPStaking

This contract is used to stake BUSD-LOA Liqidity Pool tokens or LOA tokens to earn rewards 

constructor(address loaContract, address stakeContract)
    required LOA token address, Staked Token address ( can be LP token or LOA token)

addAdmin()
    Add a admin for this contract

removeAdmin()
    Add a admin for this contract

setTresury()
    Sets the admin treasury address

setRewardsPerSecond(rewardPerSec)
    Only admin sets rewards per second.

updateWithdrawalFee(dayList, fees)
    Only admin sets the withdrawal fee if withdrawn before specific days of staking.
    example [180, 90, 30, 14, 7], [0, 1, 2, 3, 4, 5]
    fees are provided in 1/10th of a percentage basis

claimRewards()
    User can reap the rewards that he has accumulated till now

Reward Logic:
    EveryTime a user stakes or unstakes previous rewards are distributed to the calling user.
    * EveryTime a user stakes 
        cumulativeRewardsPerToken += (now - lastRewardDistributed) * rewardsPerSecond / totalStakedTokens.
        _rewardTallyBefore[msg.sender] = cumulativeRewardsPerToken;
        lastRewardDistributed = now
        _tokenStakedAt[msg.sender] = now;
    * On subscequent stake or unstake rewards 
        rewards = (currentCumulativeRewardsPerToken - _rewardTallyBefore[msg.sender]) * user_token_staked
        new CumulativeRewardsPerToken is calculated and set.
Algo link: https://uploads-ssl.webflow.com/5ad71ffeb79acc67c8bcdaba/5ad8d1193a40977462982470_scalable-reward-distribution-paper.pdf

myRewards()
    It returns how much reward user has accumulated and what the per seconds rewards he gets and when his rewards were last _rewardDistributedLast

stake(amount)
    User can stake by provided Staked Token

unstake(withdrawAmount)
    User can unstake his tokens by calling this function. Withdrawal fees will be deducted as per rule.

withdraw()
    Admin can withdraw fee collected from unstaking fees.


extract()
    Admin can withdraw any artibary ERC20 token send to this address.