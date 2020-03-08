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

$vals = $hook->getValues();
//$modx->log(modX::LOG_LEVEL_ERROR, 'tEvent'.print_r($allFormFields,true));
$data = array();

//$modx->log(1,"sanitizePatterns ".print_r($modx->sanitizePatterns,1));
//$modx->log(1,"vals ".print_r($vals,1));
$vals = $modx->sanitize($vals, $modx->sanitizePatterns);
//$modx->log(1,"vals sanitize".print_r($vals,1));

foreach($rows as $row){
    if(!empty($row['select_query'])){
        $data[$row['name']] = (int)$vals[$row['name']];
    }else{
        $data[$row['name']] = $vals[$row['name']];
    }
}

$data['sentdate'] = strftime('%Y-%m-%d %H:%M:%S',time());
if($tEvent = $modx->newObject('tEventItem')){
   $tEvent->fromArray($data);
   if(!$tEvent->save()){
        $hook->addError( 'error_message', 'error tEvent save' );
        return false;
   }
}else{
    $hook->addError( 'error_message', 'error new tEvent' );
    return false;
}
return true;