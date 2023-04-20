
This is property of Realm Stack.

//#############################################################################################################################################################################################

Capsule Contract :

A Capsule is minted from Raffle Ticket
Capsule Contract contains information of all the capsules claimed using raffle tickets

#Functions

constructor(adminAddress)
    - requires admin address

validAdmin()
    - validates if request sender is valid Admin

burn(owner, id)
    - requires owner address and Id of capsule
    - Can only be called from LOA NFT smart contract
    - This burns the capsule token when its minted as LOA NFT
    - this method internally calls doBurn method of capsule data which burns capsules when minted

airdrop(capsuleType, dropTo, units)
    - requires Capsule Type, Address of user to assign capsule, Units to capsule to assign
    - Only admin can call this function
    - used to assign no. of capsules of a particular type to a specific recipient
    - a maximum of 10 capsules can be dropped at a time
    - it internally calls getNewCapsuleIdByType() method in capsule data to make a new capsule and return Id of capsule

claim(ticketIds, raffleAddress, owner)
    - requires Raffle Ticket Ids, Raffle Address, Owner of tickets
    - used to assign capsules to user for a particular ticket and remove that ticket from user after it is claimed
    - checks if ticket is a winner, if ticket is a winner then passed ticket is burned and a new capsule is minted

safeTransferFrom(from, to, id, amount, data)
    - requires Transfer From, Transfer To, ID, Transfer Amount, Tranfer Data
    - user to transfer amount and data from a address to a another address

safeBatchTransferFrom(from, to, ids, amounts, data)
    - requires Transfer From, Transfer To, IDs, Transfer Amounts, Tranfer Data
    - user to transfer amount and data from a address to another address

extract(tokenAddress)
    - requires token address
    - transfer the amount of tokens of a particular contract from token to treasury contract



 //#############################################################################################################################################################################################

Capsule Data Contract :

contains information of all the capsules claimed, minted and yet to be claimed
yet to be claimed capsules are stored as supply

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
    - used to mint a capsule for the owner

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
    - transfer the amount of tokens of a particular contract from token to treasury contract

getUserCapsules(owner)
    - requires owner address
    - return list of owner capsules
    - used to get list of capsules owned

doBurn(id, owner)
    - requires id, owner address
    - only Capsule can access this method
    - used to burn capsules after capsule is minted

doTransfer(capsuleId, owner, dropTo)
    - requires Capsule Id, Owner address, Drop To addess
    - only Capsule can access this method
    - used to transfer a Capsule from it's current owner to a recipient

getCapsuleDetail(id)
    - requires Capsule Id
    - returns (type, level, status, owner, endTime, amount) of capsule

getCapsuleSupply(capsuleType)
    - requires capsule type
    - it checks if request sender is from any marketplace contract, then capsule level is set else it sets level to be 0. this is done to ensure user cannot predict NFT minted using same capsule
    - return (capsule total supply, capsule total consuled) of a particular type

markUnstaked(capsuleId, forced)
    - requires capsule id, action type
    - used to unstake a capsule
    - if request is forced then capsule is marked as locked else unlocked

markStaked(capsuleId)
    - requires capsule id
    - only Capsule staking contract is authorized to access and also check is capsule is locked
    - used to stake a Capsule bu changing it's status


 //#############################################################################################################################################################################################

Capsule Staking Contract

This contract is for Capsule Staking
Logic: LOA capsules needs to be staked along with LOA tokens to be eligible for revelaing the underneath NFT.
User in order to have an NFT, needs to have a capusule. Stake the capsule. Then he can open the capsule via NFT contract to get NFT.

#Functions

constructor(loaContract, adminContract)
    - requrires LOA address, admin address

validAdmin()
    - validates if request sender is valid Admin

getCapsuleStakeInfo(uint256 id)
    - requires capsule id
    - returns (owner, endtime, amount) of staked capsule

setCapsuleStakingRule(capsuleType, stakingSecs, loaTokens)
    - requires capsule type, staking time, tokens to stake
    - accessed by admin only
    - sets capsule staking duration and staking amount for one capsule of a psrticular type

stake(capsuleIds)
    - requires capsule ids
    - used to stake(vest) capsules
    - maximum of 50 capsules can be staked at a time to avoid high gas fee error
    - staked tokens are transfered from user contract to to Capsule staking contract

reclaim(capsuleIds, forced)
    - requires capsule ids, action type
    - used to reclaim staked capsules
    - if forced is true, it won't check if staking period is over or not
    - when reclaim is completed, staked loa tokens is transfered from capsule staking loa contract to user

fetchStakedCapsules(owner)
    - requires owner address
    - returns (ids) of capsules staked by owner

withdraw(tokenAddress)
    - requires token address
    - transfers the amount of loa tokens to treasury



//#############################################################################################################################################################################################


LOA NFT Contract

