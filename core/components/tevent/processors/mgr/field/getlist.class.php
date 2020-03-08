<?php

class tEventFieldGetListProcessor extends modObjectGetListProcessor
{
    public $objectType = 'tEventField';
    public $classKey = 'tEventField';
    public $defaultSortField = 'sort';
    public $defaultSortDirection = 'ASC';
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
		$where = [];
		$active = trim($this->getProperty('active'));
		if($active){
			$where['active'] = 1;
		}
		$query = trim($this->getProperty('query'));
        if ($query) {
            $where[100] = "(name LIKE '%{$query}%' OR OR:label:LIKE '%{$query}%')";
        }
		if(!empty($where)){
			$c->where($where);
		}
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
        $array['actions'] = [];

        // Edit
        $array['actions'][] = [
            'cls' => '',
            'icon' => 'icon icon-edit',
            'title' => $this->modx->lexicon('tevent_item_update'),
            //'multiple' => $this->modx->lexicon('tevent_items_update'),
            'action' => 'updateItem',
            'button' => true,
            'menu' => true,
        ];

        if (!$array['active']) {
            $array['actions'][] = [
                'cls' => '',
                'icon' => 'icon icon-power-off action-green',
                'title' => $this->modx->lexicon('tevent_item_enable'),
                'multiple' => $this->modx->lexicon('tevent_items_enable'),
                'action' => 'enableItem',
                'button' => true,
                'menu' => true,
            ];
        } else {
            $array['actions'][] = [
                'cls' => '',
                'icon' => 'icon icon-power-off action-gray',
                'title' => $this->modx->lexicon('tevent_item_disable'),
                'multiple' => $this->modx->lexicon('tevent_items_disable'),
                'action' => 'disableItem',
                'button' => true,
                'menu' => true,
            ];
        }

        // Remove
        $array['actions'][] = [
            'cls' => '',
            'icon' => 'icon icon-trash-o action-red',
            'title' => $this->modx->lexicon('tevent_item_remove'),
            'multiple' => $this->modx->lexicon('tevent_items_remove'),
            'action' => 'removeItem',
            'button' => true,
            'menu' => true,
        ];

        return $array;
    }

}

return 'tEventFieldGetListProcessor';