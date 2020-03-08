<?php
$modx->addPackage('tevent', $modx->getOption('core_path') . 'components/tevent/model/');

if(!$pdoFetch = $modx->getService('pdoFetch')){
    return 'error';
}
$pdoFetch->setConfig([
	'class'=>'tEventField',
	'select'=>'*',
	'sortby'=>[
	    'sort'=>'ASC',
	    ],
	'where'=>[
	    'active'=>1,
	    'name:!='=>'sentdate',
	    ],
	 'limit'=>0,
	 'return'=>'data',
]);
$pdoFetch->addTime('pdoTools loaded');
$rows = $pdoFetch->run();

$validate = [];
foreach($rows as &$row){
    if($row['validate'] and $row['name']) $validate[] = $row['name'].":".$row['validate'];
    if(is_array($row['select_query'])){//select_query
        $row['select_query']['select']='id,pagetitle as title';
		$row['select_query']['return']='data';
        $pdoFetch->setConfig($row['select_query']);
        $row['select'] = $pdoFetch->run();
    }
}
$out = [
    'rows'=>$rows,
    'validate'=>implode(",",$validate),
    ];
//echo "<pre>".print_r($rows,1)."</pre>";
return $out;