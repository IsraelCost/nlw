//mostra a mensagem dentro do console
//console.log('Hello')
//quando algo mudar na página ele irá retornar a função

//document
//          .querySelector("select[name=uf]")
//          .addEventListener("change", () => {
//              console.log("mudei")
//          })

function populateUFs(){
    const ufSelect = document.querySelector("select[name=uf]") //variável recebe select html
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados") //acesso a api
    .then((res) => { return res.json()})//obtendo resposta 
    .then(states => {//se a conexão acontecer, trocar o valor do id e nome dos options com o innerHTML
        for(let state of states){
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    })
}

populateUFs()


function getCities(event){
    const citiesSelect = document.querySelector("select[name=city]")//variável para receber o seletor uf
    const stateInput = document.querySelector("input[name=state]")//variável para receber um input hidden
    
    //para pegar o valor do select no momento da mudança
    //console.log(event.target.value)

    const indexOfSelectedState = event.target.selectedIndex//pegar o index do estado
    const ufValue = event.target.value//pegar o valor da mudança de evento
    stateInput.value = event.target.options[indexOfSelectedState].text//para pegar o nome do estado de index selecionado pelo usuário
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`//para capturar o index do usuário e através da url mostrar as opções disponíveis

    citiesSelect.innerHTML = "<option value>Selecione a cidade</option>"
    citiesSelect.disabled = true;

    fetch(url)
    .then((res) => { return res.json()})
    .then(cities => {
        for(let city of cities){
            citiesSelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }
        citiesSelect.disabled = false//para habilitar o input ao usuário
    })
}

//obtendo o evento de mudança de estado
document
        .querySelector("select[name=uf]")
          .addEventListener("change", getCities)//adicione a função quando o evento de mudança acontecer


          //itens de coleta
const itemsToCollect = document.querySelectorAll(".items-grid li")
for(const item of itemsToCollect){
    item.addEventListener("click", handleSelectedItem)
}

let selectedItems = []

const collectedItems = document.querySelector("input[name=items]")

function handleSelectedItem(event){
//adicionar ou remover uma classe com javascript

    const itemLi = event.target
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id

    //verificar se existem itens selecionados e pegá-los
    const alreadySelected = selectedItems.findIndex(function(item) {
        const itemFound = item == itemId
        return itemFound
    })
    // a função acima retorna true ou false, e a constante retorna sempre para false = -1, para true = index no array
    //se já estiver selecionado, tirar da seleção
    if(alreadySelected >= 0){
        const filteredItems = selectedItems.filter(item => {
            const itemIsDifferent = item != itemId //retorne true
            return itemIsDifferent
        })
        selectedItems = filteredItems
    }else{
         //se não estiver selecionado, adicionar à seleção
        selectedItems.push(itemId)
    }

    //atualizar o campo hidden com os itens selecionados

    collectedItems.value = selectedItems
}