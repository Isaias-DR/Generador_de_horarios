let arr_columns_name = ["Seleccione...", "Año", "Período", "Sede", "Escuela", "Carrera", "Plan", "Tipo Plan de Estudios", "Jornada", "Tipo Asignatura", "Sigla", "Asignatura", "Sección unificado", "Sección duplicado", "Créditos", "Horario unificado", "Horario duplicado", "Sala", "Docente", "Día"];
let columns_name, columns_name_selected = [];
var XL_row_object, json_object, json_object_parse, workbook, index_name_subjet, distinctAsignaturas;

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
				workbook = XLSX.read(data, { type: 'binary' });

				// Recorrer las hojas del Excel
				workbook.SheetNames.forEach(function (sheetName) {

					// Crear HTML del los radios
					document.getElementById("div_leaves").innerHTML = document.getElementById("div_leaves").innerHTML +
						"<input class='form-check-input' type='radio' id='hojas' name='hojas' value='" + sheetName + "' onchange='handleChange(event);' >" +
						"<label class='form-check-label' for='" + sheetName + "'>" + sheetName + "</label><br>";
				});
			};

			reader.onerror = function (ex) {

				console.log(ex);
			};

			reader.readAsBinaryString(file);
		};
	}
}

function handleChange(e) {

	// Tomar y guarda todos los datos de esa hoja elegida
	XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[e.currentTarget.value]); // objeto
	json_object = JSON.stringify(XL_row_object); // texto - stringify combierte un objeto o valor a una cadena de texto
	json_object_parse = JSON.parse(json_object); // JSON - analiza una cadena de texto como JSON, transformando opcionalmente  el valor producido por el análisis.

	console.log(json_object_parse);


	// Tomar y muestra los nombres de cada nombre de columna
	// Saber los nombres de las columnas
	columns_name = Object.getOwnPropertyNames(json_object_parse[0]);

	var string_selection = "";
	for (let k = 0; k < arr_columns_name.length; k++) {

		var name = arr_columns_name[k];
		string_selection = string_selection + "<option value='" + k + "'>" + name + "</option>";
	}

	// Dibujar
	for (let l = 0; l < columns_name.length; l++) {

		const columnName = columns_name[l];
		document.getElementById("div_columns_name").innerHTML = document.getElementById("div_columns_name").innerHTML +
			"<p>" + columnName + "<select name='selectName' id='selectName" + l + "' class='custom-select custom-select-lg mb-3'>" + string_selection + "</select>" + "</p>";
	}

	// Agregar boton
	document.getElementById("div_columns_name").innerHTML = document.getElementById("div_columns_name").innerHTML +
	"<button onclick='getValues()'>Calcular</button>";
}

function getValues() {

	// Guardar referencia a las columnas
	columns_name_selected = [];
	for (let ll = 0; ll < columns_name.length; ll++) {
		
		columns_name_selected.push(document.getElementById("selectName"+ll).value);
	}
	console.log(columns_name_selected);
	console.log(columns_name);

	showSubject();
}

function showSubject() {

	// Saber el index elegido de la asignatura
	console.log(columns_name_selected.indexOf("11"));
	index_name_subjet = columns_name_selected.indexOf("11");
	// Listar asignaturas
	console.log(columns_name[index_name_subjet]);
	if (index_name_subjet == "11") {
		
		distinctAsignaturas = [...new Set(json_object_parse.map(x => x.Asignatura))];
	}
	console.log(distinctAsignaturas);
	console.log(distinctAsignaturas[2]);
}

function drawTableWhitData() {

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
