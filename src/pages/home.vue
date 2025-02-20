<template>
  <div>
    <p>
    <center>
      <TonConnectButton/>
    </center>
    </p>
    <button @click="sendTon">转TON</button>
    <button @click="sendUSDT">转USDT</button>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { toNanoBy } from '@/utils/format'
import {beginCell, toNano, Address, JettonMaster, TonClient4,fromNano} from '@ton/ton'
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { useTonAddress, useTonConnectUI, useTonConnectModal, TonConnectButton} from '@townsquarelabs/ui-vue';
const { tonConnectUI } = useTonConnectUI();
const { open } = useTonConnectModal();
const tonAddress = useTonAddress()

let TON_CLIENT;
onMounted(async ()=>{
  console.log('start');

  const endpoint = await getHttpV4Endpoint({
    network: "mainnet"
  });

  console.log('endPoint', endpoint)

  TON_CLIENT = new TonClient4({
    // endpoint: "https://toncenter.com/api/v2/jsonRPC",
    // endpoint: "https://rpc.ankr.com/http/ton_api_v2",
    endpoint: endpoint,
    timeout: 30000,
  });
})

function connect(){
  open();
}

async function sendTon(){
  console.log('')
  const result = await tonConnectUI.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 60,
    messages: [
      {
        address: "0QAiSfCCJHF0i1Hq0-nsGxJMHWw3HCmjs2vJKWQxvAQN1Mio", // destination address
        amount: "10000" //Toncoin in nanotons
      }
    ]
  })
  console.log('hash ', result)
}

async function sendUSDT(){
  if(!tonConnectUI.connected){
    return;
  }
  console.log('tonAddress', tonAddress.value);
  const jettonMaster = await TON_CLIENT.open(await JettonMaster.create(Address.parse("EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs")))
  const userAddress = Address.parse(tonAddress.value)
  const jettonWallet = await jettonMaster.getWalletAddress(userAddress);
  console.log('jettonWallet ', Address.parse(jettonWallet.toRawString()).toString(true,true,false))
  const toAddr = 'UQCGtCqHanG_EI6qkFcxES2cOSf_bBiYQbZfh7bZIXBgMCLz';
  const body = beginCell()
      .storeUint(0xf8a7ea5, 32)
      .storeUint(0, 64)      // queryId
      .storeCoins(toNanoBy(0.1, 6)) // amount
      .storeAddress(Address.parse(toAddr)) // to address
      .storeAddress(Address.parse(toAddr)) // response address
      .storeBit(0)
      .storeCoins(toNano(0.0000001)) //用于通知的ton，1就够了
      .storeBit(1)  // 0 no payload 1 has payload
      .storeRef(beginCell()
          .storeUint(0, 32) // 0 opcode means we have a comment
          .storeStringTail("1")      // comment
          .endCell())
      .endCell();
  console.log('body:', body);

  let result = await tonConnectUI.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [{
      address: jettonWallet.toRawString(),
      amount: toNano('0.03').toString(),
      payload: body.toBoc().toString("base64"),
    }]
  });
  console.log('tx:', result);
}

</script>
