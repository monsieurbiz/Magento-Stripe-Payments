var district=district||{};district.stripeCc=function($){var self={},$inputs={};return self.init=function(enabledCards){$("#payment_form_stripe").append('<input id="stripe_cc_owner" type="hidden" value="" />').append('<input id="stripe_cc_expiration_month" type="hidden" value="" />').append('<input id="stripe_cc_expiration_year" type="hidden" value="" />'),$inputs.cardNumber=$("#stripe_cc_number"),$inputs.cardExpiry=$("#stripe_cc_exp"),$inputs.cardCVC=$("#stripe_cc_cvc"),$inputs.cardExpMonth=$("#stripe_cc_expiration_month"),$inputs.cardExpYear=$("#stripe_cc_expiration_year"),$inputs.cardNumber.payment("formatCardNumber"),$inputs.cardExpiry.payment("formatCardExpiry"),$inputs.cardCVC.payment("formatCardCVC"),$inputs.cardExpiry.blur(function(){var expiry=$(this).val().split(" / ");$inputs.cardExpMonth.val(expiry[0]),$inputs.cardExpYear.val(expiry[1])}),$("#stripe-saved-card").change(function(){""===$(this).val()?($("#stripe-cards-select-new").show(),$inputs.cardNumber.focus()):$("#stripe-cards-select-new").hide()})},self}(district.$);