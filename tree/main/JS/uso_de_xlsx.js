let arr_columns_name = ["Seleccione...", "Año", "Período", "Sede", "Escuela", "Carrera", "Plan", "Tipo Plan de Estudios", "Jornada", "Nivel", "Tipo Asignatura", "Sigla", "Asignatura", "Sección unificado", "Sección duplicado", "Créditos", "Horario unificado", "Horario duplicado", "Sala", "Docente", "Día"];
console.log(arr_columns_name.indexOf("Asignatura"));
let columns_name, columns_name_selected, distinctWorkingDay, distinctCourse, distinctSemester, distinctAsignaturas;
var stringWorkingDay;
var XL_row_object, json_object, json_object_parse, workbook, index_name_subjet;


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
						"<div class='form-check'><input class='form-check-input' type='radio' id='hojas' name='hojas' value='" + sheetName + "' onchange='handleChange(event);' >" +
						"<label class='form-check-label' for='" + sheetName + "'>" + sheetName + "</label></div>";
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

	//console.log(json_object_parse);

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
		
		document.getElementById("div_columns_name").innerHTML = document.getElementById("div_columns_name").innerHTML +
			"<p>" + columns_name[l] + "<select name='selectName' id='selectName" + l + "' class='custom-select custom-select-lg mb-3'> " + string_selection + "</select>" + "</p>";
	}

	// Agregar boton
	document.getElementById("div_columns_name").innerHTML = document.getElementById("div_columns_name").innerHTML +
		"<button onclick='getSelected()'>Continuar</button>";
}

function getSelected() {

	// Guardar referencia a las columnas
	columns_name_selected = [];
	for (let ll = 0; ll < columns_name.length; ll++) {

		columns_name_selected.push(document.getElementById("selectName" + ll).value);
	}
	console.log(columns_name_selected);

	showWorkingDay();
}

function showWorkingDay() {

	distinctWorkingDay = [...new Set(json_object_parse.map(x => x.Jornada))];

	// Listar periodo
	document.getElementById("div_working_day").innerHTML = "";
	for (let m = 0; m < distinctWorkingDay.length; m++) {
		
		stringWorkingDay = stringWorkingDay + "<option>" + distinctWorkingDay[m] + "</option>";
	}
	document.getElementById("div_working_day").innerHTML = document.getElementById("div_working_day").innerHTML +
		"<select multiple class='form-control' id='exampleFormControlSelect2'>" + stringWorkingDay + "</select><button onclick='showCareer()'>Continuar</button>";
}

function showCareer() {

	// Saber el index elegido de la carrera
	index_name_subjet = columns_name_selected.includes("5"); // carrera
	console.log("¿Se eligió Carrera? " + index_name_subjet);

	document.getElementById("div_career").innerHTML = "";
	if (index_name_subjet) {

		distinctCourse = [...new Set(json_object_parse.map(x => x.Carrera))];

		// Listar curso
		for (let j = 0; j < distinctCourse.length; j++) {
			
			document.getElementById("div_career").innerHTML = document.getElementById("div_career").innerHTML +
				"<div class='form-check-inline'><label class='form-check-label'><input type='checkbox' class='form-check-input' id='course' value='" + j + "'>" + distinctCourse[j] + "</label></div>";
		}
		document.getElementById("div_career").innerHTML = document.getElementById("div_career").innerHTML +
			"<button onclick='showSemester()'>Continuar</button>";
	}
}

function showSemester() {

	// Saber el index elegido el nivel o semestre 
	index_name_subjet = columns_name_selected.includes("9"); //nivel
	console.log("¿Se eligió Nivel? " + index_name_subjet);

	document.getElementById("div_semester").innerHTML = "";
	if (index_name_subjet) {

		distinctSemester = [...new Set(json_object_parse.map(x => x.Nivel))];

		// Listar semestre
		for (let m = 0; m < distinctSemester.length; m++) {
			
			document.getElementById("div_semester").innerHTML = document.getElementById("div_semester").innerHTML +
				"<div class='form-check-inline'><label class='form-check-label'><input type='checkbox' class='form-check-input' id='semester' value='" + m + "'>" + distinctSemester[m] + "</label></div>";
		}
		document.getElementById("div_semester").innerHTML = document.getElementById("div_semester").innerHTML +
			"<button onclick='showSubject()'>Continuar</button>";
	}
}

function showSubject() {

	// Saber el index elegido de la asignatura
	index_name_subjet = columns_name_selected.includes("12"); // asignatura
	console.log("¿Se eligió Asignatura? " + index_name_subjet);

	document.getElementById("div_subjets").innerHTML = "";
	if (index_name_subjet) {

		distinctAsignaturas = [...new Set(json_object_parse.map(x => x.Asignatura))];
		console.log(distinctAsignaturas);

		// Listar asignaturas
		for (let k = 0; k < distinctAsignaturas.length; k++) {
			
			document.getElementById("div_subjets").innerHTML = document.getElementById("div_subjets").innerHTML +
				"<div class='form-check-inline'><label class='form-check-label'><input type='checkbox' class='form-check-input' id='subjets' value='" + k + "'>" + distinctAsignaturas[k] + "</label></div>";
		}
		document.getElementById("div_subjets").innerHTML = document.getElementById("div_subjets").innerHTML +
			"<button onclick='getValues()'>Continuar</button>";
	}
}

function getValues() {
	var checkedValue = []; 
	divCont = document.getElementById('working_day'); 
	checks  = divCont.getElementsByTagName('input');
	for(var i=0; checks[i]; ++i){
		if(checks[i].checked){
			checkedValue.push(checks[i].value);
		}
	}
	console.log(checkedValue);
	console.log(document.getElementById("working_day").getValues);
	console.log(document.getElementById("course").getValues);
	console.log(document.getElementById("semester").getValues);
	console.log(document.getElementById("subjet").getValues);
}

function filter() {

	let jsonData = [
		{ "sn": "234234234", "pn": "1014143", "mft": "hello world", "sl": "GG07", "vtv": "Yes" },
		{ "sn": "324234234", "pn": "101423131143", "mft": "hello world 1", "sl": "GG08", "vtv": "Yes" }
	]

	let query = {
		mft: [],
		sl: ["GG08", "GG07"],
		vtv: ["Yes"]
	}
	console.log(find_in_object(jsonData, query)); //returns one

	let query2 = {
		sn: ['T234834U', 'T23423423'],
		pn: ['1014114', '21412342'],
		mft: ['Sbasdfa', 'asdfaser'],
		sl: ['BB03', 'SFD04'],
		vtv: ['Yes']
	}
	console.log(find_in_object(jsonData, query2)); //returns none

	function find_in_object(my_array, my_criteria) {
		return my_array.filter(function (obj) {
			return Object.keys(my_criteria).every(function (key) {
				return (Array.isArray(my_criteria[key]) && (my_criteria[key].some(function (criteria) {
					return (typeof obj[key] === 'string' && obj[key].indexOf(criteria) !== -1)
				})) || my_criteria[key].length === 0);
			});
		});
	}
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
