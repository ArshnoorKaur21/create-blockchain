const SHA256=require('crypto-js/sha256');
const { ec } = require('elliptic');

class Block{
    constructor(timestamp="",data=[])
    {
        this.previousHash='';
        this.timestamp=timestamp;
        this.data=data;
        this.nonce=0;
        this.hash=this.calculateHash();
    }
    calculateHash()
    {
        return (SHA256((this.previousHash+this.timestamp+JSON.stringify(this.data)+this.nonce))).toString();
    }
    mine(difficulty)
    {
        //basically it loops until our hash starts with stting 00000 with length of diifiulty
        while(!this.hash.startsWith(Array(difficulty).join("0")))
        {
            this.nonce++;
            this.hash=this.calculateHashHash();
        }
    }
    getlatestblock()
    {
        return this.chain[this.chain.length-1];
    }
    addblock(block)
    {
        block.prevhash=this.getlatestblock().hash;
        block.hash=block.calculateHash();
        block.mine(this.difficulty);
        this.chain.push(Object.freeze(block))
    }
}

class Blockchain{
    constructor()
    {
        this.difficulty = 1;
        this.chain = [new Block(Date.now().toString())];
    }
    getlatestblock()
    {
        return this.chain[this.chain.length-1];
    }
    addblock(block)
    {
        block.prevhash=this.getlatestblock().hash;
        block.hash=block.calculateHash();
        block.mine(this.difficulty);
        this.chain.push(Object.freeze(block))
    }
    getBalance(address)
    {
        let balance=0;
        this.chain.forEach(block=>{
            block.data.forEach(transaction=>{
                // Because if you are the sender, you are sending money away, so your balance will be decremented.
                if(transaction.from===address)
                {
                    balance-=transaction.amount;
                }
                // Because if you are the reciever, you are recieveing money, so your balance will be incremented.
                if(transaction.to===address)
                {
                    balance+=transaction.amount;
                }
            })
        });
        return balance;
    }
    ischainvalid()
    {
        for(let i=1;i<this.chain.length;i++)
        {
            const currentblock=this.chain[i];
            const previousblock=this.chain[i-1];

            if(currentblock.hash!==currentblock.calculateHash())
            {
                return false;
            }
            if(previousblock.hash!==previousblock.calculateHash())
            {
                return false;
            }
        }
        return true;

    }
}

class Transaction{
    constructor(from,to,amount) {
        this.from=from;
        this.to=to;
        this.amount=amount;
        this.transactions=[];
        this.reward=297;
        //it is a  transaction pool which holds all oending transactions
    }

    //method to create transaction
    addtransaction(transaction){
        this.transactions.push(transaction);
    }

    //now we are creating a transaction that transfers reqard to winner
    //We just basically pass in the pending transactions and then clear the current pending transactions pool.
    mineTransactions()
    {
        // this.addblock(new Block(Date.now().toString(),this.transactions));
        this.addblock(new Block(Date.now().toString(),[new Transaction(CREATE_REWARD_ADDRESS,rewardAddress,this.reward),...this.transactions]));
        this.transactions=[];
    }

    isValid(tx,chain)
    {
        return (
            tx.from && tx.to && tx.amount && chain.getBalance(tx.from)>=tx.amount && ec.keyFromPublic(tx.from,hex).verify(SHA256(tx.from+tx.to+tx.amount+tx.gas),tx.signature)
        );
    }
}