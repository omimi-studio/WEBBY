import React, { useContext, useEffect, useState, useRef } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { SiBinance } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";

import { TransactionContext } from "../context/TransactionContext";
import { shortenAddress } from "../utils/shortenAddress";
import { Loader } from ".";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ConnectButton } from "web3uikit";
import { ethers } from "ethers";
import {tokenAddress, vaultABI, vaultAddress, validChain, contractAddress, contractABI, tokenABI, defaultRPC} from "../utils/constants";
import { useNotification } from "web3uikit";

const companyCommonStyles = "my-6 flex justify-center items-center text-lg text-white text-base font-semibold";

const Input = ({ placeholder, name, type, value, handleChange }) => (
  <input
    placeholder={placeholder}
    type={type}
    step="0.1"
    value={value}
    onChange={(e) => handleChange(e, name)}
    className="my-2 w-full rounded-lg p-3 outline-none bg-white text-[#7269ff] border-white text-sm white-glassmorphism"
  />
);

const Welcome = () => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const { currentAccount, connectWallet, sendTransaction, isLoading } = useContext(TransactionContext);
  const [vaultedValue, setVaultedVaule] = useState(ethers.utils.parseEther('0'))
  const [scvPrice, setSCVPrice] = useState(ethers.utils.parseEther('0'))
  const [bnbPrice, setBNBPrice] = useState(ethers.utils.parseEther('0'))
  const [scvToVault, setSCVToVault] = useState(ethers.utils.parseEther('0'))
  const [bnbToVault, setBNBToVault] = useState(ethers.utils.parseEther('0'))
  const [bnbToVaultUSD, setBNBToVaultUSD] = useState(ethers.utils.parseEther('0'))
  const [scvToVaultUSD, setSCVToVaultUSD] = useState(ethers.utils.parseEther('0'))

  const [vaultAmountSCV, setTotalSCVVaulted] = useState(ethers.utils.parseEther('0'));
  const [vaultAmountBNB, setTotalBNBVaulted] = useState(ethers.utils.parseEther('0'));
  const [approved, setApproved] = useState(true);

  //Pending
  const [approving, setApproving] = useState(false);
  const [vaulting, setVaulting] = useState(false);

  const changingChain = useRef(false);
  const dispatch = useNotification();

  const { account, chainId, isWeb3Enabled } = useMoralis();

  const handleSubmit = (e) => {
    const { addressTo, amount, keyword, message } = formData;

    e.preventDefault();

    if (!addressTo || !amount || !keyword || !message) return;

    sendTransaction();
  };

  const { runContractFunction: approve } = useWeb3Contract({
    abi: tokenABI,
    contractAddress: tokenAddress,
    functionName: "approve",
    params: {
      spender: vaultAddress,
      amount: ethers.constants.MaxUint256,
    },
  });

  const { runContractFunction: vaultTokens } = useWeb3Contract({
    abi: vaultABI,
    contractAddress: vaultAddress,
    functionName: "Deposit",
    msgValue: bnbToVault,
    params: {
      _scvAmount: scvToVault,
    },
  });

  const deposit = (e) => {
    e.preventDefault();
    if (!account || !isWeb3Enabled) {
      return dispatch({
        type: "error",
        message: "Please Connect Your Wallet!",
        title: "No Wallet",
        position: "topR",
      });
    }
    if (scvToVault.eq(0) || bnbToVault.eq(0)) {
      return dispatch({
        type: "error",
        message: "Please specify BNB and SSC amounts that you want to vault!",
        title: "Incorrect inputs",
        position: "topR",
      });
    }
    setVaulting(true);
    console.log("Vaulting " + ethers.utils.formatEther(scvToVault) + " SCV Tokens")
    console.log("Vaulting " + ethers.utils.formatEther(bnbToVault) + " BNB Tokens")
    vaultTokens({
      onError: (error) => setVaulting(false),
      onSuccess: handleVaultSuccess,
    });
  };



  const approveStaking = (e) => {
    e.preventDefault();
    if (!account || !isWeb3Enabled) {
      return dispatch({
      type: "error",
      message: "Please Connect Your Wallet!",
      title: "No Wallet",
      position: "topR",
    });
    }
    setApproving(true);
    approve({
      onError: (error) => setApproving(false),
      onSuccess: handleApproveSuccess,
    });
  };

  const handleApproveSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Approved Vault Contract!",
      title: "Approval",
      position: "topR",
    });
    localStorage.setItem("approved" + account, "true");
    setApproved(true);
    setApproving(false);
  };

  const handleVaultSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "Successfully Vaulted SCV and BNB tokens!",
      title: "Vaulting",
      position: "topR",
    });
    setVaulting(false);
    updateUI();
    setBNBToVault(ethers.utils.parseEther('0'))
    setSCVToVault(ethers.utils.parseEther('0'))
    setBNBToVaultUSD(ethers.utils.parseEther('0'))
    setSCVToVaultUSD(ethers.utils.parseEther('0'))
  };

  async function changedChain() {
		const targetChain ="0x" +  validChain.toString(16);
		const targetRPC = 'https://bsc-dataseed.binance.org/';
    changingChain.current = true;
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: targetChain }],
			});
      changingChain.current = false;
		} catch (error) {
			if (error.code === 4902) {
				try {
					await window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [
							{
								chainId: targetChain, // A 0x-prefixed hexadecimal string
								chainName: "BSC",
								nativeCurrency: {
									name: "BNB",
									symbol: "BNB", // 2-6 characters long
									decimals: 18,
								},
								rpcUrls: [targetRPC],
								blockExplorerUrls: ["https://bscscan.com/"],
							},
						],
					});
				} catch (addError) {
					console.error(addError);
				} finally {
          changingChain.current = false;
        }
			}
		}
	}

  const updateUI = async () => {
    const provider = new ethers.providers.JsonRpcProvider(defaultRPC);
    if (chainId && parseInt(chainId) !== validChain && !changingChain.current) {
      dispatch({
        position: 'topR',
        type: 'warning',
        message: 'Your current chain is not supported, chain will be automatically changed',
        title: "Unsupported chain"
      });
      changedChain();
    }
    const vault = new ethers.Contract(vaultAddress, vaultABI, provider);
    const token = new ethers.Contract(tokenAddress, tokenABI, provider);
    setVaultedVaule(await vault.getTotalVaultedInUSD());
    setSCVPrice(await vault.getSCVPriceInUSDT());
    setBNBPrice(await vault.getBNBPriceInUSDT());
    if (account) {
      const allowance = await token.allowance(account, vaultAddress);
      if (allowance.eq(ethers.utils.parseEther('0'))) {
        setApproved(false);
      } else {
        setApproved(true);
      }
    }
  }

  const calculateBAmount = (tokenA_amount, tokenA_price, tokenB_price) => {
    let usdtTotal_A = tokenA_amount.mul(tokenA_price);
    return usdtTotal_A.div(tokenB_price);
  }

  const getTokenAmountFromUSD = (usd_amount, token_price) => {
    return usd_amount.mul(ethers.utils.parseEther('1')).div(token_price);
  }

  const handleChange = (e, name) => {
    e.preventDefault();
    try {
      const amountTokens = ethers.utils.parseEther(e.target.value);
      if (name === "amountBNB") {
        const scvAmount = calculateBAmount(amountTokens, bnbPrice, scvPrice).mul(2);
        setBNBToVault(amountTokens);
        setSCVToVault(scvAmount);
        setSCVToVaultUSD(scvAmount.mul(scvPrice).div(ethers.utils.parseEther("1")));
        setBNBToVaultUSD(amountTokens.mul(bnbPrice).div(ethers.utils.parseEther("1")));
      } else if (name === "amountSCV") {
        const bnbAmount = calculateBAmount(amountTokens, scvPrice, bnbPrice).div(2);
        setSCVToVault(amountTokens);
        setBNBToVault(bnbAmount);
        setSCVToVaultUSD(amountTokens.mul(scvPrice).div(ethers.utils.parseEther("1")));
        setBNBToVaultUSD(bnbAmount.mul(bnbPrice).div(ethers.utils.parseEther("1")));
      } else if (name === "amountSCV_USD") {
        const bnbAmount = getTokenAmountFromUSD(amountTokens, bnbPrice).div(2);
        const scvAmount = getTokenAmountFromUSD(amountTokens, scvPrice);
        setSCVToVault(scvAmount);
        setBNBToVault(bnbAmount);
        setSCVToVaultUSD(amountTokens);
        setBNBToVaultUSD(bnbAmount.mul(bnbPrice).div(ethers.utils.parseEther("1")));
      } else if (name === "amountBNB_USD") {
        const bnbAmount = getTokenAmountFromUSD(amountTokens, bnbPrice);
        const scvAmount = getTokenAmountFromUSD(amountTokens, scvPrice).mul(2);
        setSCVToVault(scvAmount);
        setBNBToVault(bnbAmount);
        setBNBToVaultUSD(amountTokens);
        setSCVToVaultUSD(scvAmount.mul(scvPrice).div(ethers.utils.parseEther("1")));
      }
    } catch (e) {
      setBNBToVault(ethers.utils.parseEther('0'));
      setSCVToVault(ethers.utils.parseEther('0'));
    }
  };

  useEffect(() => {
    updateUI();
  }, [account, chainId]);

  return (
    <div className="mx-auto max-w-7xl justify-center items-center">
    <div className="flex sm:flex-row flex-col items-start justify-between md:p-12 py-12 px-4">
      <div className="flex flex-1 justify-start items-start flex-col mf:mr-60">
        <h1 className="text-4xl sm:text-7xl text-bold text-white py-2">
          Vault Stats
        </h1>
        <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base mb-2">
          Bridging the gap between real-world assets and the crypto market.
        </p>
        <ConnectButton />

        <div className="my-5 py-10 w-full h-full justify-start items-center white-glassmorphism">
          <div className={`rounded-tl-2xl ${companyCommonStyles}`}>
            Vaulted Value 
          </div>
          <div className={`${companyCommonStyles}`}>
            {
              parseFloat((ethers.utils.formatEther(vaultedValue).toString())).toFixed(3)
            } $
          </div>
          <div className={companyCommonStyles}>Dividends Paid</div>
          <div className={companyCommonStyles}>0</div>
          <div className={`${companyCommonStyles}`}>
            APY
          </div>
          <div className={`${companyCommonStyles}`}>
            20% 
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
        <div className="p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card .white-glassmorphism ">
          <div className="flex justify-between flex-col w-full h-full">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-full border-2 border-[#ffff] flex justify-center items-center">
                <SiBinance fontSize={23} color="#ffff" />
              </div>
              <BsInfoCircle fontSize={19} color="#ffff" />
            </div>
            <div>
              <p className="text-[#ffff] font-light text-sm">
                {shortenAddress(currentAccount)}
              </p>
              <p className="text-[#ffff] font-semibold text-lg mt-1">
                Binance x SmartChainVentures
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
          <span>BNB Amount:</span>
          <Input placeholder="Amount (BNB)" name="amountBNB" type="number" handleChange={handleChange} value={parseFloat(ethers.utils.formatEther(bnbToVault))} />
          <span>SCV Amount:</span>
          <Input placeholder="Amount (SCV)" name="amountSCV" type="number" handleChange={handleChange} value={parseFloat(ethers.utils.formatEther(scvToVault))} />
          <span>BNB Amount In USDT:</span>
          <Input placeholder="Value (BNB)" name="amountBNB_USD" type="number" handleChange={handleChange} value={parseFloat(ethers.utils.formatEther(bnbToVaultUSD))} />
          <span>SCV Amount In USDT:</span>
          <Input placeholder="Value (SCV)" name="amountSCV_USD" type="number" handleChange={handleChange} value={parseFloat(ethers.utils.formatEther(scvToVaultUSD))} />

          <div className="h-[1px] w-full bg-white-400 my-2" />
          {
            !approved && 
            <button
              disabled={approving}
              type="button"
              onClick={approveStaking}
              className="text-[#7269ff] hover:text-[#ffff] w-full mt-2 border-[1px] p-2 border-[#7269ff] hover:bg-[#7269ff] rounded-full cursor-pointer">
              {
                  approving ? "Approving..." : "Approve SCV"
              }
            </button>
          }
          {isLoading
            ? <Loader />
            : (
              <button
                disabled={vaulting}
                type="button"
                onClick={deposit}
                className="text-[#7269ff] hover:text-[#ffff] w-full mt-2 border-[1px] p-2 border-[#7269ff] hover:bg-[#7269ff] rounded-full cursor-pointer"
              >
                {
                  vaulting ? "Depositing..." : "Vault" 
                }
              </button>
            )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default Welcome;
