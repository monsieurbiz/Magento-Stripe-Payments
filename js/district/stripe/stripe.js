/**
 * District Commerce
 *
 * @category    District
 * @package     Stripe
 * @author      District Commerce <support@districtcommerce.com>
 * @copyright   Copyright (c) 2016 District Commerce (http://districtcommerce.com)
 * @license     http://store.districtcommerce.com/license
 *
 */

var district = district || {};

district.stripeCc = function ($) {

    var self = {},
        $inputs = {},
        $stripe = {},
        $errorElement = {},
        $card = {
            element: {},
            htmlId: '#stripe-card-element',
        },
        address = {}
    ;

    /**
     * Initialize the module
     *
     * @param stripe
     */
    self.init = function (stripe) {
        $stripe = stripe;

        //Initialize form
        self.initForm();

        //Initialize variables
        self.initVars();

        //Listener for payment method toggle
        self.paymentMethodListener();

        //Toggles new card form
        self.toggleNewCard();

        //Setup payment controller
        self.paymentController();

    };

    /**
     * Create token and add it to form or display error
     */
    self.createToken = function() {
        console.log(address.country);
        $stripe.createToken($card.element, {
            address_country: address.country,
            address_line1: address.line1,
            address_zip: address.zip,
            name: address.name,
        }).then(function(result) {
            if (result.error) {
                // Inform the user if there was an error and reset token
                $errorElement.text(result.error.message).addClass('validation-advice');
                self.resetToken();
            } else {
                // Remove error and add token to form
                $errorElement.empty().removeClass('validation-advice')
                self.setToken(result.token.id);
            }
        });
    };

    /**
     * Empty field for token
     */
    self.resetToken = function() {
        $inputs.cardToken.val('');
    };

    /**
     * Set field for token
     */
    self.setToken = function(val) {
        $inputs.cardToken.val(val);
    };

    /**
     * Controller for payment
     *
     */
    self.paymentController = function() {

        //If frontend payment
        if (typeof Payment !== 'undefined') {

            //Get billing address
            if (typeof billing !== 'undefined') {
                self.getBillingAddressFrontend();
            }

            // Add listeners
            self.addEventsListeners();

        } else if (typeof AdminOrder !== 'undefined') { //Admin payment

            // Add listeners
            self.addEventsListeners();

            //Wrap get payment data method
            AdminOrder.prototype.getPaymentData = AdminOrder.prototype.getPaymentData.wrap(self.paymentDataChange);

        }

    };

    /**
     * Add listener on Stripe elements
     *
     */
    self.addEventsListeners = function() {
        $card.element.addEventListener('change', function(event) {
            if (event.error) {
                $errorElement.text(event.error.message).addClass('validation-advice');
                self.resetToken();
            } else {
                $errorElement.empty().removeClass('validation-advice');
                self.createToken();
            }
        });
    };

    /**
     * Toggles new card form
     *
     */
    self.toggleNewCard = function() {

        //Toggle new card form
        $inputs.savedCard.change(function () {
            $inputs.savedCard
                .parent()
                .removeClass('district-label-active')
                .end()
                .filter($(this)).parent().addClass('district-label-active');

            if ($(this).val() === '') {
                $('#stripe-cards-select-new').show();
                self.disableContinueBtn(true);
            } else {
                $('#stripe-cards-select-new').hide();
                self.disableContinueBtn(false);
            }
        });
    };

    /**
     * Listens for payment method change
     *
     */
    self.paymentMethodListener = function() {

        //On initial load
        self.disableContinueBtn(true);

        //Toggle continue button on payment method change
        $('input[name=payment\\[method\\]]').click(function() {
            self.disableContinueBtn(true);
        });

    };

    /**
     * Initialize the form
     *
     */
    self.initForm = function() {
        // Create stripe element
        $card.element = $stripe.elements().create('card', {style: {}});
        $card.element.mount($card.htmlId);
    };

    /**
     * Initialize class variables
     *
     */
    self.initVars = function() {

        //Elements
        $inputs.cardToken = $('input#stripe_token');
        $inputs.savedCard = $('input[name=stripeSavedCard]');
        $inputs.continueBtn = $('#payment-buttons-container button:first');

        // Error
        $errorElement = $('#stripe-card-errors');
    };

    /**
     * Toggle continue button
     *
     * @param state
     */
    self.disableContinueBtn = function (state) {

        //If not stripe payment method, enable the continue button
        if(typeof payment === 'undefined' || payment.currentMethod !== 'stripe_cc') {
            state = false;
        }

        $inputs.continueBtn.prop('disabled', state).toggleClass('disabled', state);
    };

    /**
     * Runs when updating payment form in admin
     *
     * @param getPaymentData
     */
    self.paymentDataChange = function (getPaymentData) {

        self.getBillingAddressAdmin();

        getPaymentData();

    };

    /**
     * Get billing address in frontend
     *
     */
    self.getBillingAddressFrontend = function () {

        //Get billing address select element
        var $billingAddress = $('#billing-address-select');

        //If the element exists and the value is not empty
        if ($billingAddress.length && $billingAddress.val() != '') {
            $.ajax({
                url: billing.addressUrl + $billingAddress.val()
            }).done(function (data) {
                address.line1 = data.street1;
                address.zip = data.postcode;
                address.country = data.country_id;
                address.name = data.firstname + ' ' + data.lastname
            });
        } else {
            address.line1 = $('#billing\\:street1').val();
            address.zip = $('#billing\\:postcode').val();
            address.country = $('#billing\\:country_id').val();
            address.name = $('#billing\\:firstname').val() + ' ' + $('#billing\\:lastname').val();
        }

    };

    /**
     * Get billing address in admin
     *
     */
    self.getBillingAddressAdmin = function () {

        address.line1 = $('#order-billing_address_street0').val();
        address.zip = $('#order-billing_address_postcode').val();
        address.country = $('#order-billing_address_country_id').val();
        address.name = $('#order-billing_address_firstname').val() + ' ' + $('#order-billing_address_lastname').val();

    };

    return self;

}(window.district.$ || window.jQuery);
