<?php
$contentType = 'text';
$contentHeader = 'text/plain';

$type = $_GET['type'];
$contentOption = (int)($_GET['option']) || 0;

switch ($type)
{
	case ('xml'):
		$contentType = 'xml';
		$contentHeader = 'text/xml';
		break;
	case ('json'):
		$contentType = 'json';
		$contentHeader = 'text/plain';
	case ('text');
	default:
		$contentType = 'text';
		$contentHeader = 'text/plain';
		break;
}

header("Content-Type: $contentHeader");

switch ($contentOption)
{
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
			?><root success="1" msg="bla bla">
				<todo>Add some dataview rows</todo>
			</root>
			<?php
		}
		else	// json
		{
			?>{ 'todo' : 'Add some rows here' }
			<?php 
		}
		break;
}
?>