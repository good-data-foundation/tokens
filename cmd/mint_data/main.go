package main

import (
	"fmt"
	"math/big"
	"os"
	"strconv"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
)

const MINT_ABI = `
[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]
`

var (
	Big10  = big.NewInt(10)
	BigE15 = new(big.Int).Exp(Big10, big.NewInt(15), common.Big0)
	BigE18 = new(big.Int).Exp(Big10, big.NewInt(18), common.Big0)
)

func main() {
	if len(os.Args) < 3 {
		fmt.Printf(`Usage: COMMAND <to> <amount>
Example: 
	go run ./cmd/mint_data 0xCA4711dfe9Ea4A7CD6798e9A9e11558286520ddD 100000000
`)
		return
	}

	mintABI, err := abi.JSON(strings.NewReader(MINT_ABI))
	if err != nil {
		fmt.Println(err)
		return
	}

	mintToAddr := os.Args[1]
	amountStr := os.Args[2]
	amount, err := strconv.Atoi(amountStr)
	if err != nil {
		fmt.Println(err)
		return
	}

	dataBytes, err := mintABI.Pack(
		"mint",
		common.HexToAddress(mintToAddr),
		new(big.Int).Mul(big.NewInt(int64(amount)), BigE18),
	)

	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Printf("0x%v\n", common.Bytes2Hex(dataBytes))
}
