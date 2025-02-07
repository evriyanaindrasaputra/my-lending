import { useState } from "react";
import { useAccount, useWriteContract, useContractRead } from "wagmi";
import { parseEther, formatEther } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" as const;

const contractAbi = [
  {
    "type": "function",
    "name": "balances",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "fulfillLoan",
    "inputs": [
      {
        "name": "offerIndex",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "requestIndex",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [

    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getOffers",
    "inputs": [

    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct LendingPool.LoanOffer[]",
        "components": [
          {
            "name": "lender",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "interestRate",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "active",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRequests",
    "inputs": [

    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct LendingPool.LoanRequest[]",
        "components": [
          {
            "name": "borrower",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "maxInterestRate",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "fulfilled",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "offerLoan",
    "inputs": [
      {
        "name": "_amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_interestRate",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [

    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "offers",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "lender",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "interestRate",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "active",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "requestLoan",
    "inputs": [
      {
        "name": "_amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "_maxInterestRate",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [

    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "requests",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "borrower",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "maxInterestRate",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "fulfilled",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "LoanAccepted",
    "inputs": [
      {
        "name": "lender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "borrower",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "interestRate",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LoanOffered",
    "inputs": [
      {
        "name": "lender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "interestRate",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "LoanRequested",
    "inputs": [
      {
        "name": "borrower",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "maxInterestRate",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "InterestRateTooHigh",
    "inputs": [

    ]
  },
  {
    "type": "error",
    "name": "InvalidAmount",
    "inputs": [

    ]
  },
  {
    "type": "error",
    "name": "InvalidInterestRate",
    "inputs": [

    ]
  },
  {
    "type": "error",
    "name": "NotEnoughLiquidity",
    "inputs": [

    ]
  },
  {
    "type": "error",
    "name": "OfferNotActive",
    "inputs": [

    ]
  },
  {
    "type": "error",
    "name": "RequestAlreadyFulfilled",
    "inputs": [

    ]
  }
] as const;

type LoanOffer = {
  lender: `0x${string}`;
  amount: bigint;
  interestRate: number;
  active: boolean;
};

export default function LendingPoolUI() {
  const { address } = useAccount();
  const [amount, setAmount] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");

  // Menggunakan useContractRead untuk mengambil data offers
  const { data: offers, isLoading, error } = useContractRead({
    address: contractAddress,
    abi: contractAbi,
    functionName: "getOffers",
  });

  // Memastikan data yang diambil adalah array
  const loanOffers = offers ? offers.map((offer: any) => ({
    lender: offer.lender as `0x${string}`,
    amount: BigInt(offer.amount),
    interestRate: Number(offer.interestRate),
    active: offer.active,
  })) : [];

  // Fungsi untuk menawarkan pinjaman
  const { writeContract, isPending } = useWriteContract();

  const handleOfferLoan = async () => {
    await writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "offerLoan",
      args: [parseEther(amount), BigInt(interestRate)],
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lending Pool</h1>

      <ConnectButton />

      {address && (
        <Card>
          <CardHeader>
            <CardTitle>Offer Loan</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              placeholder="Amount (ETH)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Interest Rate (APY)"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
            <Button className="mt-2 w-full" onClick={handleOfferLoan} disabled={isPending}>
              {isPending ? "Processing..." : "Offer Loan"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Loan Offers</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : loanOffers.length > 0 ? (
          loanOffers.map((offer, index) => (
            <Card key={index} className="mb-2">
              <CardContent>
                <p>Lender: {offer.lender}</p>
                <p>Amount: {formatEther(offer.amount)} ETH</p>
                <p>Interest Rate: {offer.interestRate}%</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No offers available.</p>
        )}
      </div>
    </div>
  );
}
