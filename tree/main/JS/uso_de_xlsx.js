//let json_leaves = [];
let array_disabled = [];
var XL_row_object, json_object, json_object_parse, workbook;

function handleFileSelect(evt) {
	
	var files = evt.target.files; // Lista de objetos de archivos
	var xl2json = new ExcelToJSON();
	xl2json.parseExcel(files[0]);
}

class ExcelToJSON {
	constructor() {
		this.parseExcel = function (file) {

			var reader = new FileReader();

			reader.onload = function (e) {

				var data = e.target.result;
				workbook = XLSX.read( data, { type: 'binary' } );

				// Recorrer las hojas del Excel
				workbook.SheetNames.forEach(function (sheetName) {

					// Guarda los nombres de las hojas
					//json_leaves.push(sheetName);

					// Crear HTML del los radios
					document.getElementById("div_leaves").innerHTML = document.getElementById("div_leaves").innerHTML +
					"<input class='form-check-input' type='radio' id='hojas' name='hojas' value='"+sheetName+"' onchange='handleChange(event);' >" +
					"<label class='form-check-label' for="+sheetName+">"+ sheetName+"</label><br>";
				});

				// Listar las hojas del Excel
				//console.log(json_leaves);
				//jQuery('#hojas').val(json_leaves); // No esta en HTML el elelmento #hojas
			};

			reader.onerror = function (ex) {
				console.log(ex);
			};

			reader.readAsBinaryString(file);
		};
	}
}

function handleChange(e){

	//console.log("Valor elegido " + e.currentTarget.value);	

	/* Tomar y guarda los datos de esa hoja elegida*/
	XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[e.currentTarget.value]); // objeto
	json_object = JSON.stringify(XL_row_object); // texto - stringify combierte un objeto o valor a una cadena de texto
	json_object_parse = JSON.parse(json_object); // JSON - analiza una cadena de texto como JSON, transformando opcionalmente  el valor producido por el análisis.

	/* Listar contenido*/
	console.log(json_object_parse);
	//jQuery('#xlx_json').val(json_object_parse); // El json_object se demora paro cuendo esta adentro del forEach ahi no \(º_º)/

	selectNames();
}

function selectNames(){

	// Saber los nombres de las columnas
	let columns_name = Object.getOwnPropertyNames(json_object_parse[0]);
	//console.log(Object.getOwnPropertyNames(json_object_parse[0]));

	// Dibujar
	for (let k = 0; k < columns_name.length; k++) {
		const columnName = columns_name[k];
		document.getElementById("div_columns_name").innerHTML = document.getElementById("div_columns_name").innerHTML +
		"<p>"+columnName+"</p>";
	}
}

function filter(){

	/* Listar asignaturas
	var distinctAsignaturas = [...new Set(json_object_parse.map(x => x.Asignatura))];
	console.log(distinctAsignaturas);
	console.log(distinctAsignaturas[2]);
	jQuery('#asignaturas').val(distinctAsignaturas);
	*/

}

function drawTableWhitData(){
	/*
	document.getElementById("div_data").innerHTML = document.getElementById("div_data").innerHTML +
	<table class='table table-striped'>
		<caption>Contenido</caption>
		<thead>
			<tr>
				<th scope='col'>#</th>
				<th scope='col'>First</th>
				<th scope='col'>Last</th>
				<th scope='col'>Handle</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<th scope='row'>1</th>
				<td>Mark</td>
				<td>Otto</td>
				<td>@mdo</td>
			</tr>
			<tr>
				<th scope='row'>2</th>
				<td>Jacob</td>
				<td>Thornton</td>
				<td>@fat</td>
			</tr>
			<tr>
				<th scope='row'>3</th>
				<td>Larry</td>
				<td>the Bird</td>
				<td>@twitter</td>
			</tr>
		</tbody>
	</table>";
	*/
}
