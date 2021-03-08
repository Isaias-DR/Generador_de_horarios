let columns_name, columns_name_selected;
let distinctWorkingDay, distinctCourse, distinctSemester, distinctSubjets;
let filterSubjets, selectionSubjets;
let filterSection, selectionSection;
let filterSchedule, selectionSchedule;
var stringWorkingDay, stringCourse, stringNivel, stringSubjets;
var XL_row_object, json_object, json_object_parse, json_object_parse2, workbook;
var age, datesNew, datesOld;
const dates = {
	Jornada: [],
	Carrera: [],
	Nivel: [],
	Asignatura: [],
	Sección: [],
	horaInicio: [],
	horaFin: [],
	día: []
};

function handleFileSelect(evt) {

	var files = evt.target.files; // Lista de objetos de archivos
	var xl2json = new ExcelToJSON()
	xl2json.parseExcel(files[0])
}

class ExcelToJSON {
	constructor() {
		this.parseExcel = function (file) {

			var reader = new FileReader()

			reader.onload = function (e) {

				var data = e.target.result
				workbook = XLSX.read(data, { type: 'binary' })

				// Recorrer las hojas del Excel
				document.getElementById("div_leaves").innerHTML = ""
				document.getElementById("div_leaves").innerHTML +=
					"<h6>2 - Seleccione la hoja que contenga los datos para la toma de ramos, ejemplo: Asignaturas, Horarios o Profesor/a.</h6>"

				workbook.SheetNames.forEach(function (sheetName) {

					document.getElementById("div_leaves").innerHTML +=
						"<div class='form-check'><input class='form-check-input' type='radio' id='leaves' name='leaves' value='"
						+ sheetName + "' onchange='handleChange(event)' >" +
						"<label class='form-check-label' for='" + sheetName + "'>" + sheetName + "</label></div>"
				})
			}

			reader.onerror = function (ex) {

				console.log(ex)
			}

			reader.readAsBinaryString(file)
		}
	}
}

function handleChange(e) {

	// Tomar y guarda todos los datos de esa hoja elegida
	XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[e.currentTarget.value]) // objeto
	json_object = JSON.stringify(XL_row_object) // texto - stringify combierte un objeto o valor a una cadena de texto
	json_object_parse = JSON.parse(json_object) // JSON - analiza una cadena de texto como JSON, transformando opcionalmente  el valor producido por el análisis.

	compararArray()
}

function compararArray() {


	var leave
	var checkboxArray = document.getElementsByName("leaves")
	for (i = 0; i < checkboxArray.length; i++) {
		if (checkboxArray[i].checked == true) {
			leave = i
		}
	}

	// Saber los nombres de las columnas que tiene el arcchivo Excel
	columns_name = Object.getOwnPropertyNames(json_object_parse[leave])

	if (columns_name.includes("Asignatura")) {
		age = 2018
	} else if (columns_name.includes("Asignatura programada")) {
		age = 2017
	}

	if (age == 2018 || age == 2017) {

		document.getElementById("div_filters").innerHTML = ""
		document.getElementById("div_filters").innerHTML +=
			"<div class='row'><h6>3 - Filtros</h6><div class='col-12 col-md-4'><h6>Jornada</h6><div id='div_working_day' class='form-check'></div></div>" +
			"<div class='col-12 col-md-8'><h6>Carrera</h6><div id='div_career' class='form-check'></div></div></div><div class='row'>" +
			"<div class='col-12 col-md-4'><h6>Semenstres</h6><div id='div_semester' class='form-check'></div></div>" +
			"<div class='col-12 col-md-8'><h6>Asignaturas (requerida selección)</h6><div id='div_subjets' class='form-check'></div></div></div>"
		showWorkingDay()
		showCareer()
		showSemester()
		showSubject(1)
	} else {

		alert("Revise los nombre de las columnas con su contenido correspondiente")
	}

	// Sigla programada o Sigla en malla > Sigla

	// Asignatura programada o Asignatura en malla > Asignatura

	// Creditos > X
}

function showWorkingDay() {

	stringWorkingDay = ""
	document.getElementById("div_working_day").innerHTML = "";

	distinctWorkingDay = [...new Set(json_object_parse.map(x => x.Jornada))]

	// Listar jornada (diurno o vespertino)
	for (let m = 0; m < distinctWorkingDay.length; m++) {

		stringWorkingDay = stringWorkingDay + "<option>" + distinctWorkingDay[m] + "</option>"
	}
	document.getElementById("div_working_day").innerHTML +=
		"<select multiple class='form-control' id='working_day' onchange='showSubject(2)'>" + stringWorkingDay + "</select>"
}

function showCareer() {

	distinctCourse = ""
	document.getElementById("div_career").innerHTML = ""

	distinctCourse = [...new Set(json_object_parse.map(x => x.Carrera))]

	// Listar curso
	for (let n = 0; n < distinctCourse.length; n++) {

		stringCourse = stringCourse + "<option>" + distinctCourse[n] + "</option>"
	}
	document.getElementById("div_career").innerHTML +=
		"<select multiple class='form-control' id='career' onchange='showSubject(2)'>" + stringCourse + "</select>"
}

function showSemester() {

	stringNivel = ""
	document.getElementById("div_semester").innerHTML = ""

	distinctSemester = [...new Set(json_object_parse.map(x => x.Nivel))]

	distinctSemester.sort()

	// Listar semestre
	for (let ñ = 0; ñ < distinctSemester.length; ñ++) {

		stringNivel = stringNivel + "<option>" + distinctSemester[ñ] + "</option>"
	}
	document.getElementById("div_semester").innerHTML +=
		"<select multiple class='form-control' id='nivel' onchange='showSubject(2)'>" + stringNivel + "</select>"
}

