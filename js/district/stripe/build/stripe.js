var district=district||{};district.stripeCc=function($){var mageValidateParent,self={},$errorMsg=$("#stripe-error-messages"),$inputs={},address={},cardsMap={AE:"amex",DI:"discover",DC:"dinersclub",JCB:"jcb",MC:"mastercard",VI:"visa"},allowedCards=[],tokenValues={cardNumber:"",cardExpiry:"",cardCVC:""};return self.init=function(enabledCards){self.setupEnabledCards(enabledCards),$inputs.cardNumber=$("input#stripe_cc_number"),$inputs.cardExpiry=$("input#stripe_cc_exp"),$inputs.cardCVC=$("input#stripe_cc_cvc"),$inputs.cardToken=$("input#stripe_token"),$inputs.savedCard=$("select#stripe-saved-card"),$inputs.continueBtn=$("#payment-buttons-container button:first"),$inputs.cardNumber.payment("formatCardNumber"),$inputs.cardExpiry.payment("formatCardExpiry"),$inputs.cardCVC.payment("formatCardCVC"),$.fn.toggleInputError=function(valid){return this.parent().toggleClass("has-error",!valid),this},$inputs.savedCard.length||self.disableContinueBtn(!0),$inputs.savedCard.change(function(){""===$(this).val()?($("#stripe-cards-select-new").show(),$inputs.cardNumber.focus(),self.disableContinueBtn(!0)):($("#stripe-cards-select-new").hide(),self.disableContinueBtn(!1))}),self.cardValidationListener(),"undefined"!=typeof Payment?("undefined"!=typeof billing&&self.getBillingAddressFrontend(),$("body").on("keyup","input#stripe_cc_number, input#stripe_cc_exp, input#stripe_cc_cvc",function(){self.disableContinueBtn(!0),self.delay(self.cardEntryListener,750)}),Payment.prototype.save=Payment.prototype.save.wrap(self.paymentSave)):"undefined"!=typeof AdminOrder&&(AdminOrder.prototype.getPaymentData=AdminOrder.prototype.getPaymentData.wrap(self.paymentDataChange))},self.delay=function(){var timer=0;return function(callback,ms){clearTimeout(timer),timer=setTimeout(callback,ms)}}(),self.cardEntryListener=function(){self.validCard()&&($("#payment_form_stripe_cc .has-error").removeClass("has-error"),self.newTokenRequired()?self.createToken():self.disableContinueBtn(!1))},self.cardValidationListener=function(){$("body").on("blur","input#stripe_cc_number",function(){$(this).toggleInputError(self.validateCardNumber())}),$("body").on("blur","input#stripe_cc_exp",function(){$(this).toggleInputError(self.validateCardExpiry())}),$("body").on("blur","input#stripe_cc_cvc",function(){$(this).toggleInputError(self.validateCardCVC())})},self.disableContinueBtn=function(state){$inputs.continueBtn.prop("disabled",state).toggleClass("disabled",state)},self.validCard=function(){return self.validateCardNumber()&&self.validateCardExpiry()&&self.validateCardCVC()?!0:!1},self.validateCardNumber=function(){var cardNumber=$.trim($inputs.cardNumber.val()),valid=!1;return""!==cardNumber&&cardNumber.replace(/ /g,"").length>12&&(valid=$.payment.validateCardNumber(cardNumber)),valid},self.validateCardExpiry=function(){var cardExpiry=$.trim($inputs.cardExpiry.val()),valid=!1;return""!==cardExpiry&&cardExpiry.length>6&&(valid=$.payment.validateCardExpiry($.payment.cardExpiryVal(cardExpiry))),valid},self.validateCardCVC=function(){var cardCVC=$.trim($inputs.cardCVC.val()),valid=!1;return""!==cardCVC&&cardCVC.length>2&&(valid=$.payment.validateCardCVC(cardCVC,$.payment.cardType($inputs.cardNumber.val()))),valid},self.newTokenRequired=function(){return $.trim($inputs.cardNumber.val())!==tokenValues.cardNumber||$.trim($inputs.cardExpiry.val())!==tokenValues.cardExpiry||$.trim($inputs.cardCVC.val())!==tokenValues.cardCVC?!0:!1},self.setupEnabledCards=function(enabledCards){var enabledCardsArr=enabledCards.split(",");$.each(cardsMap,function(mageKey,stripeKey){$.inArray(mageKey,enabledCardsArr)>-1&&allowedCards.push(stripeKey)})},self.paymentDataChange=function(getPaymentData){self.cardEntryListener(),self.getBillingAddressAdmin(),getPaymentData()},self.getBillingAddressFrontend=function(){var $billingAddress=$("#billing-address-select");$billingAddress.length&&""!=$billingAddress.val()?$.ajax({url:billing.addressUrl+$billingAddress.val()}).done(function(data){address.line1=data.street1,address.zip=data.postcode,address.country=data.country_id,address.name=data.firstname+" "+data.lastname}):(address.line1=$("#billing\\:street1").val(),address.zip=$("#billing\\:postcode").val(),address.country=$("#billing\\:country_id").val(),address.name=$("billing\\:firstname").val()+" "+$("billing\\:lastname").val())},self.getBillingAddressAdmin=function(){address.line1=$("#order-billing_address_street0").val(),address.zip=$("#order-billing_address_postcode").val(),address.country=$("#order-billing_address_country_id").val(),address.name=$("#order-billing_address_firstname").val()+" "+$("#order-billing_address_lastname").val()},self.paymentSave=function(validateParent){if(mageValidateParent=validateParent,$inputs.savedCard.length&&""!==$inputs.savedCard.val())mageValidateParent();else{if(!self.validCard())return!1;var cardType=$.payment.cardType($inputs.cardNumber.val());if($.inArray(cardType,allowedCards)<0)return window.alert(Translator.translate("Sorry, "+cardType+" is not currently accepted. Please use a different card.").stripTags()),!1;mageValidateParent()}},self.createToken=function(){Stripe.card.createToken({number:$inputs.cardNumber.val(),exp:$inputs.cardExpiry.val(),cvc:$inputs.cardCVC.val(),address_country:address.country,address_line1:address.line1,address_zip:address.zip,name:address.name},self.stripeResponseHandler)},self.stripeResponseHandler=function(status,response){response.error?$errorMsg.html(response.error.message):(tokenValues.cardNumber=$.trim($inputs.cardNumber.val()),tokenValues.cardExpiry=$.trim($inputs.cardExpiry.val()),tokenValues.cardCVC=$.trim($inputs.cardCVC.val()),$inputs.cardToken.val(response.id)),self.disableContinueBtn(!1)},self}(window.district.$||window.jQuery);