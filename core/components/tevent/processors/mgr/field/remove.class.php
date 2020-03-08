<?php

class tEventFieldRemoveProcessor extends modObjectProcessor
{
    public $objectType = 'tEventField';
    public $classKey = 'tEventField';
    public $languageTopics = array('tevent');
    //public $permission = 'remove';


    /**
     * @return array|string
     */
    public function process()
    {
        if (!$this->checkPermissions()) {
            return $this->failure($this->modx->lexicon('access_denied'));
        }

        $ids = $this->modx->fromJSON($this->getProperty('ids'));
        if (empty($ids)) {
            return $this->failure($this->modx->lexicon('tevent_item_err_ns'));
        }

        foreach ($ids as $id) {
            /** @var tEventField $object */
            if (!$object = $this->modx->getObject($this->classKey, $id)) {
                return $this->failure($this->modx->lexicon('tevent_item_err_nf'));
            }

            $object->remove();
        }

        return $this->success();
    }

}

return 'tEventFieldRemoveProcessor';