A NFT is made when a unlocked capsule is minted which uses LOA tokens as transaction fee

#Functions

constructor(loaContract, adminContract, nftDataContract)
    - requrires LOA token address, Admin Address, NFT Data address

validAdmin()
    - validates if request sender is valid Admin

safeTransferFrom(from, to, id, amount, data)
    - requires Transfer From, Transfer To, ID, Transfer Amount, Tranfer Data
    - user to transfer amount and data from a address to a another address

safeBatchTransferFrom(from, to, ids, amounts, data)
    - requires Transfer From, Transfer To, IDs, Transfer Amounts, Tranfer Data
    - user to transfer amount and data from a address to another address

fusion(owner, ids, fusionLevel, price)
    - requires owner address, nft ids, fusion level, price of nft
    - merge/fuse multiples nfts to a single nft of provided level

mint(capsuleIds)
    - requires capsule ids
    - mint nfts using capsules
    - checks if capsule is owned by request sender
    - minting is only possible if capsule is unlocked
    - internally calls burn method of Capsule to burn that capsule and mint NFT
    - when minting is complete, LOA balance is transfered from request sender to treasury

withdraw(tokenAddress)
    - requires token address
    - token balance is transfered to treasury




//#############################################################################################################################################################################################


LoANFT Data Contract

contains information of all NFTs available which are not yet listed in the marketplace
it also comtains information of supply of NFTs and it's attributes

#Functions

init(adminContract)
    - requires Admin Contract Address

addNFTAttributeLimits(level, hero, optionalAttributes, maxValues, minValues, defaultAttributes, defaultMaxValues, defaultMinValues, totalOptionalAttributes)
    - requires level, hero, optional attributes, maximum values of optional attribute, default attributes, maximum values of default attribute, minimum values of default attribute, total optional attributes
    - only contract admin can access this method
    - sets different nft attributes
    - check if max value is greater than minimum value of provided index

populateAttribute(id, level, hero)
    - requires nft id, nft level, nft hero
    - populates NFT afftibutes after minting
    - primary attributes are set using level and hero, and other optional attributes are set randomly

getNFTAttrLimit(level, hero)
    - requires nft level, nft hero
    - returns (attributes, default attributes, total attributes)
    - used to get different attributes for a particular level and hero

addNFTSupply(level, heroes, supply)
    - requires nft level, nft heroes, nft suppplies
    - only admin can access
    - arguments supply and heros needs to be of equal length
    - sets supply of different heros for a particular level nft
    - We are settting supply of all hereos at a time. 
    - Even if you can update the supply after some have been minted, we are ensuring total_supply calculation remains correct and supply of any hero is not less than consumed.

getNFTSupply(level)
    - requires nft level
    - returns (total supply, total consumed, heroes)

pickNFTHero(level)
    - requires nft level
    - returns nft hero
    - picks nft hero for a particular level randomly
    - this method is used during minting

getNewNFTByLevel(level)
    - requires nft level
    - returns nft id
    - check is supply is greater than consumed
    - creates a new nft
    - it also populated attributes simultaneously
    - this method is used during minting

updateFees(capsuleTypes, fees)
    - requires capsules types
    - only admin can access
    - checks arguments length are same
    - updates fee of nft minting from capsule of particular types

validAdmin()
    - validates if request sender is valid Admin

getNFTDetail(id)
    - requires nft id
    - returns nft details (id, status, owner, level, hero, attributes)

getUserNFTs(sender)
    - requires sender
    - returns nft ids owned by sender

doTransferFrom(from, to, id)
    - requires Transfer From, Transfer To, NFT ID
    - used to transfer nft from a address to recipient address

doBatchTransfer(from, to, ids)
    - requires Transfer From, Transfer To, NFT IDs
    - user to transfer nfts from a address to recipient address

doFusion(owner, ids, fusionLevel)
    - requires owner address, nft ids, fusion level
    - return nft id
    - merge/fuse provided nfts to a single nft of provided level

doMint(capsuleType, capsuleLevel, owner)
    - requires capsule type, capsule level, owner address
    - mint a new nft of a particular type and level

putNFTAttributeNames(nft_attribute_names) 
    - requires attribute names
    - sets attribut names

withdraw(tokenAddress)
    - requires token address
    - only admin can access
    - token balance is transfered to treasury

randomSubList(list, units, randomValue, startCount)
    - requires list of attributes, no. of attributes, random value, total attribute count
    - returns optional attributes of no. of attributes passed
    - attributes are generated randomly

//#############################################################################################################################################################################################


LoA NFT Fusion Contract

The responsibility of this contract is to merge multiple NFTs to a single more valuable NFT.

#Functions

constructor(loaContract, loaNFTContract, adminContract)
    - requrires LOA token Contract and LOA NFT Contract

validAdmin()
    - validates if request sender is valid Admin

