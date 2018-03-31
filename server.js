var http = require('http'); //recurso do nod
var fs = require('fs'); //recurso para poder ler os arquivos



var server = http.createServer(function(request, response) {
	var page, objSales, objCatalog, objPurchases, valueSalesCatalog, valdateCatalog, valPurchases;
	
	page = 'index.html';
	
	if (request.url != '/') {

		objSales = JSON.parse(fs.readFileSync('public/sales.json', 'utf8'));
		objCatalog = JSON.parse(fs.readFileSync('public/catalog.json', 'utf8'));
		objPurchases = JSON.parse(fs.readFileSync('public/purchases.json', 'utf8'));

		valueSalesCatalog = salesCatalog(objSales, objCatalog);

		valdateCatalog = formatDataCatalog(valueSalesCatalog); //formato das vendas do catalog
		valPurchases = valPurchasesDate(objPurchases); //formato das compras do catalogo 


		console.log(valPurchases);
		// É preciso considerar que a data de fechamento do cartão de crédito é no dia 5 de cada mês.
		// Porém, a parcela em si cai apenas no dia 10. Logo, se uma compra ou pagamento foi feito dia 2017-09-05 em diante, 
		//a primeira parcela cairá no dia 2017-10-10. Já se tivesse sido no dia 2017-09-04, cairia em 2017-09-10.
		//	Se o método de pagamento for débito, cairá no mesmo instante descrito na coluna timestamp.
		var submit = "https://ikd29r1hsl.execute-api.us-west-1.amazonaws.com/prod/contaazul/grade"

		var valuesubmit = {
	        "token": "2dbc7f45b9a3bf1a3c5bbd49017fe51f07a5d2a2",
	        "email": "samael.simoes@gmail.com",
	        "answer": valdateCatalog
	    }
	}
	fs.readFile('./public/' + page, function(err, data) {
		var headStatus = 200;
	
		if (err) {
			headStatus = 404;
			page = fs.readFileSync('./error/404.html');
		}

		response.writeHead(headStatus, {'Content-type': 'text/html; charset=utf-8'});
		response.write(data);
		response.end();
	})
});

function salesCatalog(objSales, objCatalog) {
	var salesCatalog = [];

	objSales.map( function(sale) { //varrendo as vendas 
		sale.catalog = objCatalog.filter(function(catalog) { //após varrer vou pegar o produto	

			return sale.product_id === catalog.id.toString();
		});
		salesCatalog.push(sale);
	});

	return salesCatalog;
};

function formatDataCatalog(valdateCatalog){ 

	var result = valdateCatalog.map( function(item) {
		var day, month, years, valueSale, type, data;

		date = new Date(item.timestamp);
		day = date.getDate(); 
		month = date.getMonth() + 1;
		year = date.getFullYear();

		if(item.catalog[0] != "" && item.catalog[0] != undefined) {	
			valueSale = item.catalog[0].price;
			data = { date: year + "-" + month + "-" + day, value: valueSale, type: item.payment_method };
		}

		return data;
	});

	return result;
};

function valPurchasesDate(data){
	var result = data.map( function(item) {
		var day, month, years, valueSale, type, data;

		date = new Date(item.timestamp);
		day = date.getDate(); 
		month = date.getMonth() + 1;
		year = date.getFullYear();

		if(item.price != "" && item.price != undefined) {	
			valueSale = item.price;
			data = { date: year + "-" + month + "-" + day, value: valueSale, type: item.payment_method };
		}
		return data;
	});

	return result;
}

server.listen(3000);

/* 1º
	criar o metodo que retorna o produto pelo id e retorna ok
	nesse metodo criar um for para pegar o produto ok
	vou ter q varrer todas as vendas, e pra cada uma pegar o produto,
		preço,     
		calcular o total pela quantidade
	e após separar por datas
   2º

	criar um objeto vazio
	E para cada compra pegar o mes e adicionar nesse objeto pelo mes e somando os valores.

	fechamento do cartão de crédito é no dia 5 de cada mes
		- Parceka cai no dia 10 de cada mes
			exemplo comprei uma bola dia dia 05/10/2018 o pagamento ira cair			dia 10/11/2018.
			se a compra tivesse sido feita dia 04/10/2018 o pagamento iria cair 			dia 10/10
	validar se foi débito ou crédito
	crédito cai o pagamento no mesmo dia

*/