<?php
if (!defined('MODX_API_MODE')) {
    define('MODX_API_MODE', false);
}

include(dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php');
if (!defined('MODX_CORE_PATH')) define('MODX_CORE_PATH', dirname(dirname(dirname(dirname(__FILE__)))) . '/core/');

include_once (MODX_CORE_PATH . "model/modx/modx.class.php");
$modx = new modX();
$modx->initialize('web');
$pkg = 'tevent';
$modelpath = $modx->getOption('core_path') . 'components/tevent/model/';
$modx->addPackage($pkg, $modelpath);
//проверка пользователя
if (!$modx->user->hasSessionContext('mgr')) {
    header('Content-Type: text/html; charset=utf-8');
	echo "Нет доступа!"; exit;
}

	$pdoFetch = $modx->getService('pdoFetch');
	$pdoFetch->setConfig([
		'class'=>'tEventField',
		'limit'=>0,
		'return'=>'data',
		'sortby'=>['sort'=>'ASC'],
	]);
	$fields = $pdoFetch->run();

	$my_fields = $modx->getIterator('tEventField',['filter'=>1,'active'=>1]);
	$c = $modx->newQuery('tEventItem');
	$Columns = $modx->getSelectColumns('tEventItem', 'tEventItem', '', array(), true);
	$c->select($Columns);
	
	$where = [];
	foreach($my_fields as $field){
		switch($field->dbtype){
			case 'datetime':
				$query = trim($_GET[$field->name . "-from"]);
				if($query) $where['tEventItem'.".".$field->name.":>="] = strftime('%Y-%m-%d %H:%M:%S',strtotime($query));
				$query = trim($_GET[$field->name . "-to"]);
				if($query) $where['tEventItem'.".".$field->name.":<="] = strftime('%Y-%m-%d %H:%M:%S',strtotime($query));
			break;
			case 'int':
				$query = trim($_GET[$field->name]);
				if($query) $where['tEventItem'.".".$field->name.":IN"] = explode(",", $query);;
				$query = trim($_GET[$field->name . "-to"]);
				if($query) $where['tEventItem'.".".$field->name.":<="] = strftime('%Y-%m-%d %H:%M:%S',strtotime($query));
			break;
			default:
				$query = trim($_GET[$field->name]);
				if($query) $where['tEventItem'.".".$field->name.":LIKE"] = "%{$query}%";
		}
		if($field->select_query){
			$c->leftJoin('modResource','modResource_'.$field->name, '`'.'tEventItem'.'`.`'.$field->name.'` = `modResource_'.$field->name.'`.`id`');
			$c->select(["modResource_{$field->name}.pagetitle as {$field->name}_title"]);
		}
	}
	$c->where($where);
	$c->sortby('id','DESC');
	
	$records = $modx->getIterator('tEventItem',$c);
	
	$start_str = 2;
	require_once ('PHPExcel/IOFactory.php');
	// Открываем файл
	$xls = PHPExcel_IOFactory::load('otchet_events.xls');
	// Устанавливаем индекс активного листа
	$xls->setActiveSheetIndex(0);
	// Получаем активный лист
	$sheet = $xls->getActiveSheet();
	foreach($fields as $k=>$field){
		$sheet->setCellValueByColumnAndRow($k, 1, $field['label']);
	}
	foreach ($records as $key => $row) {
		$str_num=$start_str+$key;
		foreach($fields as $k=>$field){
			if($field['select_query']){
				$sheet->setCellValueByColumnAndRow($k, $str_num, $row->{$field['name']."_title"});
			}else{
				$sheet->setCellValueByColumnAndRow($k, $str_num, $row->{$field['name']});
			}
		}
	}
	$excel_name = "otchet_events";
	// Выводим HTTP-заголовки
	 header ( "Expires: Mon, 1 Apr 1974 05:00:00 GMT" );
	 header ( "Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT" );
	 header ( "Cache-Control: no-cache, must-revalidate" );
	 header ( "Pragma: no-cache" );
	 header ( "Content-type: application/vnd.ms-excel;charset=utf-8;" );
	 header ( "Content-Disposition: attachment; filename=$excel_name.xls" );

	// Выводим содержимое файла
	 $objWriter = new PHPExcel_Writer_Excel5($xls);
	 $objWriter->save('php://output');
	 echo "<script>window.close;</script>";

?>