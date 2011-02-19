<?php
$contentType = 'text';
$contentHeader = 'text/plain';

$type = $_REQUEST['type'];
$contentOption = (int)($_REQUEST['option']);

switch ($type)
{
	case ('xml'):
		$contentType = 'xml';
		$contentHeader = 'text/xml';
		break;
	case ('json'):
		$contentType = 'json';
		$contentHeader = 'text/plain';
		break;
	case ('text');
	default:
		$contentType = 'text';
		$contentHeader = 'text/plain';
		break;
}

header("Content-Type: $contentHeader");
header("Expire: -1");

switch ($contentOption)
{
	case (2):
		if ($contentType == 'json') {
			?>{ "success" : 1, "totalrows" : 2, "rows" :
				[ { "id" : 8, "User" : "demo", "Pass" : "8e4f82381229e495e7941cf9e40e6980d14a16bf023ccd4c9134e157dfe8f113", "FirstName" : "Demo", "LastName" : "User" },
				 { "id" : 2, "User" : "shadowc", "Pass" : "aa81c8763a7acba868392ad1c96137d3db74a93d7e9e03a15f7438fd8f0ff034", "FirstName" : "Matias", "LastName" : "Jose" } ]
			}
			<?php 
		}
		break;
	
	case (3):	// treeView
		if ($contentType == 'xml') {
			echo "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n";
			?><root success="1">
				<node id="15"><label>Introduccion</label></node>
				<node id="16"><label>Ingresar al Panel de Control</label></node>
				<node id="17"><label>El Panel de Propiedades</label>
					<node id="18"><label>Crear una Propiedad</label></node>
					<node id="19"><label>Editar una Propiedad</label></node>
				</node>
				<node id="20"><label>Subir Imagenes</label></node>
			</root>
			<?php
		}
		else if ($contentType == 'json') {
			?>{ "success" : 1, "nodes" : [
				{ "id" : 15, "label" : "Introduccion" },
				{ "id" : 16, "label" : "Ingresar al Panel de Control" },
				{ "id" : 17, "label" : "El Panel de Propiedades", "nodes" : [
					{ "id" : 18, "label" : "Crear una Propiedad" },
					{ "id" : 19, "label" : "Editar una Propiedad" } ] },
				{ "id" : 20, "label" : "Subir Imagenes" }
			]}
			<?php
		}
		break;
	
	case (0):
	default:
		if ($contentType == 'text')
		{
			?>Some plain text for testing this thing
			<?php
		}
		else if ($contentType == 'xml')
		{
			echo "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n";
			?><root success="1" totalrows="8">
	<row>
		<column name="Id">15</column>
		<column name="parentId">0</column>
		<column name="Title">Introducción</column>
		<column name="Link">Introduccion</column>
		<column name="DateCreated">2007-09-25</column>
	</row>
		<row>
		<column name="Id">16</column>
		<column name="parentId">0</column>
		<column name="Title">Ingresar al Panel de Control</column>
		<column name="Link">Ingresar_al_Panel_de_Control</column>
		<column name="DateCreated">2007-10-01</column>
	</row>
		<row>
		<column name="Id">17</column>
		<column name="parentId">0</column>
		<column name="Title">El Panel de Propiedades</column>
		<column name="Link">El_Panel_de_Propiedades</column>
		<column name="DateCreated">2007-10-01</column>
	</row>
		<row>
		<column name="Id">18</column>
		<column name="parentId">17</column>
		<column name="Title">Crear una Propiedad</column>
		<column name="Link">Crear_una_Propiedad</column>
		<column name="DateCreated">2007-10-01</column>
	</row>
		<row>
		<column name="Id">19</column>
		<column name="parentId">17</column>
		<column name="Title">Editar una Propiedad</column>
		<column name="Link">Editar_una_Propiedad</column>
		<column name="DateCreated">2007-10-01</column>
	</row>
		<row>
		<column name="Id">20</column>
		<column name="parentId">0</column>
		<column name="Title">Subir Imágenes</column>
		<column name="Link">Subir_Imagenes</column>
		<column name="DateCreated">2007-10-02</column>
	</row>
		<row>
		<column name="Id">21</column>
		<column name="parentId">0</column>
		<column name="Title">Introducción</column>
		<column name="Link">Introduccion</column>
		<column name="DateCreated">2008-10-07</column>
	</row>
			</root>
			<?php
		}
		else	// json
		{
			?>{ "success" : 1, "totalrows" : 8, "rows" :
				[ { "Id" : 15, "parentId" : 0, "Title" : "Introduccion", "Link" : "Introduccion", "DateCreated" : "2007-09-25" },
				{ "Id" : 16, "parentId" : 0, "Title" : "Ingresar al Panel de Control", "Link" : "Ingresar_al_Panel_de_Control", "DateCreated" : "2007-10-01" },
				{ "Id" : 17, "parentId" : 0, "Title" : "El Panel de Propiedades", "Link" : "El_Panel_de_Propiedades", "DateCreated" : "2007-10-01" },
				{ "Id" : 18, "parentId" : 17, "Title" : "Crear una Propiedad", "Link" : "Crear_una_propiedad", "DateCreated" : "2007-10-01" },
				{ "Id" : 19, "parentId" : 17, "Title" : "Editar una Propiedad", "Link" : "Editar_una_propiedad", "DateCreated" : "2007-10-01" },
				{ "Id" : 20, "parentId" : 0, "Title" : "Subir Imagenes", "Link" : "Subir_Imagenes", "DateCreated" : "2007-10-02" },
				{ "Id" : 21, "parentId" : 0, "Title" : "Introduccion", "Link" : "introduccion", "DateCreated" : "2008-10-07" } ]
			}
			<?php 
		}
		break;
}
?>