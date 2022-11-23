// variables
const money : HTMLInputElement = document.getElementById('moneyField') as HTMLInputElement;
const btnDeposit : HTMLButtonElement = document.getElementById('deposit') as HTMLButtonElement;
const btnTake : HTMLButtonElement = document.getElementById('take') as HTMLButtonElement;
const btnTransfer : HTMLButtonElement = document.getElementById('transfer') as HTMLButtonElement;
const cpfField : HTMLInputElement = document.getElementById('cpfUser') as HTMLInputElement;
const extract : HTMLUListElement = document.getElementById('extractField') as HTMLUListElement;
const block : HTMLDivElement = document.getElementById('block') as HTMLDivElement;
const balanceUser1 : HTMLParagraphElement = document.getElementById('balanceUser1') as HTMLParagraphElement;
const balanceUser2 : HTMLParagraphElement = document.getElementById('balanceUser2') as HTMLParagraphElement;
const errorMsg : HTMLDivElement = document.getElementById('error') as HTMLDivElement;
const welcome : HTMLHeadElement = document.getElementById('welcome') as HTMLHeadElement;
const extractTotal : HTMLDivElement = document.getElementById('extractTotal') as HTMLDivElement;

// types
type user = {
    name: string,
    html: HTMLDivElement,
    balance: number,
    cpf: string,
    extractArr: Array<number>,
    isActive: boolean,
}

// objects
const user1 : user = {
    name: 'Usuário 1',
    html: document.getElementById('user1') as HTMLDivElement,
    balance: 0,
    cpf: '13859995006',
    extractArr: [],
    isActive: false,
}

const user2 : user = {
    name: 'Usuário 2',
    html: document.getElementById('user2') as HTMLDivElement,
    balance: 0,
    cpf: '15933812048',
    extractArr: [],
    isActive: false,
}

// functions
function deposit(money : number, user : user) {
    user.balance = user.balance + money
    refreshHtmlState()
    if(user1.isActive) {
        user1.extractArr.push(money)
        showExtract1()
    } if(user2.isActive) {
        user2.extractArr.push(money)
        showExtract2()
    }
}

function withdraw(money : number, user : user) {
    if(money <= user.balance) {
        user.balance = user.balance - money
        refreshHtmlState()
        if(user1.isActive) {
            user1.extractArr.push(-money)
            showExtract1()
        } if(user2.isActive) {
            user2.extractArr.push(-money)
            showExtract2()
        }
    } else {
        errorMsg.innerText = `Você não possui o valor para saque!`
    }
}

function transfer(
    money : number,
    sender : user,
    receiver : user,
    cpfInput : string
) {
    if(cpfInput == receiver.cpf) {
        if(money <= sender.balance) {
            sender.balance = sender.balance - money
            receiver.balance = receiver.balance + money
            refreshHtmlState()
            if(user1.isActive) {
                user1.extractArr.push(-money)
                user2.extractArr.push(money)
                showExtract1()
            } if(user2.isActive) {
                user2.extractArr.push(-money)
                user1.extractArr.push(money)
                showExtract2()
            }
        } else {
            errorMsg.innerText = `Você não possui o valor para transferência!`
        }
    } else {
        errorMsg.innerText = `CPF inválido!`
    }
}

function refreshHtmlState() {
    balanceUser1.innerText = `R$ ${user1.balance}`;
    balanceUser2.innerText = `R$ ${user2.balance}`;
    errorMsg.innerText = '';
    money.value = '';
    cpfField.value = '';
    extract.innerHTML = '';
}

function showExtract1() {
    for(let i = 0; i < user1.extractArr.length; i++) {
        const valueExt : HTMLLIElement = document.createElement('li') as HTMLLIElement;
        valueExt.innerText = `R$ ${String(user1.extractArr[i])}`;
        extract.appendChild(valueExt)
        if(user1.extractArr[i] < 0) {
            valueExt.style.color = 'red'
        }
    }
}

function showExtract2() {
    for(let i = 0; i < user2.extractArr.length; i++) {
        const valueExt : HTMLLIElement = document.createElement('li') as HTMLLIElement;
        valueExt.innerText = `R$ ${String(user2.extractArr[i])}`;
        extract.appendChild(valueExt)
        if(user2.extractArr[i] < 0) {
            valueExt.style.color = 'red'
        }
    }
}

// events
user1.html.addEventListener('click', () => {
    block.style.display = 'none';
    refreshHtmlState()
    showExtract1()
    user1.isActive = true;
    user2.isActive = false;
    if(user1.isActive) {
        user1.html.classList.add('active');
        user2.html.classList.remove('active');
        welcome.innerText = `Olá, ${user1.name}`
    }
})

user2.html.addEventListener('click', () => {
    block.style.display = 'none';
    refreshHtmlState()
    showExtract2()
    user2.isActive = true;
    user1.isActive = false;
    if(user2.isActive) {
        user2.html.classList.add('active');
        user1.html.classList.remove('active');
        welcome.innerText = `Olá, ${user2.name}`
    }
})

btnDeposit.addEventListener('click', () => {
    if(user1.isActive) {
        deposit(+money.value, user1)
        
    } if(user2.isActive) {
        deposit(+money.value, user2)
    }

})

btnTake.addEventListener('click', () => {
    if(user1.isActive) {
        withdraw(+money.value, user1)
    } if(user2.isActive) {
        withdraw(+money.value, user2)
    }
})

btnTransfer.addEventListener('click', () => {
    if(user1.isActive) {
        transfer(+money.value, user1, user2, cpfField.value)
    } if(user2.isActive) {
        transfer(+money.value, user2, user1, cpfField.value)
    }
})