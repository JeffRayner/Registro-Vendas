window.addEventListener('DOMContentLoaded', () => {
	const modal = new bootstrap.Modal(document.querySelector('#modalTutorial'));
	modal.show();
});

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

loadItens();


function loadItens() {
	items = getItensBD();
	tbody.innerHTML = "";
	items.forEach((item, index) => {
		insertItem(index, item);
	});
	setDisplayValues();
}


function deleteItem(index) {
	items.splice(index, 1);
	setItensBD();
	loadItens();
}


function insertItem(index, item) {
	let tr = document.createElement("tr");
	tr.innerHTML = `
    <th scope="row">${index + 1}</th>
    <td>${item.desc}</td>
    <td>R$ ${item.amount}</td>
    <td class="columnAction d-flex flex-row justify-content-around">
		${item.type === "Venda"
			? '<i class="bi bi-arrow-up-circle-fill text-success"></i>'
			: '<i class="bi bi-arrow-down-circle-fill text-danger"></i>'
		}
		<button type="button" onclick="deleteItem(${index})" class="btn btn-warning px-1 py-0"><i class="bi bi-trash"></i></button>
    </td>`;
	tbody.appendChild(tr);
}


function setDisplayValues() {
	let totalEntrada = items.filter((item) => item.type === "Venda").map((transaction) => Number(transaction.amount));
	let totalSaida = items.filter((item) => item.type === "Estorno").map((transaction) => Number(transaction.amount));

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

	items.push({
		desc: descricao.value,
		amount: Math.abs(valor.value).toFixed(2),
		type: tipoCadastro.value,
	});

	setItensBD();
	loadItens();
	valor.value = "";
	tipoCadastro.value = "Venda";
}


const csvmaker = function (data) {
	csvRows = [];
	const headers = ["ID", "Descricao", "Valor", "Tipo"];
	csvRows.push(headers.join(';'));
	data.forEach((item, index) => {
		csvRows.push([index, item["desc"], item["amount"], item["type"]].join(';'))
	});
	return csvRows.join('\n')
}


const download = function (data) {
	const blob = new Blob([data], { type: 'text/csv' });
	const url = window.URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.setAttribute('href', url)
	a.setAttribute('download', 'Livro Caixa.csv');
	a.click()
}


function sendMail() {
	download(csvmaker(items));
	var mailTo = "mailto:adilson.gandrade@sp.senac.br"
		+ "?cc=jeff.rfsimoes@sp.senac.br"
		+ "&subject=" + encodeURIComponent("Livro Caixa - Bussiness Day")
		+ "&body=" + encodeURIComponent("Exemplo de Texto no corpo do E-mail");
	window.location.href = mailTo;
	
}

