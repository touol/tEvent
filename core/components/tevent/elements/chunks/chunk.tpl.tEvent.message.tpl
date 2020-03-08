<div>Зарегистрирован новый участник:</div>
<br/>
{set $my_fields = '!tEvent_getFields' | snippet}
{foreach $my_fields.rows as $row}
    <strong>{$row.label}:</strong>
    {if $row.select}
       {foreach $row.select as $option}
	       [[+{$row.name}:is=`{$option.id}`:then=`{$option.title}`]]
	   {/foreach}
    {else}
        [[+{$row.name}]]
    {/if}
    <br/>
{/foreach}