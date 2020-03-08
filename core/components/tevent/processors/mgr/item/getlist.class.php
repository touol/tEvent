<?php

class tEventItemGetListProcessor extends modObjectGetListProcessor
{
    public $objectType = 'tEventItem';
    public $classKey = 'tEventItem';
    public $defaultSortField = 'id';
    public $defaultSortDirection = 'DESC';
    //public $permission = 'list';


    /**
     * We do a special check of permissions
     * because our objects is not an instances of modAccessibleObject
     *
     * @return boolean|string
     */
    public function beforeQuery()
    {
        if (!$this->checkPermissions()) {
            return $this->modx->lexicon('access_denied');
        }

        return true;
    }


    /**
     * @param xPDOQuery $c
     *
     * @return xPDOQuery
     */
    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $Columns = $this->modx->getSelectColumns($this->classKey, $this->classKey, '', array(), true);
		$c->select($Columns);
		$my_fields = $this->modx->getIterator('tEventField',['filter'=>1,'active'=>1]);
		$where = [];
		foreach($my_fields as $field){
			switch($field->dbtype){
				case 'datetime':
					$query = trim($this->getProperty($field->name . "-from"));
					if($query) $where[$this->classKey.".".$field->name.":>="] = strftime('%Y-%m-%d %H:%M:%S',strtotime($query));
					$query = trim($this->getProperty($field->name . "-to"));
					if($query) $where[$this->classKey.".".$field->name.":<="] = strftime('%Y-%m-%d %H:%M:%S',strtotime($query));
				break;
				case 'int':
					$query = trim($this->getProperty($field->name));
					if($query) $where[$this->classKey.".".$field->name.":IN"] = explode(",", $query);;
					$query = trim($this->getProperty($field->name . "-to"));
					if($query) $where[$this->classKey.".".$field->name.":<="] = strftime('%Y-%m-%d %H:%M:%S',strtotime($query));
				break;
				default:
					$query = trim($this->getProperty($field->name));
					if($query) $where[$this->classKey.".".$field->name.":LIKE"] = "%{$query}%";
			}
			if($field->select_query){
				$c->leftJoin('modResource','modResource_'.$field->name, '`'.$this->classKey.'`.`'.$field->name.'` = `modResource_'.$field->name.'`.`id`');
				$c->select(["modResource_{$field->name}.pagetitle as {$field->name}_title"]);
			}
		}
		
		if (!empty($where)) {
			$c->where($where);
		}
		//$c->prepare(); $this->modx->log(1,"tEventItemGetListProcessor ".$c->toSQL());
        return $c;
    }


    /**
     * @param xPDOObject $object
     *
     * @return array
     */
    public function prepareRow(xPDOObject $object)
    {
        $array = $object->toArray();
        $array['actions'] = array();

        // Edit
        $array['actions'][] = array(
            'cls' => '',
            'icon' => 'icon icon-edit',
            'title' => $this->modx->lexicon('tevent_item_update'),
            //'multiple' => $this->modx->lexicon('tevent_items_update'),
            'action' => 'updateItem',
            'button' => true,
            'menu' => true,
        );

        // Remove
        $array['actions'][] = array(
            'cls' => '',
            'icon' => 'icon icon-trash-o action-red',
            'title' => $this->modx->lexicon('tevent_item_remove'),
            'multiple' => $this->modx->lexicon('tevent_items_remove'),
            'action' => 'removeItem',
            'button' => true,
            'menu' => true,
        );

        return $array;
    }

}

return 'tEventItemGetListProcessor';