"use client"
import React, { useContext, useEffect, useState } from "react";

import { TransactionContext } from "../context/TransactionContext";

import useFetch from "../hooks/useFetch";
import dummyData from "../utils/dummyData";
import { shortenAddress } from "../utils/shortenAddress";
import {vaultABI, vaultAddress, defaultRPC} from "../utils/constants";
import {ethers} from "ethers";

const TransactionsCard = ({ addressTo, addressFrom, timestamp, message, keyword, amountSCV, amountBNB, url }) => {
  const gifUrl = useFetch({ keyword });

  return (
    <div className="bg-[#7269ff] m-4 flex flex-1
      2xl:min-w-[450px]
      2xl:max-w-[500px]
      sm:min-w-[270px]
      sm:max-w-[300px]
      min-w-full
      flex-col p-3 rounded-2xl hover:shadow-2xl"
    >
      <div className="flex flex-col items-center w-full mt-3">
        <div className="display-flex justify-start w-full mb-6 p-2">
          <a href={`https://ropsten.etherscan.io/address/${addressFrom}`} target="_blank" rel="noreferrer">
            <p className="text-white text-base">From: {shortenAddress(addressFrom)}</p>
          </a>
          <p className="text-white text-base">Amount: {amountBNB} BNB</p>
          <p className="text-white text-base">Amount: {amountSCV} SCV</p>
        </div>
        <div className="bg-[#7269ff] p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
          <p className="text-[#ffff] font-bold">{timestamp}</p>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const { transactions, currentAccount } = useContext(TransactionContext);
  const [data, setData] = useState([]);

  const shortenNumber = (n, afterZero)=>{
    let started = false;
    let final = "";
    let reachedValue = false;
    let reachedDot = false;
    for(let i = 0; i < n.length; i ++){
      if(started){
        afterZero -= 1;  
      }
      if(n.charAt(i) != '.' && n.charAt(i) != '0'){
        reachedValue = true;
      }
      if(n.charAt(i) == '.'){
        reachedDot = true;
      }
      if(reachedDot && reachedValue){
        started = true;
      }
      final += n.charAt(i); 
      if(afterZero <= 0){
        break;
      }
    }
    return final;
  }

  const updateUI = async () => {
    const provider = new ethers.providers.JsonRpcProvider(defaultRPC);
    const vault = new ethers.Contract(vaultAddress, vaultABI, provider);
    let txs = [];
    const count = parseInt((await vault.getInvestsCount()).toString());
    let id = 0;
    for (let i = count - 1; i >= 0; i -= 1) {
      id += 1;
      try {
        const invest = await vault.allInvests(i);
        const investTime = new Date(parseInt(invest.time) * 1000).toUTCString();
        const newTx = {
          id,
          url: "https://media4.popsugar-assets.com/files/2013/11/07/832/n/1922398/eb7a69a76543358d_28.gif",
          timestamp: investTime,
          amountBNB: shortenNumber(ethers.utils.formatEther(invest.bnbAmount), 3),
          amountSCV: shortenNumber(ethers.utils.formatEther(invest.scvAmount), 3),
          addressTo : invest.receiver,
          addressFrom : invest.investor
        };
        txs.push(newTx);
        if (txs.length === 5) {
          break;
        } 
      } catch(e) {
        break;
      }
    }
    setData(txs);
    console.log(data)
  }

  useEffect(() => {
    updateUI();
  }, []);

  return (
    <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
      <div className="flex flex-col md:p-12 py-12 px-4">
        {currentAccount ? (
          <h3 className="text-white text-3xl text-center my-2">
            Latest Vaulted Transactions
          </h3>
        ) : (
          <h3 className="text-white text-3xl text-center my-2">
            Connect your account to see the latest vaulted transactions
          </h3>
        )}

        <div className="flex flex-wrap justify-center items-center mt-10">
          {data.map((transaction, i) => (
            <TransactionsCard key={i} {...transaction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transactions;
