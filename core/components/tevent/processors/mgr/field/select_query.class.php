<?php

class tEventSelectQueryProcessor extends modProcessor
{
    public $objectType = 'tEventField';
    public $classKey = 'tEventField';
    public $languageTopics = array('tevent:default');
    //public $permission = 'view';


    /**
     * We doing special check of permission
     * because of our objects is not an instances of modAccessibleObject
     *
     * @return mixed
     */
    public function process()
    {
        $pdoFetch = $this->modx->getService('pdoFetch');
		$pdoFetch->setConfig([
			'select'=>'id,pagetitle as title',
			'return'=>'data',
			
		]);
		$pdoFetch->addTime('pdoTools loaded');
		$name = $this->getProperty('name');
		//$this->modx->log(1,"tEventSelectQueryProcessor name $name ");
		$prop = $this->getProperties();
		//$this->modx->log(1,"tEventSelectQueryProcessor prop  ".print_r($prop,1));
		//$this->modx->log(1,"tEventSelectQueryProcessor error  ".$this->modx->error($this->modx->lexicon('tevent_item_err_name')));
		
		if(empty($name)) {
            return $this->modx->lexicon('tevent_item_err_name');
        }
		if(!$field = $this->modx->getObject('tEventField',['name'=>$name])){
			return $this->modx->lexicon('tevent_item_err_name');
		}
		if(empty($field->select_query)){
			return $this->modx->lexicon('tevent_item_err_select_query');
		}
		
		$default = json_decode($field->select_query, true);
		//$this->modx->log(1,"tEventSelectQueryProcessor select_query {$field->select_query} ".print_r($default,1));
		if(!is_array($default)){
			return $this->modx->lexicon('tevent_item_err_json');
		}
		
		$pdoFetch->config = array_merge($pdoFetch->config, $default);
		//$this->modx->log(1,"tEventSelectQueryProcessor config ".print_r($pdoFetch->config,1));
		$rows = $pdoFetch->run();
		
		return $this->outputArray($rows,count($rows));
    }
}

return 'tEventSelectQueryProcessor';