createFusionRule(id, price, resultLevel, levelValues)
    - requrires fusion id, price, level, lvel values
    - only admin can access
    - Fusion rule contains the fees and type of nfts to be merged and resultant nft type

removeFusionRule(id)
    - requrires nft id
    - only admin can access
    - Admin can removes a fusion for correction.

fusion(ruleId, ids)
    - requires rule id, nft ids
    - checks if nft belonged to user
    - checks if nft level is same as fusion level
    - fusion price is transfered from user contract to treasury
    - User can call fusion with NFTs and rule id against which the NFTs to be merged into a new NFT

withdraw(tokenAddress)
    - requires token address
    - Admin can withdraw fee collected to treasury


//#############################################################################################################################################################################################


MultiSigAdmin Contract

This contract contains all the contracts available and also validates user request

#Functions

init()
    - sets request sender as admin

validAdmin()
    - validates if request sender is valid Admin

isValidAdmin(address)
    - requires contract address
    - checks if provided address is present as admin

isValidRaffleAddress(address)
    - requires contract address
    - checks if provided address is present as raffle address

setTreasury(address)
    - requires contract address
    - only admin can access
    - sets address as treasury

getTreasury()
    - gets address of treasury

setAxionAddress(address)
    - requires contract address
    - only admin can access
    - sets address as axion address

getAxionAddress()
    - gets address of axion

setFusionAddress(address)
    - requires contract address
    - only admin can access
    - sets address as fusion address

getFusionAddress()
    - gets address of fusion

setMarketAddress(address)
    - requires contract address
    - only admin can access
    - sets address as market address

getMarketAddress()
    - gets address of market

setNFTAddress(address)
    - requires contract address
    - only admin can access
    - sets address as nft address

getNFTAddress()
    - gets address of nft

setCapsuleAddress(address)
    - requires contract address
    - only admin can access
    - sets address as capsule address

getCapsuleAddress()
    - gets address of capsule

setCapsuleStakingAddress(address)
    - requires contract address
    - only admin can access
    - sets address as capsule staking address

getCapsuleStakingAddress()
    - gets address of capsule staking

setCapsuleDataAddress(address)
    - requires contract address
    - only admin can access
    - sets address as capsule data address

getCapsuleDataAddress()
    - gets address of capsule data staking

setNFTDataAddress(address)
    - requires contract address
    - only admin can access
    - sets address as nft data address

getNFTDataAddress()
    - gets address of nft data

setUtilAddress(address)
    - requires contract address
    - only admin can access
    - sets address as util address

getUtilAddress()
    - gets address of util

modifyAdmin(adminAddress, add)
    - requires admin address, action type
    - only admin can access
    - if action type is true, then admin address is added else it removes address

modifyRaffleAddress(raffleAddress, add)
    - requires raffle address, action type
    - only admin can access
    - if action type is true, then raffle address is added else it removes address

modifyRaffleAddress(sender)
    - requires sender address
    - checks if sender is equals to any contract address present

isValidCapsuleTransfer(sender, from, to)
    - requires sender address, from, to
    - checks if passed parameters are valid

random(limit, randNonce)
    - requires limit, randNonce
    - return random number



//#############################################################################################################################################################################################


NFTMarket Contract

contains NFTs/Capsules listed in the marketplace
it's purpose is to list & unlist NFTs/capsules in marketplace

#Functions

constructor(loaAddress, adminContractAddress)
    - requires loa contract adddress, admin address

updateGifting(gifting)
    - requires gifting(boolean)
    - only admin can address
    - sets if gifting is enables in contract

updateFees(contractAddresses, listingFees, trasactionFees)
    - requires contract addresses, listing fees, transaction fees
    - sets listing fees and transaction fees of when nft is to be listed in the marketplace

getMarketItem(marketItemId)
    - requires market Item Id
    - returns details of listed items in market via id

list(nftContract, tokenId, price)
    - requires contract address, token id, price
    - checks if price provided is atleast 1 wei and listing fee is greater than 0
    - checks if balance of tokens is greater than listing fee
    - list nft/capsule of provided id in market at provided price

unlist(itemId)
    - requires item id
    - unlist/remove nft/capsule of provided id

updatePrice(itemId, price)
    - requires item id, price
    - price should be greater than 0
    - checks if request sent for provided item to update price is same as user listed the NFT
    - updates price of listed nft in marketplace

giftNFT(to, itemId)
    - requires recipient address, item id
    - transfer nft provided to recipient

buy(itemId)
    - requires item id
    - checks if provided item is listed as NFT and also check if token balance is greater then buying price
    - buy a nft from marketplace
    - transfers nft to buyer
    - transfers listed price to seller
    - transfers transaction fee to treasury

fetchMarketItems()
    - returns all items listed in marketplace

extract(tokenAddress)
    - requires token address
    - only admin can access
    - transfer token balance to treasury


