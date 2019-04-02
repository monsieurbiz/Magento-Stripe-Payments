<?php
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

class District_Stripe_IndexController extends Mage_Core_Controller_Front_Action
{
    /**
     * Receive a webhook
     */
    public function webhookAction()
    {
        // Set Stripe Api Key
        Mage::helper('stripe')->setApiKey();

        // Retrieve the payload
        $payload = $this->getRequest()->getRawBody();
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
        $event = null;

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload, $sig_header, Mage::getStoreConfig('payment/stripe_cc/webhook_signing_secret')
            );
        } catch (\UnexpectedValueException $e) {
            $this->_stop('404 Not Found');
            return;
        } catch (\Stripe\Error\SignatureVerification $e) {
            $this->_stop('404 Not Found');
            return;
        }
        $response = $this->getResponse();

        try {
            Mage::dispatchEvent('stripe_webhook_received_' . str_replace('.', '_', $event['type']), [
                'payload' => $event,
                'request' => $this->getRequest(),
                'response' => $response,
            ]);
        } catch (Exception $e) {
            $response
                ->setHttpResponseCode(400)
                ->appendBody($e->getMessage());
        }
    }

    /**
     * @param string $httpCode
     * @param null|string $x Details
     */
    protected function _stop($httpCode, $x = null)
    {
        header(sprintf('HTTP/1.1 %s', $httpCode));
        if (null !== $x) {
            header(sprintf('X-Details: %s', $x));
        }
        exit;
    }
}
