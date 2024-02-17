

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



window.addEventListener('DOMContentLoaded', () => {
	loadItens();
	const modal = new bootstrap.Modal(document.querySelector('#modalTutorial'));
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
		return alert("Preencha os Campos!")
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
		csvRows.push([index, item["desc"], item["valor"], item["tipo"]].join(';'))
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
	var mailTo = "mailto:adilson.gandrade@sp.senac.br"
		+ "?cc=jeff.rfsimoes@sp.senac.br"
		+ "&subject=" + encodeURIComponent("Livro Caixa - Bussiness Day")
		+ "&body=" + encodeURIComponent("Coloque informaçoes da sua turma e produto;serviço");
	window.location.href = mailTo;
}

function fecharLivroCaixa(){
	downloadArquivo(criarCSV(items));
	setTimeout( enviarEmail , 6000);
}
