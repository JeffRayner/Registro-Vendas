// E-mails dos responsáveis pela auditoria das vendas realizadas
const destinatario1 = 'adilson.gandrade@sp.senac.br';
const destinatario2 = 'jeff.rfsimoes@sp.senac.br';

// Valores de Display
const entrada = document.querySelector("#entradaValue");
const saida = document.querySelector("#saidaValue");
const total = document.querySelector("#totalValue");

// Formulario de Cadastro
const btnCadastro = document.querySelector("#btnCadastrar");
const descricao = document.querySelector("#descricao");
const valor = document.querySelector("#valor");
const tipoCadastro = document.querySelector("#tipoCadastro");

const tbody = document.querySelector("tbody");

let items;
const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) ?? [];
const setItensBD = () => localStorage.setItem("db_items", JSON.stringify(items));

const itensDeVenda = document.getElementsByName("itensDeVenda");

window.addEventListener('DOMContentLoaded', () => {
	loadItens();
	const modal = new bootstrap.Modal(document.querySelector('#modalTutorial'));
    document.getElementById("destinatarios").innerHTML = destinatario1+'<br>'+destinatario2;
	modal.show();
});

function loadItens() {
	items = getItensBD();
	tbody.innerHTML = "";
	items.forEach((item, index) => {
		listarItems(index, item);
	});
	setDisplayValues();
}

function inserItem(desc, valor, tipo){
	items.push({
		desc: desc,
		valor: Math.abs(valor).toFixed(2),
		tipo: tipo,
	});
}

function deleteItem(index) {
	items.splice(index, 1);
	setItensBD();
	loadItens();
}

function listarItems(index, item) {
	let tr = document.createElement("tr");
	tr.innerHTML = `
    <th scope="row">${index + 1}</th>
    <td>${item.desc}</td>
    <td>R$ ${item.valor}</td>
    <td class="columnAction d-flex flex-row justify-content-around">
		${item.tipo === "Venda"
			? '<i class="bi bi-arrow-up-circle-fill text-success"></i>'
			: '<i class="bi bi-arrow-down-circle-fill text-danger"></i>'
		}
		<button type="button" onclick="deleteItem(${index})" class="btn btn-warning px-1 py-0"><i class="bi bi-trash"></i></button>
    </td>`;
	tbody.appendChild(tr);
}

function setDisplayValues() {
	let totalEntrada = items.filter((item) => item.tipo === "Venda").map((transaction) => Number(transaction.valor));
	let totalSaida = items.filter((item) => item.tipo === "Estorno").map((transaction) => Number(transaction.valor));

	totalEntrada = Math.abs(totalEntrada.reduce((acc, cur) => acc + cur, 0)).toFixed(2);
	totalSaida = Math.abs(totalSaida.reduce((acc, cur) => acc + cur, 0)).toFixed(2);

	let saldoCaixa = (totalEntrada - totalSaida).toFixed(2);

	entrada.innerHTML = totalEntrada;
	saida.innerHTML = totalSaida;
	total.innerHTML = saldoCaixa;
}

btnCadastro.onclick = function () {
	if (descricao.value === "" || valor.value === "") {
		return alert("Preencha o valor da venda!")
	}
	inserItem(descricao.value, valor.value, tipoCadastro.value);
	setItensBD();
	loadItens();
	valor.value = "";
	tipoCadastro.value = "Venda";
}

function criarCSV(data){
	csvRows = [];
	csvRows.push(["ID", "Descricao", "Valor", "Tipo"].join(';'));
	data.forEach((item, index) => {
		csvRows.push([index, item["desc"], item["valor"].toString().replace(".", ","), item["tipo"]].join(';'))
	});
	return csvRows.join('\n')
}

function downloadArquivo(data){
	const blob = new Blob([data], { type: 'text/csv' });
	const url = window.URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.setAttribute('href', url)
	a.setAttribute('download', 'Livro Caixa.csv');
	a.click()
}

function enviarEmail() {
	var mailTo = "mailto:"
        + destinatario1
		+ "?cc=" + destinatario2
		+ "&subject=" + encodeURIComponent("Livro Caixa - Bussiness Day")
		+ "&body=" + encodeURIComponent("Coloque informaçoes da sua turma e produto;serviço");
	window.location.href = mailTo;
}

function fecharLivroCaixa(){
	downloadArquivo(criarCSV(items));
	setTimeout( enviarEmail , 6000);
}

///// Foi utilizada como base para inserir os produtos um código de "To Do List"
function btnItensDeVenda(idItensDeVenda) {
	descricao.value=itensDeVenda[idItensDeVenda].innerText;	
	valor.value = "";
	tipoCadastro.value = "Venda";
}


   /* Metthod for add todo  */
   let addTodo = () => {
		let todoText = document.getElementById('todo-text').value;
		if(todoText != ''){
			setData(todoText); // handler for adding item into local storage
			listTodo(); // handler for showing item from local storage
		}
	}

/* handler for print todo  */
let originallistTodo = () => {
	let html = ``;
	let data = getData(); // handler for getting item from local storage
	if(data){
		html += `<ol>`;
		data.forEach((value,item
		) => {
			html += `<li>${value} &nbsp;&nbsp;&nbsp;<button onclick="removeData(${item})">Remove</button></li>`;
		});
		html += `</ol>`;
	}
	document.getElementById('todo-item').innerHTML = html;
}

/* handler for print todo - ADAPTADO  */
let listTodo = () => {
	let html = ``;
	let data = getData(); // handler for getting item from local storage
	if(data){
		html += `<ol>`;
		data.forEach((value,item
		) => {
			html += `
			<div id="itensVenda" class="task">
<span id="taskname">
<button class="btn btn-success m-2" data-bs-toggle="modal" data-bs-target="#exampleModal" name="itensDeVenda" id="${item}"  onclick="btnItensDeVenda(${item})">
	Registrar Venda de : 
	${value.toUpperCase()} &nbsp;&nbsp;&nbsp;<button onclick="removeData(${item})"  class="btn btn-warning px-1 py-0"><i class="bi bi-trash"></i></button>	
</button>				
</span>
</div>

			`;
		});
		html += `</ol>`;
	}
	document.getElementById('todo-item').innerHTML = html;
}

 /* handler for get todo  */
let getData = (item = null) => {
	/*
	* localStorage.getItem(<itemname>) main method 
	* (predefined method of js) for getting item from localstorage
	*/
	let data = JSON.parse(localStorage.getItem('mytodo')); 
	if(data){

		if(item) {
			if(data.indexOf(item) != -1){
				return data[item];
			}else{
				return false;
			}
		}
		return data;
	}
	return false;
}

listTodo(); // call print handler for showing data into list 

 /* handler for set data/item todo  */
let setData = (item) => {
	if(getData(item) != false) {
		alert("Item já adicionado!");
	}else{
		let data = getData(); // call getdata handler for getting  data from list 
		data = (data != false) ? data : []; 
		data.push(item);
		data = JSON.stringify(data);
		/*
		* localStorage.setItem(<itemname>,<itemvalue>) main method 
		* (predefined method of js) for set item into localstorage
		*/
		localStorage.setItem('mytodo',data);
	}
}

/* handler for remove item from localstorage */
let removeData = (itemId) => {
		let data = getData();
		if(data){
			let newData = data.filter((v,i) => { return i != itemId });
			newData = JSON.stringify(newData);
			localStorage.setItem('mytodo',newData);
			listTodo();
		}else{
			alert("Nenhum registro encontrado!");
		}

} 