function showSubject(estado) {

	if (estado == 1) {

		if (age == 2018) {

			distinctSubjets = [...new Set(json_object_parse.map(x => x.Asignatura))]
		} else if (age == 2017) {

			distinctSubjets = [...new Set(json_object_parse.map(x => x.Asignatura_en_malla))]
		}
	} else if (estado == 2) {

		getValues(1)

		if (age == 2018) {

			distinctSubjets = [...new Set(json_object_parse2.map(x => x.Asignatura))]
		} else if (age == 2017) {

			distinctSubjets = [...new Set(json_object_parse2.map(x => x.Asignatura_en_malla))]
		}
	}

	stringSubjets = ""
	document.getElementById("div_subjets").innerHTML = ""

	// Listar asignaturas
	for (let o = 0; o < distinctSubjets.length; o++) {

		stringSubjets = stringSubjets + "<option>" + distinctSubjets[o] + "</option>"
	}
	document.getElementById("div_subjets").innerHTML +=
		"<select multiple class='form-control' id='subjets'>" + stringSubjets +
		"</select><div class='p-2'><button class='btn btn-secondary' onclick='getValues(2)'>Generar Horarios</button></div>"
}

function getValues(estatus) {

	let selectElement1 = document.getElementById('working_day')
	let selectedValues1 = Array.from(selectElement1.selectedOptions).map(option => option.value)

	let selectElement2 = document.getElementById('career')
	let selectedValues2 = Array.from(selectElement2.selectedOptions).map(option => option.value)

	let selectElement3 = document.getElementById('nivel')
	let selectedValues3 = Array.from(selectElement3.selectedOptions).map(option => option.value)

	let selectElement4 = document.getElementById('subjets')
	let selectedValues4 = Array.from(selectElement4.selectedOptions).map(option => option.value)

	dates.Jornada = selectedValues1
	dates.Carrera = selectedValues2
	dates.Nivel = selectedValues3
	dates.Asignatura = selectedValues4

	json_object_parse2 = find_in_object(json_object_parse, dates)

	if (estatus === 2) {

		filterCareer()
	}
}

function find_in_object(my_array, my_criteria) {

	return my_array.filter(function (obj) {
		return Object.keys(my_criteria).every(function (key) {
			return (Array.isArray(my_criteria[key]) && (my_criteria[key].some(function (criteria) {
				return (typeof obj[key] === 'string' && obj[key].indexOf(criteria) !== -1)
			})) || my_criteria[key].length === 0)
		})
	})
}

function clone(obj) {

	if (obj === null || typeof obj !== 'object') {

		return obj
	}

	var temp = obj.constructor();

	for (var key in obj) {

		temp[key] = clone(obj[key])
	}

	return temp
}

function filterCareer() {

	/*
	let asignatura = {
		nombreA = "",
		section = {
			nombreS = "",
			horario = {
				nombreH = "",
				hInicio = "",
				hFin = ""
			}
		}
	}
	*/

	datesNew = clone(dates) // Tambien se puede recorrer selectedValues4

	console.log(datesNew) // Tiene todos las propiedades

	for (let p = 0; p < dates.Asignatura.length; p++) {

		rebuild1()
		rebuild2()

		datesNew.Asignatura = [dates.Asignatura[p]] // Adapta el datesNew solo para esa asignatura con los datos nesesarios para filtrar

		// console.log("Asignatura nro. " + p)
		// console.log(datesNew.Asignatura)

		filterSubjets = find_in_object(json_object_parse2, datesNew) // filtra solo los datos de esa asignatura

		selectionSubjets = [...new Set(filterSubjets.map(x => x.Sección))] // obtiene unicamente las secciones de esa asignatura

		for (let q = 0; q < selectionSubjets.length; q++) {

			rebuild2()

			datesNew.Sección = [selectionSubjets[q]] // Adapta el datesNew solo para esa sección con los datos nesesarios para filtrar

			// console.log("Sección nro. " + q)
			// console.log(datesNew.Sección)

			filterSection = find_in_object(json_object_parse2, datesNew) // filtra solo los datos de esa sección

			selectionSection = Array.from(new Set(filterSection.map(s => s.Horario)))
				.map(Horario => { return { Horario: Horario, Día: filterSection.find(s => s.Horario === Horario).Día } })
			// obtiene unicamente los horarios y su correspondiente dia de esa sección

			for (let r = 0; r < selectionSection.length; r++) {

				datesNew.horaInicio = [selectionSection[r].Horario.split(" ")[1]] // Adapta el datesNew solo para ese horario con los datos nesesarios para filtrar
				datesNew.horaFin = [selectionSection[r].Horario.split(" ")[3]]
				datesNew.día = [selectionSection[r].Día]

				// console.log("Horario nro. " + r)
				// console.log(datesNew.horaInicio + " " + datesNew.horaFin + " " + datesNew.día)
				console.log(datesNew)
			}
		}
	}
}

function rebuild1() {

	datesNew.Sección = [] // Reinicio, para que la ultima sección no entorpesca a la asignatura siguiente, estuve harto tiempo buscando la solución
}

function rebuild2() {

	datesNew.horaInicio = []
	datesNew.horaFin = []
	datesNew.día = []
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
	</table>"
	*/
}