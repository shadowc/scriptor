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
	
	case (4):
		if ($contentType == 'xml') {
			echo "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n";
			?>
			<root success="1">
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/A210d.jpg</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/A210d.jpg</path>
					<name>A210d.jpg</name>
					<param name="one">value 1.A210d.jpg</param>
					<param name="two">value 2.A210d.jpg</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/A9c.jpg</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/A9c.jpg</path>
					<name>A9c.jpg</name>
					<param name="one">value 1.A9c.jpg</param>
					<param name="two">value 2.A9c.jpg</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/hp5303.gif</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/hp5303.gif</path>
					<name>hp5303.gif</name>
					<param name="one">value 1.hp5303.gif</param>
					<param name="two">value 2.hp5303.gif</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/A200c.gif</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/A200c.gif</path>
					<name>A200c.gif</name>
					<param name="one">value 1.A200c.gif</param>
					<param name="two">value 2.A200c.gif</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/A200d.gif</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/A200d.gif</path>
					<name>A200d.gif</name>
					<param name="one">value 1.A200d.gif</param>
					<param name="two">value 2.A200d.gif</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/A200e.gif</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/A200e.gif</path>
					<name>A200e.gif</name>
					<param name="one">value 1.A200e.gif</param>
					<param name="two">value 2.A200e.gif</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/A210b.jpg</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/A210b.jpg</path>
					<name>A210b.jpg</name>
					<param name="one">value 1.A210b.jpg</param>
					<param name="two">value 2.A210b.jpg</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/hp530.gif</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/hp530.gif</path>
					<name>hp530.gif</name>
					<param name="one">value 1.hp530.gif</param>
					<param name="two">value 2.hp530.gif</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/A300frente.gif</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/A300frente.gif</path>
					<name>A300frente.gif</name>
					<param name="one">value 1.A300frente.gif</param>
					<param name="two">value 2.A300frente.gif</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/A210c.jpg</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/A210c.jpg</path>
					<name>A210c.jpg</name>
					<param name="one">value 1.A210c.jpg</param>
					<param name="two">value 2.A210c.jpg</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/A9d.jpg</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/A9d.jpg</path>
					<name>A9d.jpg</name>
					<param name="one">value 1.A9d.jpg</param>
					<param name="two">value 2.A9d.jpg</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/A200frente.gif</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/A200frente.gif</path>
					<name>A200frente.gif</name>
					<param name="one">value 1.A200frente.gif</param>
					<param name="two">value 2.A200frente.gif</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/A200b.jpg</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/A200b.jpg</path>
					<name>A200b.jpg</name>
					<param name="one">value 1.A200b.jpg</param>
					<param name="two">value 2.A200b.jpg</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/A9.gif</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/A9.gif</path>
					<name>A9.gif</name>
					<param name="one">value 1.A9.gif</param>
					<param name="two">value 2.A9.gif</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/A9b.jpg</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/A9b.jpg</path>
					<name>A9b.jpg</name>
					<param name="one">value 1.A9b.jpg</param>
					<param name="two">value 2.A9b.jpg</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/A210.gif</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/A210.gif</path>
					<name>A210.gif</name>
					<param name="one">value 1.A210.gif</param>
					<param name="two">value 2.A210.gif</param>
				</image>
					<image>
					<thumbnail>http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/FZsilver.gif</thumbnail>
					<path>http://www.shadowclabs.com.ar/scriptor_gallery/FZsilver.gif</path>
					<name>FZsilver.gif</name>
					<param name="one">value 1.FZsilver.gif</param>
					<param name="two">value 2.FZsilver.gif</param>
				</image>
			</root>
			<?php 
		}
		else if ($contentType == 'json') {
			?>
			{ "success" : 1, "images" : [
				{ "thumbnail" : "http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/A210.gif", "path" : "http://www.shadowclabs.com.ar/scriptor_gallery/A210.gif", "name" : "A210.gif" },
				{ "thumbnail" : "http://www.shadowclabs.com.ar/scriptor_gallery/thumbnails/FZsilver.gif", "path" : "http://www.shadowclabs.com.ar/scriptor_gallery/FZsilver.gif", "name" : "FZsilver.gif" }
			] }
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