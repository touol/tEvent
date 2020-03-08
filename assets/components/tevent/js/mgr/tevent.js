var tEvent = function (config) {
    config = config || {};
    tEvent.superclass.constructor.call(this, config);
};
Ext.extend(tEvent, Ext.Component, {
    page: {}, window: {}, grid: {}, tree: {}, panel: {}, combo: {}, config: {}, view: {}, utils: {}
});
Ext.reg('tevent', tEvent);

tEvent = new tEvent();