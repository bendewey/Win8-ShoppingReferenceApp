//*************************************************************************
//
//    Copyright (c) 2013 Tallan Inc.  All rights reserved. 
//
//    Use of this sample source code is subject to the terms of the Microsoft Limited Public License
//    at http://msdn.microsoft.com/en-us/cc300389.aspx#P and is provided AS-IS. 
//
//    For more information about Tallan, visit our website, http://tallan.com/.     
//
//    To see the topic that inspired this sample app, go to http://msdn.microsoft.com/en-us/library/windows/apps/jj635241. 
//
//*************************************************************************


/// <reference path="ms-appx://Microsoft.WinJS.1.0/js/base.js" />
/// <reference path="/js/api.js" />

(function (WinJS, api) {
    "use strict";

    var CartItemViewModel = WinJS.Binding.define({
        
        Price: 0.0,
        Quantity: 0,
        Size: "",
        Color: "",
        MainImage: "",
        Name: ""
    });

    Object.defineProperty(CartItemViewModel.prototype, "Total", {
        get: function () { return this.Price * this.Quantity; }
    });

    WinJS.Namespace.define("Shopping.ViewModel", {

        CartViewModel : WinJS.Class.define(function CartViewModel_ctor() {

            this.username = '';

            this.customerId = "";
            this.appId = "";

            this.canSignout = false;
            this._initObservable(this);
        }, {

            initAsync: function () {
                var self = this;
                var cart = this.cart = api.cart;
                
                this.items = _.map(cart.items(), function(v, k) {
                    var itemVm = new CartItemViewModel(v);
                    var initailizing = true;
                    itemVm.bind("Quantity", function (newValue) {
                        if (!initailizing) {
                            itemVm.updateProperty("Total", itemVm.Total);
                            self.processQuantityChanged(v, newValue);
                        }
                    });
                    initailizing = false;
                    return itemVm;
                });

                this.initializeTotals();
                if (cart.cart) {
                    this.HasAddresses = cart.cart.BillingAddress.Line1 && Shopping.Api.cart.cart.BillingAddress.Line1 != "";
                    this.HasPayment = cart.cart.PaymentInfo.CardType && Shopping.Api.cart.cart.PaymentInfo.CardType != "";
                    this.BillingAddress = cart.cart.BillingAddress;
                    this.ShippingAddress = cart.cart.ShippingAddress;
                    this.PaymentInfo = cart.cart.PaymentInfo;
                    this.SameAddresses = cart.cart.SameAddresses;
                }

                return WinJS.Promise.as(this);
            },
            
            initializeTotals : function() {
                this.updateProperty("subTotal", this.cart.subtotal());
                this.updateProperty("tax", this.cart.tax());
                this.updateProperty("shipping", this.cart.shipping());
                this.updateProperty("total", this.cart.total());
            },
            
            processQuantityChanged: function (item, quantity) {
                var self = this;
                var action = quantity <= 0 ? 'remove' : 'updateQuantity';

                var command = {
                    action: action,
                    item: item,
                    newQuantity: quantity
                };

                api.cart.processCommandAsync(command).then(function () {
                    // reload the totals
                    self.initializeTotals();
                });
            }

        })
    });

    WinJS.Class.mix(Shopping.ViewModel.CartViewModel, WinJS.Binding.mixin);

})(WinJS, Shopping.Api);