const { sign } = require('crypto');
const { SHA256 } = require('crypto-js');

const EC=require('elliptic').ec,ec=new EC('secp256k1');

class Transaction{
    constructor(from,to,amount) {
        this.from=from;
        this.to=to;
        this.amount=amount;
        this.transactions=[];
        this.reward=297;
    }

    addtransaction(transaction){
        this.transactions.push(transaction);
    }

    mineTransactions()
    {
        this.addblock(new Block(Date.now().toString(),[new Transaction(CREATE_REWARD_ADDRESS,rewardAddress,this.reward),...this.transactions]));
        this.transactions=[];
    }
}

const keypair=ec.genKeyPair();
//public key=keypair.getPublic("hex")
//private key=keypair.getPrivate("hex")

sign(keypair)
{
    //check if public key matches the from  address of the transaction
    if(keypair.getPublic("hex")===this.from)
    {
        //sign the transaction
        this.signature=keypair.sign(SHA256(this.from,this.to,this.amount),"base64").toDER("hex");
    }
}