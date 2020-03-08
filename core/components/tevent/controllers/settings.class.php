<?php

/**
 * The home manager controller for tEvent.
 *
 */
class tEventSettingsManagerController extends modExtraManagerController
{
    /** @var tEvent $tEvent */
    public $tEvent;


    /**
     *
     */
    public function initialize()
    {
        $path = $this->modx->getOption('tevent_core_path', null,
                $this->modx->getOption('core_path') . 'components/tevent/') . 'model/tevent/';
        $this->tEvent = $this->modx->getService('tevent', 'tEvent', $path);
        parent::initialize();
    }


    /**
     * @return array
     */
    public function getLanguageTopics()
    {
        return array('tevent:default');
    }


    /**
     * @return bool
     */
    public function checkPermissions()
    {
        return true;
    }


    /**
     * @return null|string
     */
    public function getPageTitle()
    {
        return $this->modx->lexicon('tevent');
    }


    /**
     * @return void
     */
    public function loadCustomCssJs()
    {
        $this->addCss($this->tEvent->config['cssUrl'] . 'mgr/main.css');
        $this->addCss($this->tEvent->config['cssUrl'] . 'mgr/bootstrap.buttons.css');
        $this->addJavascript($this->tEvent->config['jsUrl'] . 'mgr/tevent.js');
        $this->addJavascript($this->tEvent->config['jsUrl'] . 'mgr/misc/utils.js');
        $this->addJavascript($this->tEvent->config['jsUrl'] . 'mgr/misc/combo.js');
        $this->addJavascript($this->tEvent->config['jsUrl'] . 'mgr/widgets/fields.grid.js');
        $this->addJavascript($this->tEvent->config['jsUrl'] . 'mgr/widgets/fields.windows.js');
        $this->addJavascript($this->tEvent->config['jsUrl'] . 'mgr/widgets/settings.panel.js');
        $this->addJavascript($this->tEvent->config['jsUrl'] . 'mgr/sections/settings.js');

        $this->addHtml('<script type="text/javascript">
        tEvent.config = ' . json_encode($this->tEvent->config) . ';
        tEvent.config.connector_url = "' . $this->tEvent->config['connectorUrl'] . '";
        Ext.onReady(function() {
            MODx.load({ xtype: "tevent-page-settings"});
        });
        </script>
        ');
    }


    /**
     * @return string
     */
    public function getTemplateFile()
    {
        return $this->tEvent->config['templatesPath'] . 'home.tpl';
    }
}