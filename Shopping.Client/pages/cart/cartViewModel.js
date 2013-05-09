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

(function (WinJS, nav, api) {
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
            this._initObservable();

            this.username = '';

            this.customerId = "";
            this.appId = "";

            this.canSignout = false;

            this.submitOrderCommand = new Shopping.Binding.RelayCommand(this.submitOrder);
        }, {

            initAsync: function () {
                var self = this;
                var cart = this.cart = api.cart;
                
                var items = _.map(cart.items(), function(v, k) {
                    var itemVm = new CartItemViewModel(v);
                    var initailizing = true;
                    itemVm.bind("Quantity", function (newValue) {
                        if (!initailizing) {
                            self.processQuantityChangedAsync(v, newValue).then(function () {
                                // reload the totals
                                var index = self.items.indexOf(itemVm);
                                self.items.splice(index, 1);
                                itemVm.updateProperty("Total", itemVm.Total);
                                self.initializeTotals();
                            });
                            
                        }
                    });
                    initailizing = false;
                    return itemVm;
                });
                this.items = new WinJS.Binding.List(items);

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
                this.subTotal = this.cart.subtotal();
                this.tax = this.cart.tax();
                this.shipping = this.cart.shipping();
                this.total = this.cart.total();
            },
            
            processQuantityChangedAsync: function (item, quantity) {
                var action = quantity <= 0 ? 'remove' : 'updateQuantity';

                var command = {
                    action: action,
                    item: item,
                    newQuantity: quantity
                };

                return api.cart.processCommandAsync(command);
            },
            
            submitOrder: function() {
                api.cart.submitOrder();
                nav.navigate('/pages/thankYou/thankYou.html');
            }
        })
    });

    WinJS.Class.mix(Shopping.ViewModel.CartViewModel,
        WinJS.Binding.mixin,
        WinJS.Binding.expandProperties({ subTotal: 0.0, shipping: 0.0, tax: 0.0, total: 0.0 }));

})(WinJS, WinJS.Navigation, Shopping.Api);