<form action="" method="post">
	{set $my_fields = '!tEvent_getFields' | snippet}
	{foreach $my_fields.rows as $row}
	    <div class="form-group">
            <label class="control-label" for="af_{$row.name}">{$row.label}</label>
            <div class="controls">
                {if $row.select}
                    <select name="{$row.name}"  class="form-control">
            	        {foreach $row.select as $option}
            	            <option value="{$option.id}" {if $option.id == $.get[$row.name]}selected{/if}>{$option.title}</option>
            	        {/foreach}
        	        </select>
                {else}
                    <input type="text" id="af_{$row.name}" name="{$row.name}" value="[[+fi.{$row.name}]]" placeholder="" class="form-control"/>
                {/if}
                <span class="error_name">[[+fi.error.{$row.name}]]</span>
            </div>
        </div>
	{/foreach}
	
	<div class="form-group row-checkbox2">
		<div class="checkbox"><input type='checkbox' name='agreement' value='1' id="l2" checked="checked" disabled readonly/><label for="l2"></label> </div>
		<div class="checkbox2-text">В соответствии с Федеральным законом от 27.07.2006 №152-ФЗ выражаю согласие на обработку моих персональных данных любым не запрещенным законом способом в целях получения дальнейшего своевременного информирования о проводимых мероприятиях и иной важной информации от ООО «Exemple» и его партнеров.</div>
   	</div>
	<div class="form-group">
        <div class="controls">
            <button type="reset" class="btn btn-default">[[%af_reset]]</button>
            <button type="submit" class="btn btn-primary">[[%af_submit]]</button>
        </div>
    </div>
	
	[[+fi.success:is=`1`:then=`
		<div class="alert alert-success">[[+fi.successMessage]]</div>
	`]]
	[[+fi.validation_error:is=`1`:then=`
		<div class="alert alert-danger">[[+fi.validation_error_message]]</div>
	`]]
</form>