//#############################################################################################################################################################################################


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

constructor(loaContract, raffleHelper, admin):
    - requrires LOA address, Raffle Helper address, Admin address

validAdmin()
    - validates if request sender is valid Admin

getTicketDetail(id)
    - requires Raffle ticket ID and returns (ticket status, ticket price, ticket owner, raffle type)
    - gets ticket details

getUserTickets(userAddress)
    - requires user address
    - gets user tickets owned

getUserWinningTickets(userAddress)
    - requires user address
    - gets user tickets won

getUserWinningTickets(userAddress)
    - requires user address
    - gets user tickets won

balanceOf(tokenOwner, id)
    - requires user address/token owner, id of ticket
    - gets units od token owner by that user for a particular (value is either 1 or 0)

burn(tokenOwner, id)
    - requires user address/token owner, id of ticket
    - only capsule contract can access this method
    - can only be used if raffle is not terminated
    - used to burn raffle tickets

setRaffleInfo(category, start_time, end_time, closure_time)
    - requires type of raffle, start time of raffle, endtime of raffle, closure time fo raffle
    - can se used if raffle is not closed, start time should be less than end time, end time should be less than closure time
    - sets above mentioned values to a new raffle

buyTicket(units)
    - requires no. of tickets to buy
    - can only be used if raffle is open, start time is less than current time and raffle end time is not passed
    - used to buy tickets
    - maximum 150 tickets can be bought at a time

pickWinner(count)
    - requires no. of winning tickets
    - checks if raffle event is not passsed and winners are not declared yet
    - only admin can access this method
    - used to pick winning raffle tickets
    - maximum of 100 tickets can be picked as winners at a time, and if winners are greater than 100 then method needs to be called multiple times will all winners are picked
        this is done to make sure not high gas ee error comes because of loop present in method

terminate()
    - only admin can access this method
    - used to terminate raffle event if raffle is not closed
    - when a raffle event is terminated, balance is transfered from LOA contract to treasury

withdraw(tokenAddress)
    - requires LOA contract address
    - request sent by ticket owner to pick winning tickets and claim those raffle tickets to capsules
    - after tickets are claimed/withdrawn, remaining balance is transfered from LOA contract to treasury

cleanup()
    - if winners are declared, then ticket are flushed if tickets are already claimed
    - this method does cleanup in loop of 50s to avoid gas fee error



//#############################################################################################################################################################################################

Raffle Helper Contract

Raffle helper contains information of raffle tickets like - buying price, rewards after raffle is closed, supply

#Functions

constructor(admin):
    - requires Admin address

validAdmin()
    - validates if request sender is valid Admin

setRaffle(address)
    - requires raffle address
    - sets raffle address

putRafflePrices(supply, prices, reward_amount, reward_range)
    - requires supply of raffle in units, price of price of supply range, reward amount range, reward range
    - only admin can access
    - sets sets supply and reward range of raffle tickets
    - checks if all the values mentioned are in ascending order

calcPrice(units, currentSupply)
    - requires units and supply
    - units of tickets and total supply of tickets gives price of tickets when buying

random(limit)
    - requires limit
    - return random number

getCurrentRewards(raffle_supply)
    - requires raffle supply
    - returns rewards for provided raffles

extract(tokenAddress)
    - requires token address
    - transfer the amount of tokens of a particular contract from token to treasury contract


//#############################################################################################################################################################################################

IAdmin Contract

Interface class which implements MultiSigAdmin to verify SmartContracts
    
#Functions

isValidAdmin(adminAddress)
    - checks if admin address is valid

getTreasury()
    - returns treasury address

isValidRaffleAddress(raffleAddress)
    - checks if raffle address is valid

isValidCapsuleTransfer(sender, from,  to)
    - checks if capsule transfer is valid

isValidMarketPlaceContract(marketAddress)
    - checks if market address is valid

getCapsuleAddress()
    - returns capsule address

getCapsuleStakingAddress()
    - returns capsule staking address

getCapsuleDataAddress()
    - returns capsule data address

getNFTAddress()
    - returns loa nft address

getMarketAddress()
    - returns market address

getNFTDataAddress()
    - returns nft data address

getFusionAddress()
    - returns nft fusion address

getAxionAddress()
    - returns axion address

getUtilAddress()
    - returns util address

random()
    - returns random number



//#############################################################################################################################################################################################

IUtil Contract

Interface class which implements LOAUtil which contains random value generation

#Functions

random(limit, randNonce)
    - return random number

randomNumber(nonce)
    - return random number

sudoRandom(randomValue, slot)
    - return random number

    

//#############################################################################################################################################################################################

ZAP 

This is based on Pancakeswap. 
User can can provide single type of token to participate in (BUSD-LOA) Liquidity Pool.

#Functions

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

#Functions

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