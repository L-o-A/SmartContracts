const { expect } = require("chai");
const { ethers } = require("hardhat");


const getRandomizedArray = (len) => {
    let a = [];
    for (let i = 1; i <= len; i++) {
      a.push(i);
    }
    return shuffle(a);
  }

  const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }


describe("RAFFLE ", function () {



  it("String Test -5", async function () {

    const [owner, addr1, addr2] = await ethers.getSigners();
    
    const StringUtil = await ethers.getContractFactory("StringUtil");
    const stringUtil = await StringUtil.deploy();
    await stringUtil.deployed();
    

    // console.log(await stringUtil.randomSubList([1,2,3,4,5,6,7,8,9], 3, 10));
    // console.log(await stringUtil.randomSubList([1,2,3,4,5,6,7,8,9], 3, 10));
    // console.log(await stringUtil.randomSubList([1,2,3,4,5,6,7,8,9], 3, 10));
    // console.log(await stringUtil.randomSubList([1,2,3,4,5,6,7,8,9], 3, 10));


    // console.log(await stringUtil.random(2, 1));
    // console.log(await stringUtil.random(2, 1));
    // console.log(await stringUtil.random(2, 1));
    // console.log(await stringUtil.random(2, 1));
    // console.log(await stringUtil.random(2, 1));

    // const balance = await ethers.provider.getBalance(owner.address);

    // let data = [];

    // for(let i = 0; i < 50000; i++) {
    //     data.push(1);
    // }
    // for(let i = 0; i < 25500; i++) {
    //     data.push(2);
    // }

    // data = shuffle(data);

    // console.log(data);

    // data = data.

    // await stringUtil.uploadOrder(data);

    // console.log(balance - await ethers.provider.getBalance(owner.address));

    for(let j = 0; j < 10; j++){
        let rands = [];
        for(let i = 0; i < 500; i++) {
            rands.push(Math.floor((Math.random() * 10000000000) + 1))
        }

        // console.log(rands);
        await stringUtil.setRandomValues(j, rands);
    }

    console.log(await stringUtil.random(100, 1))
    console.log(await stringUtil.random(100, 2))
    console.log(await stringUtil.random(100, 3))
    console.log(await stringUtil.random(100, 4))
    console.log(await stringUtil.random(100, 5))
    console.log(await stringUtil.random(100, 6))
  });





});



