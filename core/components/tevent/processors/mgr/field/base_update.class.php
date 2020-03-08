<?php

class tEventBaseUpdateProcessor extends modProcessor
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
        $this->scheme = $this->modx->getOption('core_path') . 'components/tevent/model/schema/tevent.mysql.schema.xml';
		$this->model = $this->modx->getOption('core_path') . 'components/tevent/model/';
		
		$this->updateScheme("tEventItem");
		$this->parseSchema();
		$this->updateBaseTable("tEventItem");
		
		return $this->success("Updated. All error in log!");
    }
	/**
     * Update the model
     */
    protected function parseSchema()
    {
        if (empty($this->scheme)) {
            return;
        }
        /** @var xPDOCacheManager $cache */
        if ($cache = $this->modx->getCacheManager()) {
            $cache->deleteTree(
                $this->model . 'tevent/mysql',
                ['deleteTop' => true, 'skipDirs' => false, 'extensions' => []]
            );
        }

        /** @var xPDOManager $manager */
        $manager = $this->modx->getManager();
        /** @var xPDOGenerator $generator */
        $generator = $manager->getGenerator();
        $generator->parseSchema(
            $this->scheme,
            $this->model
        );
        $this->modx->log(modX::LOG_LEVEL_INFO, 'Model updated');
    }
	
	protected function updateScheme($tableClass = "tEventItem")
    {
		if (is_file($this->scheme)) {
			$schema = new SimpleXMLElement($this->scheme, 0, true);
			$pdoFetch = $this->modx->getService('pdoFetch');
			$pdoFetch->setConfig([
				'class'=>'tEventField',
				'limit'=>0,
				'return'=>'data',
			]);
			$rows = $pdoFetch->run();
			$fields = [];
			foreach($rows as $row){
				$fields[$row['name']] = $row;
			}
			if (isset($schema->object)) {
				$object_pos = false;
				$oi = 0;
				
				foreach ($schema->object as $obj) {
					if((string)$obj['class'] == $tableClass){
						$fi = 0;
						$fields_del_pos = [];
						
						foreach($obj->field as $field){
							if(isset($fields[(string)$field['key']])){
								//update field
								$row = $fields[(string)$field['key']];
								$field['dbtype'] = $row['dbtype'];
								$field['phptype'] = $row['phptype'];
								if($row['precision']){
									$field['precision'] = $row['precision'];
								}else{
									unset($field['precision']);
								}
								switch($row['dbtype']){ //datetime
									case 'datetime':
										$field['null'] = 'true';
										unset($field['default']);
										break;
									case 'text': case 'varchar':
										$field['null'] = 'false';
										$field['default'] = "";
										break;
								}
								unset($fields[(string)$field['key']]);
							}else{
								$fields_del_pos[] = $fi;
							}
							$fi++;
						}
						//remove field
						if(!empty($fields_del_pos)){
							foreach($fields_del_pos as $fpos){
								unset($schema->object[$oi]->field[$fpos]);
							}
						}
						//add field
						foreach($fields as $row){
							$field = $obj->addChild('field');
							$field['key'] = $row['name'];
							$field['dbtype'] = $row['dbtype'];
							$field['phptype'] = $row['phptype'];
							if($row['precision']){
								$field['precision'] = $row['precision'];
							}else{
								//unset($field['precision']);
							}
							switch($row['dbtype']){ //datetime
								case 'datetime':
									$field['null'] = 'true';
									//unset($field['default']);
									break;
								case 'text': case 'varchar':
									$field['null'] = 'false';
									$field['default'] = "";
									break;
							}
						}
					}
					$oi++;
				}
			}
			file_put_contents($this->scheme,$schema->asXML());
			unset($schema);
			$this->modx->log(modX::LOG_LEVEL_INFO, 'scheme updated');
		}
	}
	/**
     * updateBaseTable
     */
    protected function updateBaseTable($tableClass = "tEventItem")
    {
        $manager = $this->modx->getManager();
		$objects = [];
		if (is_file($this->scheme)) {
			$schema = new SimpleXMLElement($this->scheme, 0, true);
			if (isset($schema->object)) {
				foreach ($schema->object as $obj) {
					if((string)$obj['class'] == $tableClass) $objects[] = (string)$obj['class'];
				}
			}
			unset($schema);
		}
		foreach ($objects as $class) {
			$table = $this->modx->getTableName($class);
			$sql = "SHOW TABLES LIKE '" . trim($table, '`') . "'";
			$stmt = $this->modx->prepare($sql);
			$newTable = true;
			if ($stmt->execute() && $stmt->fetchAll()) {
				$newTable = false;
			}
			// If the table is just created
			if ($newTable) {
				$manager->createObjectContainer($class);
			} else {
				// If the table exists
				// 1. Operate with tables
				$tableFields = [];
				$c = $this->modx->prepare("SHOW COLUMNS IN {$this->modx->getTableName($class)}");
				$c->execute();
				while ($cl = $c->fetch(PDO::FETCH_ASSOC)) {
					$tableFields[$cl['Field']] = $cl['Field'];
				}
				foreach ($this->modx->getFields($class) as $field => $v) {
					if (in_array($field, $tableFields)) {
						unset($tableFields[$field]);
						$manager->alterField($class, $field);
					} else {
						$manager->addField($class, $field);
					}
				}
				foreach ($tableFields as $field) {
					$manager->removeField($class, $field);
				}
				// 2. Operate with indexes
				$indexes = [];
				$c = $this->modx->prepare("SHOW INDEX FROM {$this->modx->getTableName($class)}");
				$c->execute();
				while ($row = $c->fetch(PDO::FETCH_ASSOC)) {
					$name = $row['Key_name'];
					if (!isset($indexes[$name])) {
						$indexes[$name] = [$row['Column_name']];
					} else {
						$indexes[$name][] = $row['Column_name'];
					}
				}
				foreach ($indexes as $name => $values) {
					sort($values);
					$indexes[$name] = implode(':', $values);
				}
				$map = $this->modx->getIndexMeta($class);
				// Remove old indexes
				foreach ($indexes as $key => $index) {
					if (!isset($map[$key])) {
						if ($manager->removeIndex($class, $key)) {
							$this->modx->log(modX::LOG_LEVEL_INFO, "Removed index \"{$key}\" of the table \"{$class}\"");
						}
					}
				}
				// Add or alter existing
				foreach ($map as $key => $index) {
					ksort($index['columns']);
					$index = implode(':', array_keys($index['columns']));
					if (!isset($indexes[$key])) {
						if ($manager->addIndex($class, $key)) {
							$this->modx->log(modX::LOG_LEVEL_INFO, "Added index \"{$key}\" in the table \"{$class}\"");
						}
					} else {
						if ($index != $indexes[$key]) {
							if ($manager->removeIndex($class, $key) && $manager->addIndex($class, $key)) {
								$this->modx->log(modX::LOG_LEVEL_INFO,
									"Updated index \"{$key}\" of the table \"{$class}\""
								);
							}
						}
					}
				}
			}
		}
    }
}

return 'tEventBaseUpdateProcessor';