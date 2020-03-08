{set $my_fields = '!tEvent_getFields' | snippet}

{'!AjaxForm' | snippet : [
   'snippet'=>'FormIt',
   'form'=>'tpl.tEvent.AjaxForm',
   'hooks'=>'spam,tEvent_fi_hook,email,FormItAutoResponder',
   'emailSubject'=>'Регистрация на мероприятие',
   'emailFromName'=>'[[+family]] [[+firstname]]',
   'emailTo'=>'info@exemple.ru',
   'emailTpl'=>'tpl.tEvent.message',
   'fiarTpl'=>'tpl.tEvent.message.user',
   'fiarSubject'=>'Вы зарегистрировались на мероприятие на сайте "[[++site_name]]"',
   'fiarFrom'=>'info@exemple.ru',
   'validate'=>$my_fields.validate,
   'validationErrorMessage'=>'В форме содержатся ошибки!',
   'successMessage'=>'Вы успешно зарегистрировались! 
На Вашу почту отправлено письмо с регистрационными данными.',
]}